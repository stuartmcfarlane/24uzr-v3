export const addSeconds = (s: number) => (d: Date) => new Date(d.getTime() + s * 1000)
export const hoursBetween = (t1: string) => (t2: string) => (new Date(t2).getTime() - new Date(t1).getTime()) / (60 * 60 * 1000)

