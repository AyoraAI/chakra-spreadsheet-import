import { Box } from "@chakra-ui/react"

interface FadingWrapperProps {
  gridColumn: string
  gridRow: string
}

export const FadingWrapper = ({ gridColumn, gridRow }: FadingWrapperProps) => (
  <>
    <Box
      gridColumn={gridColumn}
      gridRow={gridRow}
      borderRadius="1.2rem"
      border="1px solid"
      borderColor="border"
      pointerEvents="none"
    />
    <Box
      gridColumn={gridColumn}
      gridRow={gridRow}
      pointerEvents="none"
      bgGradient="linear(to-b, transparent, var(--chakra-colors-background))"
    />
  </>
)
