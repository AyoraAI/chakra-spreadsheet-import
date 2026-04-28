import { useContext } from "react"
import { RsiContext } from "../components/Providers"
import type { RsiProps } from "../types"
import type { MarkRequired } from "ts-essentials"
import type { Translations } from "../translationsRSIProps"

type DefaultRsiPropKeys =
  | "autoMapHeaders"
  | "autoMapSelectValues"
  | "allowInvalidSubmit"
  | "autoMapDistance"
  | "isNavigationEnabled"
  | "translations"
  | "uploadStepHook"
  | "selectHeaderStepHook"
  | "matchColumnsStepHook"
  | "dateFormat"
  | "parseRaw"

type UseRsiValue<T extends string> = MarkRequired<RsiProps<T>, DefaultRsiPropKeys> & {
  translations: Translations
}

export const useRsi = <T extends string>(): UseRsiValue<T> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  useContext<UseRsiValue<T>>(RsiContext)
