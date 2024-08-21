"use client"

import { IUser, UserContextType } from '@/types/user'
import { createContext, FC, ReactNode, useState } from 'react'

export const UserContext = createContext<UserContextType | null>(null)

const UserProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<IUser | undefined>()
    const updateUser = (user: IUser) => {
      setUser(user)
    }
    const logout = () => {
        setUser(undefined)
    }
  return <UserContext.Provider value={{ user, setUser, updateUser, logout }}>{children}</UserContext.Provider>
}

export default UserProvider