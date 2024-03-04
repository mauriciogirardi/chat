import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ChatState = {
  search?: string
}

const initialState: ChatState = {
  search: '',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,

  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
  },
})

export const { setSearchFilter } = searchSlice.actions
export const searchFilter = searchSlice.reducer
