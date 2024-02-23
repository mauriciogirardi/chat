import { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { store } from '@/redux'

type ReduxProviderProps = {
  children: ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
