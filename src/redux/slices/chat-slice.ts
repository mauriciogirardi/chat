import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ChatType } from '@/interfaces/chat'
import { GetAllChats } from '@/server-actions/chats'

export type ChatState = {
  chats: ChatType[]
  isLoadingChats: boolean
  selectedChat: ChatType | null
}

type LoadChatArgs = {
  userId: string
}

const initialState: ChatState = {
  chats: [],
  isLoadingChats: true,
  selectedChat: null,
}

export const loadChats = createAsyncThunk<ChatType[] | undefined, LoadChatArgs>(
  'chat/load',
  async ({ userId }) => {
    try {
      const data = await GetAllChats(userId)
      return data
    } catch (error) {
      console.error(error)
    }
  },
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,

  reducers: {
    setSelectedChat: (state, action: PayloadAction<ChatType | null>) => {
      state.selectedChat = action.payload
    },

    setChats: (state, action: PayloadAction<ChatType[]>) => {
      state.chats = action.payload
    },
  },

  extraReducers(builder) {
    builder.addCase(loadChats.pending, (state) => {
      state.isLoadingChats = true
    })

    builder.addCase(loadChats.fulfilled, (state, action) => {
      state.chats = action.payload || []
      state.isLoadingChats = false
    })
  },
})

export const { setSelectedChat, setChats } = chatSlice.actions
export const chat = chatSlice.reducer
