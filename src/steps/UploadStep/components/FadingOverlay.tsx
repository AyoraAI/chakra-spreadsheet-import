import { Box } from "@chakra-ui/react"

export const FadingOverlay = () => (
  <Box
    position="absolute"
    left={0}
    right={0}
    bottom={0}
    height="48px"
    pointerEvents="none"
    zIndex={2}
    bgGradient="linear(to-b, transparent, var(--chakra-colors-background))"
  />
)
