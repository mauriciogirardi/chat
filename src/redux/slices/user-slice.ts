import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getCurrentUserFromMongoDB } from '@/api/get-current-user-from-mongo-db'
import { UserType } from '@/interfaces/user'

export type CurrentUserState = {
  currentUserData?: UserType | null
  currentUserId: string
  isLoading: boolean
  onlineUsers: string[]
}

const initialState: CurrentUserState = {
  currentUserData: null,
  currentUserId: '',
  isLoading: true,
  onlineUsers: [],
}

export const loadCurrentUser = createAsyncThunk<UserType | null | undefined>(
  'user/load',
  async () => {
    try {
      const data = await getCurrentUserFromMongoDB()

      return data
    } catch (error) {
      console.error(error)
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserType | null>) => {
      state.currentUserData = action.payload
    },

    setCurrentId: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload
    },

    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload
    },
  },

  extraReducers(builder) {
    builder.addCase(loadCurrentUser.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(loadCurrentUser.fulfilled, (state, action) => {
      state.currentUserData = action.payload
      state.currentUserId = action.payload?._id || ''
      state.isLoading = false
    })
  },
})

export const { setCurrentId, setCurrentUser, setOnlineUsers } =
  userSlice.actions
export const currentUser = userSlice.reducer
