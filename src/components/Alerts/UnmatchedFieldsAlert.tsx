import { Dialog, Button, Text, Box, Portal } from "@chakra-ui/react"
import { useRef } from "react"
import { useRsi } from "../../hooks/useRsi"

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  fields: string[]
}

export const UnmatchedFieldsAlert = ({
  isOpen,
  onClose,
  onConfirm,
  fields,
}: Props) => {
  const { allowInvalidSubmit, translations } = useRsi()
  const cancelRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      role="alertdialog"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header fontSize="lg" fontWeight="bold">
              {translations.alerts.unmatchedRequiredFields.headerTitle}
            </Dialog.Header>
            <Dialog.Body>
              {translations.alerts.unmatchedRequiredFields.bodyText}
              <Box pt={3}>
                <Text display="inline">
                  {translations.alerts.unmatchedRequiredFields.listTitle}
                </Text>
                <Text display="inline" fontWeight="bold">
                  {" "}
                  {fields.join(", ")}
                </Text>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="outline"
                size="xs"
              >
                {translations.alerts.unmatchedRequiredFields.cancelButtonTitle}
              </Button>
              {allowInvalidSubmit && (
                <Button
                  onClick={onConfirm}
                  ml={3}
                  size="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  colorPalette="primary"
                >
                  {
                    translations.alerts.unmatchedRequiredFields
                      .continueButtonTitle
                  }
                </Button>
              )}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
