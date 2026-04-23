import type { RawData } from "../../types"

export interface MatchColumnsProps<T extends string> {
  data: RawData[]
  headerValues: RawData
  onContinue: (data: unknown[], rawData: RawData[], columns: Columns<T>) => void
  onBack?: () => void
}

export enum ColumnType {
  empty,
  ignored,
  matched,
  matchedCheckbox,
  matchedSelect,
  matchedSelectOptions,
}

export interface MatchedOptions<T> {
  entry: string
  value: T
}

interface EmptyColumn {
  type: ColumnType.empty
  index: number
  header: string
}

interface IgnoredColumn {
  type: ColumnType.ignored
  index: number
  header: string
}

interface MatchedColumn<T> {
  type: ColumnType.matched
  index: number
  header: string
  value: T
}

interface MatchedSwitchColumn<T> {
  type: ColumnType.matchedCheckbox
  index: number
  header: string
  value: T
}

export interface MatchedSelectColumn<T> {
  type: ColumnType.matchedSelect
  index: number
  header: string
  value: T
  matchedOptions: Partial<MatchedOptions<T>>[]
}

export interface MatchedSelectOptionsColumn<T> {
  type: ColumnType.matchedSelectOptions
  index: number
  header: string
  value: T
  matchedOptions: MatchedOptions<T>[]
}

export type Column<T extends string> =
  | EmptyColumn
  | IgnoredColumn
  | MatchedColumn<T>
  | MatchedSwitchColumn<T>
  | MatchedSelectColumn<T>
  | MatchedSelectOptionsColumn<T>

export type Columns<T extends string> = Column<T>[]
