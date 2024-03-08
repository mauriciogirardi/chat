import mongoose from 'mongoose'

import { env } from '@/env'

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URL, {
      connectTimeoutMS: 10000,
    })
    console.log('MongoDB connected!!')
  } catch (error) {
    console.error(error)
  }
}
