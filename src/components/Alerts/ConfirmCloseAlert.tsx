import { Dialog, Button, Portal } from "@chakra-ui/react"
import { useRef } from "react"
import { useRsi } from "../../hooks/useRsi"

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmCloseAlert = ({ isOpen, onClose, onConfirm }: Props) => {
  const { translations } = useRsi()
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
            <Dialog.Header>
              <Dialog.Title>
                {translations.alerts.confirmClose.headerTitle}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {translations.alerts.confirmClose.bodyText}
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="outline"
                size="xs"
              >
                {translations.alerts.confirmClose.cancelButtonTitle}
              </Button>
              <Button
                onClick={onConfirm}
                ml={3}
                size="xs"
                fontWeight="bold"
                colorPalette="red"
                textTransform="uppercase"
              >
                {translations.alerts.confirmClose.exitButtonTitle}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
