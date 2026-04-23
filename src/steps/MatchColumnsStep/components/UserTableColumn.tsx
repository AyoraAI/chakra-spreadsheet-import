import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import { CgClose, CgUndo } from "react-icons/cg"
import { ColumnType, type Column } from "../types"

import type { RawData } from "../../../types"

interface UserTableColumnProps<T extends string> {
  column: Column<T>
  entries: RawData
  onIgnore: (index: number) => void
  onRevertIgnore: (index: number) => void
}

export const UserTableColumn = <T extends string = string>(
  props: UserTableColumnProps<T>,
) => {
  const {
    column: { header, index, type },
    entries,
    onIgnore,
    onRevertIgnore,
  } = props
  return (
    <Box>
      <Flex px={6} justifyContent="space-between" alignItems="center" mb={4}>
        <Text
          fontSize="xs"
          lineHeight="4"
          fontWeight="bold"
          letterSpacing="wider"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          color={type === ColumnType.ignored ? "fg.subtle" : "textColor"}
        >
          {header}
        </Text>
        {type === ColumnType.ignored ? (
          <IconButton
            aria-label="Ignore column"
            onClick={() => {
              onRevertIgnore(index)
            }}
            size="2xs"
            variant="subtle"
            borderRadius="lg"
            colorScheme="gray"
          >
            <CgUndo />
          </IconButton>
        ) : (
          <IconButton
            aria-label="Ignore column"
            onClick={() => {
              onIgnore(index)
            }}
            size="2xs"
            variant="subtle"
            borderRadius="lg"
            colorScheme="gray"
            color="textColor"
          >
            <CgClose />
          </IconButton>
        )}
      </Flex>
      {entries.map((entry, index) => (
        <Text
          fontSize="sm"
          fontWeight="medium"
          px="6"
          py="2"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          color={type === ColumnType.ignored ? "fg.subtle" : "textColor"}
          key={(entry ?? "") + index.toString()}
        >
          {entry}
        </Text>
      ))}
    </Box>
  )
}
