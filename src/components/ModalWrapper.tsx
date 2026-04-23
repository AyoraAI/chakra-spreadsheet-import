import type React from "react"
import { Dialog } from "@chakra-ui/react"
import { ModalCloseButton } from "./ModalCloseButton"
import { useRsi } from "../hooks/useRsi"

interface Props {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export const ModalWrapper = ({ children, isOpen, onClose }: Props) => {
  const { rtl } = useRsi()
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      id="rsi"
      scrollBehavior="inside"
      closeOnEscape
      role="dialog"
      size="cover"
      placement="center"
    >
      <div dir={rtl ? "rtl" : "ltr"}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content overflow="hidden" borderRadius="xl">
            <Dialog.Header justifyContent="flex-end" p="0" bgColor="bg.muted">
              <ModalCloseButton onClose={onClose} />
            </Dialog.Header>
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </div>
    </Dialog.Root>
  )
}
