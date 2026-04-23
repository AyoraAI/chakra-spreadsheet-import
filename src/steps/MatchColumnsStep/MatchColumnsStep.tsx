import { useCallback, useEffect, useMemo, useState } from "react"
import { UserTableColumn } from "./components/UserTableColumn"
import { useRsi } from "../../hooks/useRsi"
import { TemplateColumn } from "./components/TemplateColumn"
import { ColumnGrid } from "./components/ColumnGrid"
import { setColumn } from "./utils/setColumn"
import { setIgnoreColumn } from "./utils/setIgnoreColumn"
import { setSubColumn } from "./utils/setSubColumn"
import { normalizeTableData } from "./utils/normalizeTableData"
import type { Field } from "../../types"
import { getMatchedColumns } from "./utils/getMatchedColumns"
import { UnmatchedFieldsAlert } from "../../components/Alerts/UnmatchedFieldsAlert"
import { findUnmatchedRequiredFields } from "./utils/findUnmatchedRequiredFields"
import { rsiToaster } from "../../lib/rsiToaster"
import {
  ColumnType,
  type Columns,
  type Column,
  type MatchColumnsProps,
} from "./types"

export const MatchColumnsStep = <T extends string = string>({
  data,
  headerValues,
  onContinue,
  onBack,
}: MatchColumnsProps<T>) => {
  const dataExample = data.slice(0, 2)
  const {
    fields,
    autoMapHeaders,
    autoMapSelectValues,
    autoMapDistance,
    translations,
  } = useRsi<T>()
  const [isLoading, setIsLoading] = useState(false)
  const [columns, setColumns] = useState<Columns<T>>(
    // Do not remove spread, it indexes empty array elements, otherwise map() skips over them
    ([...headerValues] as string[]).map((value, index) => ({
      type: ColumnType.empty,
      index,
      header: value,
    })),
  )
  const [showUnmatchedFieldsAlert, setShowUnmatchedFieldsAlert] =
    useState(false)

  const onChange = useCallback(
    (value: T, columnIndex: number) => {
      const field = fields.find(
        (field) => field.key === value,
      ) as unknown as Field<T>
      const existingFieldIndex = columns.findIndex(
        (column) => "value" in column && column.value === field.key,
      )
      setColumns(
        columns.map<Column<T>>((column, index) => {
          if (columnIndex === index) {
            return setColumn(column, field, data, autoMapSelectValues)
          } else if (index === existingFieldIndex) {
            rsiToaster.create({
              type: "warning",
              title: translations.matchColumnsStep.duplicateColumnWarningTitle,
              description:
                translations.matchColumnsStep.duplicateColumnWarningDescription,
            })
            return setColumn(column)
          } else {
            return column
          }
        }),
      )
    },
    [
      autoMapSelectValues,
      columns,
      data,
      fields,
      translations.matchColumnsStep.duplicateColumnWarningDescription,
      translations.matchColumnsStep.duplicateColumnWarningTitle,
    ],
  )

  const onIgnore = useCallback(
    (columnIndex: number) => {
      setColumns(
        columns.map((column, index) =>
          columnIndex === index ? setIgnoreColumn<T>(column) : column,
        ),
      )
    },
    [columns, setColumns],
  )

  const onRevertIgnore = useCallback(
    (columnIndex: number) => {
      setColumns(
        columns.map((column, index) =>
          columnIndex === index ? setColumn(column) : column,
        ),
      )
    },
    [columns, setColumns],
  )

  const onSubChange = useCallback(
    (value: string, columnIndex: number, entry: string) => {
      setColumns(
        columns.map((column, index) =>
          columnIndex === index && "matchedOptions" in column
            ? setSubColumn(column, entry, value)
            : column,
        ),
      )
    },
    [columns, setColumns],
  )
  const unmatchedRequiredFields = useMemo(
    () => findUnmatchedRequiredFields(fields, columns),
    [fields, columns],
  )

  const handleOnContinue = useCallback(() => {
    if (unmatchedRequiredFields.length > 0) {
      setShowUnmatchedFieldsAlert(true)
    } else {
      setIsLoading(true)
      onContinue(normalizeTableData(columns, data, fields), data, columns)
      setIsLoading(false)
    }
  }, [unmatchedRequiredFields.length, onContinue, columns, data, fields])

  const handleAlertOnContinue = useCallback(() => {
    setShowUnmatchedFieldsAlert(false)
    setIsLoading(true)
    onContinue(normalizeTableData(columns, data, fields), data, columns)
    setIsLoading(false)
  }, [onContinue, columns, data, fields])

  useEffect(() => {
    if (autoMapHeaders && columns.length > 0) {
      const matchedColumns = getMatchedColumns(
        columns,
        fields,
        data,
        autoMapDistance,
        autoMapSelectValues,
      )
      setColumns(matchedColumns)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoMapHeaders,
    fields,
    data,
    autoMapDistance,
    autoMapSelectValues,
    // Removed 'columns' from dependencies to prevent infinite loop
    // This effect should only run once for auto-mapping, not every time columns change
  ])

  return (
    <>
      <UnmatchedFieldsAlert
        isOpen={showUnmatchedFieldsAlert}
        onClose={() => {
          setShowUnmatchedFieldsAlert(false)
        }}
        fields={unmatchedRequiredFields}
        onConfirm={handleAlertOnContinue}
      />
      <ColumnGrid
        columns={columns}
        onContinue={handleOnContinue}
        onBack={onBack}
        isLoading={isLoading}
        userColumn={(column: Column<T>) => (
          <UserTableColumn
            column={column}
            onIgnore={onIgnore}
            onRevertIgnore={onRevertIgnore}
            entries={dataExample.map((row) => row[column.index])}
          />
        )}
        templateColumn={(column: Column<T>) => (
          <TemplateColumn
            column={column}
            onChange={onChange}
            onSubChange={onSubChange}
          />
        )}
      />
    </>
  )
}

export { Columns }
