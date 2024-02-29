import mongoose, {
  deleteModel,
  Document,
  model,
  models,
  Schema,
} from 'mongoose'

interface ChatData extends Document {
  users: Schema.Types.ObjectId[]
  createdBy: Schema.Types.ObjectId
  lastMessage: Schema.Types.ObjectId
  isGroupChat: boolean
  groupName: string
  groupProfilePicture: string
  groupBio: string
  groupAdmins: Schema.Types.ObjectId[]
  unreadCounts: object
}

const chatSchema = new Schema<ChatData>(
  {
    users: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'messages',
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: '',
    },
    groupProfilePicture: {
      type: String,
      default: '',
    },
    groupBio: {
      type: String,
      default: '',
    },
    groupAdmins: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
    },
    unreadCounts: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
)

if (models && models.chats) {
  deleteModel('chats')
}

if (!mongoose.models.messages) {
  require('./message-model')
}

const ChatModel = model<ChatData>('chats', chatSchema)
export default ChatModel
