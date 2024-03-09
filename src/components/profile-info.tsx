'use client'
import { useClerk } from '@clerk/nextjs'
import { format } from 'date-fns'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { Check, Loader2, LogOut, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, ReactNode, useState } from 'react'
import { toast } from 'sonner'

import { uploadUserProfile } from '@/api/upload-user-profile'
import { storageUpload } from '@/config/firebase'
import { socket } from '@/config/socket-config'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setSelectedChat } from '@/redux/slices/chat-slice'
import { setCurrentId, setCurrentUser } from '@/redux/slices/user-slice'

import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import * as D from './ui/drawer'

type ProfileInfoProps = {
  children: ReactNode
}

export function ProfileInfo({ children }: ProfileInfoProps) {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user.currentUserData)

  const router = useRouter()
  const { signOut } = useClerk()

  async function handleSignOut() {
    try {
      setIsLoading(true)
      socket.emit('logout', user?._id)
      await signOut()

      dispatch(setSelectedChat(null))
      dispatch(setCurrentUser(null))
      dispatch(setCurrentId(''))

      setOpen(false)
      router.push('/sign-in')
    } catch {
      toast.error(
        'There was an error logging out of the application, try again!',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return
    setSelectedFile(event.target.files[0])
  }

  async function handleUpdateProfile() {
    try {
      if (!selectedFile || !user?._id) return

      const storageRef = ref(storageUpload, `files/${user._id}`)

      const uploadTask = uploadBytesResumable(storageRef, selectedFile)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setIsLoadingProfile(uploadProgress !== 0)
        },
        (error) => {
          console.error('Error uploading image', error)
          toast.error('Error uploading image!')
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          const userUpdate = await uploadUserProfile({
            profilePicture: downloadURL,
            userId: user._id,
          })

          userUpdate && dispatch(setCurrentUser(userUpdate))

          toast.success('Profile picture updated successfully!')
          setIsLoadingProfile(false)
          setSelectedFile(null)
        },
      )
    } catch (error) {
      console.error('Error getting download URL:', error)
      toast.error('Error getting download URL!')
    }
  }

  return (
    <D.Drawer direction="left" onOpenChange={setOpen} open={open}>
      <D.DrawerTrigger asChild className="cursor-pointer">
        {children}
      </D.DrawerTrigger>

      <D.DrawerContent className="h-screen w-full border dark:border-r-zinc-800 md:w-96">
        <D.DrawerHeader className="flex items-center justify-between">
          <h3 className="text-left text-2xl font-medium text-muted-foreground">
            Profile
          </h3>
          <D.DrawerClose className="cursor-pointer text-muted-foreground outline-none hover:text-muted-foreground/80 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-violet-500">
            <X />
          </D.DrawerClose>
        </D.DrawerHeader>

        <div className="mt-6 px-6">
          <div className="flex flex-col items-center">
            <label
              className="group inline-flex cursor-pointer flex-col items-center justify-center gap-5"
              htmlFor="picture"
            >
              <Avatar className="size-20 2xl:size-28">
                <AvatarImage
                  className="object-cover"
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : user?.profilePicture
                  }
                />
              </Avatar>

              <p className="text-sm text-zinc-900 group-hover:text-muted-foreground dark:text-zinc-200 2xl:text-base">
                Change profile picture
              </p>

              <input
                type="file"
                className="sr-only"
                id="picture"
                accept="image/*"
                onChange={handleFileSelected}
              />
            </label>
          </div>

          <div className="my-6 h-px w-full bg-zinc-200 dark:bg-zinc-800 2xl:my-10" />

          <div className=" space-y-5">
            <Label label="Your Name" value={user?.name} />
            <Label label="Your Username" value={user?.username} />
            <Label label="Your ID" value={user?.clerkUserId} />
            <Label
              label="Created on"
              value={
                user?.createdAt
                  ? format(user.createdAt, "dd MMMM yyyy ',' p")
                  : ''
              }
            />
          </div>
        </div>

        <D.DrawerFooter>
          <Button
            className="mt-8 w-full"
            variant="secondary"
            type="button"
            disabled={!selectedFile}
            onClick={handleUpdateProfile}
          >
            {isLoadingProfile ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Save
                <Check className="ml-4 size-4" />
              </>
            )}
          </Button>

          <Button
            className="mt-2 w-full"
            variant="outline"
            type="button"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <>
              Logout
              {isLoading ? (
                <Loader2 className="ml-4 size-5 animate-spin" />
              ) : (
                <LogOut className="ml-4 size-4" />
              )}
            </>
          </Button>
        </D.DrawerFooter>
      </D.DrawerContent>
    </D.Drawer>
  )
}

export function Label({ label, value }: { label: string; value?: string }) {
  return value ? (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground 2xl:text-sm">
        {label}
      </span>
      <span className="text-sm 2xl:text-base">{value}</span>
    </div>
  ) : null
}
