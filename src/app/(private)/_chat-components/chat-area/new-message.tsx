'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { EmojiClickData, Theme } from 'emoji-picker-react'
import { Send, SmilePlus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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
  text: z.string(),
})

type FormData = z.infer<typeof formDataSchema>

export function NewMessage() {
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)

  const [openEmoji, setOpenEmoji] = useState(false)
  const { theme } = useTheme()

  const { register, handleSubmit, resetField } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
  })

  const handleSelectEmoji = ({ emoji }: EmojiClickData) => {
    console.log(emoji)
    setOpenEmoji(false)
  }

  const handleSendMessage = async ({ text }: FormData) => {
    try {
      if (!currentUserId || !selectedChat) return

      const data: SendNewMessagePayload = {
        text,
        image: '',
        sender: currentUserId,
        chat: selectedChat._id,
      }

      await SendNewMessage(data)

      resetField('text')
    } catch {
      toast.error('Error send a message, try again!')
    }
  }

  return (
    <footer className="flex items-center gap-3">
      <DropdownMenu open={openEmoji} onOpenChange={setOpenEmoji}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            type="button"
            size="icon"
            className="w-20 cursor-pointer"
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

      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className="flex w-full items-center gap-3"
      >
        <Input placeholder="Type a message" {...register('text')} />
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
