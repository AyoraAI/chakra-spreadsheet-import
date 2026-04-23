import { Dialog, Button, Portal } from "@chakra-ui/react"
import { useRef } from "react"
import { useRsi } from "../../hooks/useRsi"

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const SubmitDataAlert = ({ isOpen, onClose, onConfirm }: Props) => {
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
              {translations.alerts.submitIncomplete.headerTitle}
            </Dialog.Header>
            <Dialog.Body>
              {allowInvalidSubmit
                ? translations.alerts.submitIncomplete.bodyText
                : translations.alerts.submitIncomplete.bodyTextSubmitForbidden}
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="outline"
                size="xs"
              >
                {translations.alerts.submitIncomplete.cancelButtonTitle}
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
                  {translations.alerts.submitIncomplete.finishButtonTitle}
                </Button>
              )}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
