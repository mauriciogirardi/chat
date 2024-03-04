'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { EmojiClickData, Theme } from 'emoji-picker-react'
import { FileImage, Loader2, Send, SmilePlus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ImageSelector } from '@/components/image-selector'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { socket } from '@/config/socket-config'
import { uploadImageToFirebaseAndReturnURL } from '@/helpers/upload-image-to-firebase-and-return-URL.ts'
import { useAppSelector } from '@/redux'
import {
  SendNewMessage,
  SendNewMessagePayload,
} from '@/server-actions/messages'

const Picker = dynamic(
  () => {
    return import('emoji-picker-react')
  },
  { ssr: false },
)

const formDataSchema = z.object({
  text: z.string().min(1),
})

type FormData = z.infer<typeof formDataSchema>

export function NewMessage() {
  const currentUserData = useAppSelector((state) => state.user.currentUserData)
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const [openEmoji, setOpenEmoji] = useState(false)
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    resetField,
    watch,
    setValue,
    getValues,
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
  })

  setFocus('text', { shouldSelect: true })

  const handleSelectEmoji = ({ emoji }: EmojiClickData) => {
    const currentValue = getValues('text')
    setValue('text', currentValue + emoji)
    setOpenEmoji(false)
  }

  const sendMessage = async (text: string, image?: string) => {
    try {
      if (!currentUserData || !selectedChat) return

      const commonPayload = {
        text,
        image,
        socketMessageId: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
      }

      const socketPayload = {
        ...commonPayload,
        chat: selectedChat,
        sender: currentUserData,
      }
      socket.emit('send-new-message', socketPayload)

      const data: SendNewMessagePayload = {
        ...commonPayload,
        sender: currentUserData._id,
        chat: selectedChat._id,
      }
      await SendNewMessage(data)

      resetField('text')
    } catch {
      toast.error('Error sending message, try again!')
    }
  }

  const handleSendImage = async () => {
    try {
      setIsLoadingImage(true)
      const text = getValues('text')
      if (!currentUserData || !selectedChat || !imageFile) return

      let image = ''
      if (imageFile) {
        image = await uploadImageToFirebaseAndReturnURL({
          file: imageFile,
          nameFile: imageFile.name,
        })
      }

      sendMessage(text, image)
      setImageFile(null)
    } catch {
      toast.error('Error to send image, try again!')
    } finally {
      setIsLoadingImage(false)
    }
  }

  const handleSendMessage = async ({ text }: FormData) => {
    sendMessage(text)
  }

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.text) {
        socket.emit('typing', {
          chat: selectedChat,
          senderId: currentUserData?._id,
          senderName: currentUserData?.name,
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, selectedChat, currentUserData?._id, currentUserData?.name])

  return (
    <footer className="flex items-center gap-3">
      <DropdownMenu open={openEmoji} onOpenChange={setOpenEmoji}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            type="button"
            size="icon"
            className="w-16 cursor-pointer"
            aria-label="Choose an emoji"
          >
            <SmilePlus className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Picker
            onEmojiClick={handleSelectEmoji}
            theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <ImageSelector onChangeFile={setImageFile} onSend={handleSendImage}>
        <Button
          variant="outline"
          type="button"
          size="icon"
          className="w-16 cursor-pointer"
          aria-label="Choose an image"
        >
          {isLoadingImage ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <FileImage className="size-5" />
          )}
        </Button>
      </ImageSelector>

      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className="flex w-full items-center gap-3"
      >
        <Input
          placeholder="Type a message"
          autoComplete="off"
          {...register('text')}
        />
        <Button
          variant="secondary"
          type="submit"
          size="icon"
          className="w-20"
          aria-label="Send message"
        >
          <Send className="size-5" />
        </Button>
      </form>
    </footer>
  )
}
