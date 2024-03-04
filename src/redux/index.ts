import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { chat } from './slices/chat-slice'
import { searchFilter } from './slices/search-slice'
import { currentUser } from './slices/user-slice'

export const store = configureStore({
  reducer: {
    user: currentUser,
    chat,
    searchFilter,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
