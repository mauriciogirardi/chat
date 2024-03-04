import { deleteModel, Document, model, models, Schema } from 'mongoose'

interface MessageData extends Document {
  chat: Schema.Types.ObjectId
  sender: Schema.Types.ObjectId
  readBy: Schema.Types.ObjectId[]
  text: string
  image: string
  socketMessageId: string
}

const messageSchema = new Schema<MessageData>(
  {
    socketMessageId: {
      type: String,
      default: '',
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'chats',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'users',
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
      default: [],
    },
  },
  { timestamps: true },
)

if (models && models.messages) {
  deleteModel('messages')
}

const MessageModel = model<MessageData>('messages', messageSchema)
export default MessageModel
