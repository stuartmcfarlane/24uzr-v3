export interface IUser {
  id: number
  email: string
  name: string
}
export type UserContextType = {
  user: IUser | undefined
  setUser: (user: IUser) => void
  updateUser: (user: IUser) => void
  logout: () => void
}

export interface IMap {
  id: number
  name: string
}