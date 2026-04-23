import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react"
import * as React from "react"

export interface RsiTooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  contentProps?: ChakraTooltip.ContentProps
  disabled?: boolean
}

export const RsiTooltip = React.forwardRef<HTMLDivElement, RsiTooltipProps>(
  function RsiTooltip(props, ref) {
    const { children, disabled, content, contentProps, portalRef, ...rest } =
      props

    if (disabled) return children

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content
              borderRadius="lg"
              padding=".75rem"
              ref={ref}
              {...contentProps}
            >
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  },
)
