'use client'

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { storageUpload } from '@/config/firebase'

type storeUploadFileProps = {
  file: File
  userId?: string
  nameFile?: string
}

export async function uploadImageToFirebaseAndReturnURL({
  file,
  userId,
  nameFile,
}: storeUploadFileProps) {
  try {
    if (!file) return ''

    const storageRef = ref(storageUpload, `files/${nameFile || userId}`)
    const uploadedImageResponse = await uploadBytes(storageRef, file)
    const url = getDownloadURL(uploadedImageResponse.ref)
    return url
  } catch (error) {
    throw error
  }
}
