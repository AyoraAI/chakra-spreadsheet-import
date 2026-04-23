import { createContext } from "react"
import type { RsiProps } from "../types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RsiContext = createContext({} as any)

interface ProvidersProps<T extends string> {
  children: React.ReactNode
  rsiValues: RsiProps<T>
}

export const rootId = "chakra-modal-rsi"

export const Providers = <T extends string = string>({
  children,
  rsiValues,
}: ProvidersProps<T>) => {
  return <RsiContext.Provider value={rsiValues}>{children}</RsiContext.Provider>
}
