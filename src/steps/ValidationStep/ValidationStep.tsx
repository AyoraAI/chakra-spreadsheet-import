import { useCallback, useMemo, useState } from "react"
import { Box, Button, Heading, Dialog, Switch } from "@chakra-ui/react"
import { ContinueButton } from "../../components/ContinueButton"
import { useRsi } from "../../hooks/useRsi"
import type { Meta } from "./types"
import { addErrorsAndRunHooks } from "./utils/dataMutations"
import { generateColumns } from "./components/columns"
import { Table } from "../../components/Table"
import { SubmitDataAlert } from "../../components/Alerts/SubmitDataAlert"
import type { Data } from "../../types"
import type { RowsChangeData } from "react-data-grid"
import { rsiToaster } from "../../lib/rsiToaster"
import { wrapAsyncError } from "../../lib/wrapAsyncError"

interface Props<T extends string> {
  initialData: (Data<T> & Meta)[]
  file: File
  onBack?: () => void
}

export const ValidationStep = <T extends string = string>({
  initialData,
  file,
  onBack,
}: Props<T>) => {
  const {
    translations,
    fields,
    onClose,
    onSubmit,
    rowHook,
    tableHook,
    onAsyncError,
  } = useRsi<T>()

  const [data, setData] = useState<(Data<T> & Meta)[]>(initialData)

  const [selectedRows, setSelectedRows] = useState<
    ReadonlySet<number | string>
  >(new Set())

  const [filterByErrors, setFilterByErrors] = useState(false)
  const [showSubmitAlert, setShowSubmitAlert] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  const updateData = useCallback(
    async (rows: typeof data, indexes?: number[]) => {
      // Check if hooks are async - if they are we want to apply changes optimistically for better UX
      if (
        rowHook?.constructor.name === "AsyncFunction" ||
        tableHook?.constructor.name === "AsyncFunction"
      ) {
        setData(rows)
      }
      await addErrorsAndRunHooks<T>(
        rows,
        fields,
        rowHook,
        tableHook,
        indexes,
      ).then((data) => {
        setData(data)
      })
    },
    [rowHook, tableHook, fields],
  )

  const deleteSelectedRows = async () => {
    if (selectedRows.size) {
      const newData = data.filter((value) => !selectedRows.has(value.__index))
      await updateData(newData)
      setSelectedRows(new Set())
    }
  }

  const updateRows = useCallback(
    (
      rows: typeof data,
      changedData?: RowsChangeData<(typeof data)[number]>,
    ) => {
      const changes = changedData?.indexes.reduce(
        (acc, index) => {
          // when data is filtered val !== actual index in data
          const realIndex = data.findIndex(
            (value) => value.__index === rows[index].__index,
          )
          acc[realIndex] = rows[index]
          return acc
        },
        {} as Record<number, (typeof data)[number]>,
      )
      const realIndexes =
        changes && Object.keys(changes).map((index) => Number(index))
      const newData = Object.assign([], data, changes)
      updateData(newData, realIndexes).catch(() => {
        rsiToaster.create({
          type: "error",
          title: translations.alerts.submitError.title,
          description: translations.alerts.submitError.defaultMessage,
        })
      })
    },
    [
      data,
      translations.alerts.submitError.defaultMessage,
      translations.alerts.submitError.title,
      updateData,
    ],
  )

  const columns = useMemo(() => generateColumns(fields), [fields])

  const tableData = useMemo(() => {
    if (filterByErrors) {
      return data.filter((value) => {
        if (value.__errors) {
          return Object.values(value.__errors).filter(
            (err) => err.level === "error",
          ).length
        }
        return false
      })
    }
    return data
  }, [data, filterByErrors])

  const rowKeyGetter = useCallback((row: Data<T> & Meta) => row.__index, [])

  const submitData = () => {
    const calculatedData = data.reduce(
      (acc, value) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __index, __errors, ...values } = value
        if (__errors) {
          for (const key in __errors) {
            if (__errors[key].level === "error") {
              acc.invalidData.push(values as unknown as Data<T>)
              return acc
            }
          }
        }
        acc.validData.push(values as unknown as Data<T>)
        return acc
      },
      { validData: [] as Data<T>[], invalidData: [] as Data<T>[], all: data },
    )
    setShowSubmitAlert(false)
    setSubmitting(true)
    onSubmit(calculatedData, file)
      .then(() => {
        onClose()
      })
      .catch((err: unknown) => {
        rsiToaster.create({
          type: "error",
          title: translations.alerts.submitError.title,
          description:
            err instanceof Error
              ? err.message
              : translations.alerts.submitError.defaultMessage,
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const onContinue = () => {
    const invalidData = data.find((value) => {
      if (value.__errors) {
        return !!Object.values(value.__errors).filter(
          (err) => err.level === "error",
        ).length
      }
      return false
    })
    if (!invalidData) {
      submitData()
    } else {
      setShowSubmitAlert(true)
    }
  }

  return (
    <>
      <SubmitDataAlert
        isOpen={showSubmitAlert}
        onClose={() => {
          setShowSubmitAlert(false)
        }}
        onConfirm={submitData}
      />
      <Dialog.Body pb={0}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="2rem"
          mt="1rem"
          flexWrap="wrap"
          gap="8px"
        >
          <Heading fontSize="3xl">{translations.validationStep.title}</Heading>
          <Box display="flex" gap="16px" alignItems="center" flexWrap="wrap">
            <Button
              variant="outline"
              size="xs"
              colorPalette="primary"
              fontWeight="bold"
              onClick={wrapAsyncError(deleteSelectedRows, onAsyncError)}
            >
              {translations.validationStep.discardButtonTitle}
            </Button>
            <Switch.Root
              display="flex"
              alignItems="center"
              checked={filterByErrors}
              colorPalette="primary"
              size="sm"
              onCheckedChange={(e) => {
                setFilterByErrors(e.checked)
              }}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label>
                {translations.validationStep.filterSwitchTitle}
              </Switch.Label>
              <Switch.Indicator />
            </Switch.Root>
          </Box>
        </Box>
        <Table
          rowKeyGetter={rowKeyGetter}
          rows={tableData}
          onRowsChange={updateRows}
          columns={columns}
          selectedRows={selectedRows}
          onSelectedRowsChange={(selectedRows) => {
            setSelectedRows(selectedRows as unknown as Set<number | string>)
          }}
          renderers={{
            noRowsFallback: (
              <Box
                display="flex"
                justifyContent="center"
                gridColumn="1/-1"
                mt="32px"
              >
                {filterByErrors
                  ? translations.validationStep.noRowsMessageWhenFiltered
                  : translations.validationStep.noRowsMessage}
              </Box>
            ),
          }}
        />
      </Dialog.Body>
      <ContinueButton
        isLoading={isSubmitting}
        onContinue={onContinue}
        onBack={onBack}
        title={translations.validationStep.nextButtonTitle}
        backTitle={translations.validationStep.backButtonTitle}
      />
    </>
  )
}
