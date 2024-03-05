'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FilePlus2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { socket } from '@/config/socket-config'
import { uploadImageToFirebaseAndReturnURL } from '@/helpers/upload-image-to-firebase-and-return-URL.ts'
import { ChatType } from '@/interfaces/chat'
import { UserType } from '@/interfaces/user'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setSelectedChat } from '@/redux/slices/chat-slice'
import { ChatData, CreateNewChat, UpdateChat } from '@/server-actions/chats'

import { FieldForm } from './field-form'
import { FormData, schemaForm } from './schema-form'
import { SelectedUsers } from './selected-users'
import { SkeletonForm } from './skeleton-form'

type FormGroupProps = {
  users?: UserType[]
  initialData?: ChatType
}

export function FormGroup({ users = [], initialData }: FormGroupProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const usersInitial = initialData?.users.filter(
    (user) => user._id !== currentUserId,
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      groupBio: initialData?.groupBio || '',
      groupName: initialData?.groupName || '',
      users: usersInitial?.map((user) => user._id) || [],
    },
  })

  const handleImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target

      if (files) {
        setSelectedFile(files[0])
      }
    },
    [],
  )

  const handleClearForm = () => {
    setSelectedFile(null)
    reset({
      groupBio: '',
      groupName: '',
      groupProfilePictureFile: null,
      users: [],
    })
  }

  const handleCancel = () => {
    handleClearForm()
    router.push('/')
  }

  const handleSubmitGroup = async ({
    groupBio,
    groupName,
    users,
    groupProfilePictureFile,
  }: FormData) => {
    if (!currentUserId) return

    try {
      const chatData: ChatData = {
        groupName,
        groupBio,
        users: [...users, currentUserId],
        createdBy: currentUserId,
        isGroupChat: true,
        groupProfilePicture: initialData?.groupProfilePicture || '',
      }

      if (groupProfilePictureFile) {
        chatData.groupProfilePicture = await uploadImageToFirebaseAndReturnURL({
          file: groupProfilePictureFile,
          userId: currentUserId,
          nameFile: `group_${currentUserId}`,
        })
      }

      if (initialData?._id) {
        await UpdateChat(initialData._id, chatData)
      } else {
        const response = await CreateNewChat(chatData)

        const payloadSocket = {
          chats: response,
          userId: currentUserId,
          type: 'group',
        }

        socket.emit('add-user-chat', payloadSocket)
      }

      toast.success(
        initialData?._id
          ? 'Group updated successfully!'
          : 'Group created successfully!',
      )

      dispatch(setSelectedChat(null))
      handleClearForm()
      router.push('/')
    } catch {
      toast.error('Error create group, try again!')
    }
  }

  if (!users && !initialData && !currentUserId) {
    return <SkeletonForm />
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitGroup)}
      className="flex flex-col gap-6 md:flex-row"
    >
      <SelectedUsers
        control={control}
        users={users}
        hasError={!!errors.users}
        initialCount={usersInitial?.length}
        isDisabled={isSubmitting}
      />

      <div className="w-full">
        <div className="flex flex-col items-center gap-11 md:flex-row md:items-start">
          <FieldForm
            htmlFor="groupProfilePicture"
            label=" Group Profile Picture"
            errorMessage={errors.groupProfilePictureFile?.message}
            className="md:inline-flex"
          >
            <>
              <Avatar className="ml-4 mt-2 size-28 cursor-pointer">
                <AvatarImage
                  className="object-cover"
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : initialData?.groupProfilePicture
                  }
                />
                <AvatarFallback className="flex flex-col text-xs hover:bg-zinc-800">
                  Selected a file
                  <FilePlus2 className="mt-2 size-5 text-violet-400" />
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="groupProfilePicture"
                className="sr-only"
                accept="image/*"
                {...register('groupProfilePictureFile')}
                onChange={handleImageChange}
              />
            </>
          </FieldForm>

          <div className="mb-9 w-full flex-1 space-y-6">
            <FieldForm
              htmlFor="groupName"
              label="Group Name"
              errorMessage={errors.groupName?.message}
            >
              <Input id="groupName" {...register('groupName')} />
            </FieldForm>

            <FieldForm
              htmlFor="groupBio"
              label="Group Description"
              errorMessage={errors.groupBio?.message}
            >
              <Textarea id="groupBio" {...register('groupBio')} />
            </FieldForm>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-end md:pt-0">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-1 size-5 animate-spin" />}
            {initialData?._id ? 'Edit Group' : 'Create Group'}
          </Button>
        </div>
      </div>
    </form>
  )
}
