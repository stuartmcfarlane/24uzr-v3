export type Timestamp = Date | string

export const timestamp2string = (timestamp: Timestamp) => typeof timestamp === "string" ? timestamp : timestamp.toISOString()
export const timestamp2date = (timestamp: Timestamp) => typeof timestamp === "string" ? new Date(timestamp) : timestamp

export const seconds2hours = (s: number) => s / (60 * 60)
export const hours2seconds = (h: number) => h * 60 * 60
export const now = () => new Date() as Timestamp

export const timestamp2epoch = (timestamp: Timestamp) => timestamp2date(timestamp).getTime() / 1000
export const epoch2timestamp = (epoch: number) => new Date(epoch * 1000) as Timestamp

export const hoursBetween = (t1: Timestamp) => (t2: Timestamp) => seconds2hours(timestamp2epoch(t2) - timestamp2epoch(t1))
export const addSeconds = (s: number) => (ts: Timestamp) => epoch2timestamp(timestamp2epoch(ts) + s)