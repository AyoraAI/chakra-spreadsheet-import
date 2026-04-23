import { useCallback, useState } from "react"
import { Heading, Dialog } from "@chakra-ui/react"
import { SelectHeaderTable } from "./components/SelectHeaderTable"
import { ContinueButton } from "../../components/ContinueButton"
import { useRsi } from "../../hooks/useRsi"
import type { RawData } from "../../types"
import { wrapAsyncError } from "../../lib/wrapAsyncError"

interface SelectHeaderProps {
  data: RawData[]
  onContinue: (headerValues: RawData, data: RawData[]) => Promise<void>
  onBack?: () => void
}

export const SelectHeaderStep = ({
  data,
  onContinue,
  onBack,
}: SelectHeaderProps) => {
  const { translations, onAsyncError } = useRsi()
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(
    new Set([0]),
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = useCallback(async () => {
    const [selectedRowIndex] = selectedRows
    // We consider data above header to be redundant
    const trimmedData = data.slice(selectedRowIndex + 1)
    setIsLoading(true)
    await onContinue(data[selectedRowIndex], trimmedData)
    setIsLoading(false)
  }, [onContinue, data, selectedRows])

  return (
    <>
      <Dialog.Body pb={0} overflow="hidden">
        <Heading mb="1rem">{translations.selectHeaderStep.title}</Heading>
        <SelectHeaderTable
          data={data}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </Dialog.Body>
      <ContinueButton
        onContinue={wrapAsyncError(handleContinue, onAsyncError)}
        onBack={onBack}
        title={translations.selectHeaderStep.nextButtonTitle}
        backTitle={translations.selectHeaderStep.backButtonTitle}
        isLoading={isLoading}
      />
    </>
  )
}
