import { useContext } from "react"
import { RsiContext } from "../components/Providers"
import type { RsiProps } from "../types"
import type { MarkRequired } from "ts-essentials"
import type { defaultRSIProps } from "../"
import type { Translations } from "../translationsRSIProps"

export const useRsi = <T extends string>() =>
  useContext<
    MarkRequired<RsiProps<T>, keyof typeof defaultRSIProps> & {
      translations: Translations
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  >(RsiContext)
