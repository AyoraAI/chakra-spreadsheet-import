import merge from "lodash/merge.js"

import { Steps } from "./steps/Steps"
import { Providers } from "./components/Providers"
import type { RsiProps, RawData, Data } from "./types"
import { ModalWrapper } from "./components/ModalWrapper"
import { translations } from "./translationsRSIProps"
import { RsiToaster } from "./lib/rsiToaster"
import "./index.css"
import { Columns } from "./steps/MatchColumnsStep/types"

export const defaultRSIProps = {
  autoMapHeaders: true,
  autoMapSelectValues: false,
  allowInvalidSubmit: true,
  autoMapDistance: 2,
  isNavigationEnabled: false,
  translations: translations,
  uploadStepHook: (data: RawData[]): Promise<RawData[]> =>
    Promise.resolve(data),
  selectHeaderStepHook: (
    headerValues: RawData,
    data: RawData[],
  ): Promise<{ headerValues: RawData; data: RawData[] }> =>
    Promise.resolve({
      headerValues,
      data,
    }),
  matchColumnsStepHook: <T extends string = string>(
    table: Data<T>[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: [RawData[], Columns<T>]
  ): Promise<Data<T>[]> => Promise.resolve(table),
  dateFormat: "yyyy-mm-dd", // ISO 8601,
  parseRaw: true,
} as const satisfies Partial<RsiProps<string>>

export type {
  RsiProps,
  Fields,
  Field,
  Data,
  RawData,
  Result,
} from "./types"
export { StepType } from "./steps/UploadFlow"
export { RsiToaster, rsiToaster } from "./lib/rsiToaster"

export const ReactSpreadsheetImport = <T extends string = string>(
  propsWithoutDefaults: RsiProps<T>,
) => {
  const props = merge({}, defaultRSIProps, propsWithoutDefaults)
  const mergedTranslations =
    props.translations !== translations
      ? merge(translations, props.translations)
      : translations

  return (
    <>
      <RsiToaster />
      <Providers rsiValues={{ ...props, translations: mergedTranslations }}>
        <ModalWrapper isOpen={props.isOpen} onClose={props.onClose}>
          <Steps />
        </ModalWrapper>
      </Providers>
    </>
  )
}
