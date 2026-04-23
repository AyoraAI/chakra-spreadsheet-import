import { Heading, Dialog, RadioGroup } from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { ContinueButton } from "../../components/ContinueButton"
import { useRsi } from "../../hooks/useRsi"
import { wrapAsyncError } from "../../lib/wrapAsyncError"

interface SelectSheetProps {
  sheetNames: string[]
  onContinue: (sheetName: string) => Promise<void>
  onBack?: () => void
}

export const SelectSheetStep = ({
  sheetNames,
  onContinue,
  onBack,
}: SelectSheetProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { translations, onAsyncError } = useRsi()
  const [value, setValue] = useState(sheetNames[0])

  const handleOnContinue = useCallback(
    async (data: typeof value) => {
      setIsLoading(true)
      await onContinue(data)
      setIsLoading(false)
    },
    [onContinue],
  )

  return (
    <>
      <Dialog.Body alignItems="center" justifyContent="center" p={8} flex={1}>
        <Heading>{translations.uploadStep.selectSheet.title}</Heading>
        <RadioGroup.Root
          onValueChange={(e) => {
            setValue(e.value ?? "")
          }}
          value={value}
        >
          {sheetNames.map((sheetName) => (
            <RadioGroup.Item value={sheetName} key={sheetName}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>{sheetName}</RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </Dialog.Body>
      <ContinueButton
        isLoading={isLoading}
        onContinue={wrapAsyncError(
          () => handleOnContinue(value),
          onAsyncError,
        )}
        onBack={onBack}
        title={translations.uploadStep.selectSheet.nextButtonTitle}
        backTitle={translations.uploadStep.selectSheet.backButtonTitle}
      />
    </>
  )
}
