'use server'

import { currentUser } from '@clerk/nextjs'

import { connectMongoDB } from '@/config/db-config'
import { UserType } from '@/interfaces/user'
import UserModel from '@/models/user-model'

connectMongoDB()

export const GetCurrentUserFromMongoDB = async (): Promise<UserType | null> => {
  try {
    const clerkUser = await currentUser()
    const alreadyUserExistis = await UserModel.findOne({
      clerkUserId: clerkUser?.id,
    })

    if (alreadyUserExistis) {
      return JSON.parse(JSON.stringify(alreadyUserExistis))
    }

    if (!clerkUser) {
      throw new Error('ClerkUser not existis!')
    }

    const { id, firstName, lastName, username, emailAddresses, imageUrl } =
      clerkUser

    const fullName = firstName + ' ' + lastName

    const newUserPayload = {
      clerkUserId: id,
      name: fullName,
      username,
      email: emailAddresses[0]?.emailAddress || '',
      profilePicture: imageUrl,
    }

    const newUser = await UserModel.create(newUserPayload)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    throw error
  }
}

export const GetAllUsers = async (): Promise<UserType[]> => {
  try {
    const users = await UserModel.find()
    return JSON.parse(JSON.stringify(users))
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
}: UploadUserProfileProps): Promise<UserType> => {
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
