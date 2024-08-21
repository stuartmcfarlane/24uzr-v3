export interface IUser {
  email: string
  fistName: string
  lastName: string
}
export type UserContextType = {
  user: IUser | undefined
  setUser: (user: IUser) => void
  updateUser: (user: IUser) => void
  logout: () => void
}