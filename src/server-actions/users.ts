'use server'

import { currentUser } from '@clerk/nextjs'

import { connectMongoDB } from '@/config/db-config'
import UserModel from '@/models/user-models'

connectMongoDB()

export const GetCurrentUserFromMongoDB = async () => {
  try {
    const clerkUser = await currentUser()
    const alreadyUserExistis = await UserModel.findOne({
      clerkUserId: clerkUser?.id,
    })

    if (alreadyUserExistis) {
      return JSON.parse(JSON.stringify(alreadyUserExistis))
    }

    if (clerkUser) {
      const { id, firstName, lastName, username, emailAddresses, imageUrl } =
        clerkUser

      const fullName = firstName + '' + lastName

      const newUserPayload = {
        clerkUserId: id,
        name: fullName.replaceAll('null', ''),
        username,
        email: emailAddresses[0]?.emailAddress || '',
        profilePicture: imageUrl,
      }

      const newUser = await UserModel.create(newUserPayload)
      return JSON.parse(JSON.stringify(newUser))
    }
  } catch (error) {
    throw error
  }
}

export const GetAllUsers = async () => {
  try {
    const users = await UserModel.find()
    return users
  } catch (error) {
    throw error
  }
}

type UploadUserProfileProps = {
  userId: string
  profilePicture: string
}

export const UploadUserProfile = async ({
  profilePicture,
  userId,
}: UploadUserProfileProps) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture },
      {
        new: true,
      },
    )
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    throw error
  }
}
