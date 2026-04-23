import { InfoWithSource } from "../../types"

export interface Meta {
  __index: string
  __errors?: Error | null
}
export type Error = Record<string, InfoWithSource>
export type Errors = Record<string, Error>
