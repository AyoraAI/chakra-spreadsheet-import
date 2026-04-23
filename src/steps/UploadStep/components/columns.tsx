import type { Column, RenderHeaderCellProps } from "react-data-grid"
import { Box } from "@chakra-ui/react"
import type { Fields } from "../../../types"
import { CgInfo } from "react-icons/cg"
import { RsiTooltip } from "../../../lib/Tooltip"

export const generateColumns = <T extends string = string>(fields: Fields<T>) =>
  fields.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (column): Column<any> => ({
      key: column.key,
      name: column.label,
      minWidth: 150,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      renderHeaderCell: (_: RenderHeaderCellProps<any>) => (
        <Box display="flex" gap={1} alignItems="center" position="relative">
          <Box flex={1} overflow="hidden" textOverflow="ellipsis">
            {column.label}
          </Box>
          {column.description && (
            <RsiTooltip
              positioning={{ placement: "top" }}
              content={column.description}
            >
              <Box flex={"0 0 auto"}>
                <CgInfo size="16px" />
              </Box>
            </RsiTooltip>
          )}
        </Box>
      ),
      renderCell: ({ row }) => (
        <Box
          minWidth="100%"
          minHeight="100%"
          overflow="hidden"
          textOverflow="ellipsis"
          fontSize="sm"
          display="flex"
          alignItems="center"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
          {row[column.key]}
        </Box>
      ),
    }),
  )
