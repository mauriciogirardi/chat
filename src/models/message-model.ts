import { deleteModel, Document, model, models, Schema } from 'mongoose'

interface MessageData extends Document {
  chat: Schema.Types.ObjectId
  sender: Schema.Types.ObjectId
  readBy: Schema.Types.ObjectId[]
  text: string
  image: string
}

const messageSchema = new Schema<MessageData>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'chats',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'chats',
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    readBy: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
    },
  },
  { timestamps: true },
)

if (models && models.messages) {
  deleteModel('messages')
}

const MessageModel = model<MessageData>('messages', messageSchema)
export default MessageModel
