'use client'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { Check, Loader2 } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

import { storageUpload } from '@/config/firebase'
import { useAppSelector } from '@/redux'
import { setCurrentUser } from '@/redux/slices/user-slice'
import { UploadUserProfile } from '@/server-actions/users'

import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

export function UploadFile() {
  const dispatch = useDispatch()
  const user = useAppSelector((state) => state.user.currentUserData)

  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

          const userUpdate = await UploadUserProfile({
            profilePicture: downloadURL,
            userId: user._id,
          })

          dispatch(setCurrentUser(userUpdate))

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
        {!selectedFile && (
          <p className="text-sm text-zinc-900 group-hover:text-muted-foreground dark:text-zinc-200 2xl:text-base">
            Change profile picture
          </p>
        )}
        <input
          type="file"
          className="sr-only"
          id="picture"
          accept="image/*"
          onChange={handleFileSelected}
        />
      </label>

      {selectedFile && (
        <Button
          className="mt-8 w-full"
          variant="secondary"
          type="button"
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
      )}
    </div>
  )
}
