import { CloseButton } from "@chakra-ui/react"
import { ConfirmCloseAlert } from "./Alerts/ConfirmCloseAlert"
import { useState } from "react"

interface ModalCloseButtonProps {
  onClose: () => void
}

export const ModalCloseButton = ({ onClose }: ModalCloseButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <ConfirmCloseAlert
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        onConfirm={() => {
          setShowModal(false)
          onClose()
        }}
      />
      <CloseButton
        aria-label="Close modal"
        borderRadius="full"
        onClick={() => {
          setShowModal(true)
        }}
      />
    </>
  )
}
