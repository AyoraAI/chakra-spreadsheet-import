import { Box } from "@chakra-ui/react"
import { CgCheck } from "react-icons/cg"

interface MatchIconProps {
  isChecked: boolean
}

export const MatchIcon = (props: MatchIconProps) => {
  return (
    <Box
      minW={6}
      minH={6}
      w={6}
      h={6}
      ml="0.875rem"
      mr={3}
      data-testid="column-checkmark"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
      borderWidth="2px"
      bg={props.isChecked ? "green.500" : "transparent"}
      color="background"
      borderColor={props.isChecked ? "green.500" : "gray.300"}
      transitionDuration="ultra-fast"
    >
      {props.isChecked && <CgCheck size="24px" />}
    </Box>
  )
}
