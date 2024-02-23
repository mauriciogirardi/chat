import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UserType } from '@/interfaces/user'
import { GetCurrentUserFromMongoDB } from '@/server-actions/users'

export type CurrentUserState = {
  currentUserData: UserType | null
  currentUserId: string
  isLoading: boolean
}

const initialState: CurrentUserState = {
  currentUserData: null,
  currentUserId: '',
  isLoading: true,
}

export const loadCurrentUser = createAsyncThunk<UserType>(
  'user/load',
  async () => {
    try {
      const data = await GetCurrentUserFromMongoDB()
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

    setCurrentId: (state, action) => {
      state.currentUserId = action.payload
    },
  },

  extraReducers(builder) {
    builder.addCase(loadCurrentUser.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(loadCurrentUser.fulfilled, (state, action) => {
      state.currentUserData = action.payload
      state.currentUserId = action.payload.clerkUserId
      state.isLoading = false
    })
  },
})

export const { setCurrentId, setCurrentUser } = userSlice.actions
export const currentUser = userSlice.reducer
