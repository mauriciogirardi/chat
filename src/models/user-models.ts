import { deleteModel, Document, model, models, Schema } from 'mongoose'

interface UserData extends Document {
  clerkUserId: string
  name: string
  username: string
  email?: string
  profilePicture: string
  bio: string
}

const userSchema = new Schema<UserData>(
  {
    clerkUserId: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
    },
    profilePicture: {
      type: String,
      require: false,
    },
    bio: {
      type: String,
      require: false,
    },
  },
  { timestamps: true },
)

if (models && models.users) {
  deleteModel('users')
}

const UserModel = model<UserData>('users', userSchema)
export default UserModel
