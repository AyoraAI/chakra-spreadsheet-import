import { Button, Dialog } from "@chakra-ui/react"

interface ContinueButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContinue: (val: any) => void
  onBack?: () => void
  title: string
  backTitle?: string
  isLoading?: boolean
}

export const ContinueButton = ({
  onContinue,
  onBack,
  title,
  backTitle,
  isLoading,
}: ContinueButtonProps) => {
  const nextButtonMobileWidth = onBack ? "8rem" : "100%"

  return (
    <Dialog.Footer
      position="sticky"
      bottom="0"
      bgColor="bg.muted"
      w="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {onBack && (
        <Button
          size="md"
          onClick={onBack}
          loading={isLoading}
          variant="outline"
        >
          {backTitle}
        </Button>
      )}
      <Button
        size="sm"
        onClick={onContinue}
        loading={isLoading}
        colorPalette="primary"
        fontWeight="bold"
        w={{ base: nextButtonMobileWidth, md: "21rem" }}
        textTransform="uppercase"
      >
        {title}
      </Button>
    </Dialog.Footer>
  )
}
