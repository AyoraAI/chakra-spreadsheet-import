import { Flex, Text, Accordion, Box } from "@chakra-ui/react"
import { useRsi } from "../../../hooks/useRsi"
import { ColumnType, type Column } from "../types"
import { MatchIcon } from "./MatchIcon"
import type { Fields } from "../../../types"
import type { Translations } from "../../../translationsRSIProps"
import { MatchColumnSelect } from "../../../components/Selects/MatchColumnSelect"
import { SubMatchingSelect } from "./SubMatchingSelect"

const getAccordionTitle = <T extends string = string>(
  fields: Fields<T>,
  column: Column<T>,
  translations: Translations,
) => {
  const fieldLabel = fields.find(
    (field) => "value" in column && field.key === column.value,
  )?.label

  const unmatchedCount =
    "matchedOptions" in column
      ? column.matchedOptions.filter((option) => !option.value).length
      : 0

  return fieldLabel
    ? `${translations.matchColumnsStep.matchDropdownTitle} ${fieldLabel} (${unmatchedCount.toString()} ${translations.matchColumnsStep.unmatched})`
    : ""
}

interface TemplateColumnProps<T extends string> {
  onChange: (val: T, index: number) => void
  onSubChange: (val: T, index: number, option: string) => void
  column: Column<T>
}

export const TemplateColumn = <T extends string = string>({
  column,
  onChange,
  onSubChange,
}: TemplateColumnProps<T>) => {
  const { translations, fields } = useRsi<T>()
  const isIgnored = column.type === ColumnType.ignored
  const isChecked =
    column.type === ColumnType.matched ||
    column.type === ColumnType.matchedCheckbox ||
    column.type === ColumnType.matchedSelectOptions
  const isSelect = "matchedOptions" in column
  const selectOptions = fields.map(({ label, key }) => ({ value: key, label }))
  const selectValue = selectOptions.find(
    ({ value }) => "value" in column && column.value === value,
  )

  return (
    <Flex minH={10} w="100%" flexDir="column" justifyContent="center">
      {isIgnored ? (
        <Text fontSize="sm" fontWeight="normal" color="fg.subtle" px="4">
          {translations.matchColumnsStep.ignoredColumnText}
        </Text>
      ) : (
        <>
          <Flex alignItems="center" minH={10} w="100%">
            <Box flex={1}>
              <MatchColumnSelect
                placeholder={translations.matchColumnsStep.selectPlaceholder}
                value={selectValue}
                onChange={(value) => {
                  onChange(value?.value as T, column.index)
                }}
                options={selectOptions}
                name={column.header}
              />
            </Box>
            <MatchIcon isChecked={isChecked} />
          </Flex>
          {isSelect && (
            <Flex width="100%">
              <Accordion.Root multiple width="100%">
                <Accordion.Item value={column.header} border="none" py={1}>
                  <Accordion.ItemTrigger
                    _hover={{ bg: "transparent" }}
                    _focus={{ boxShadow: "none" }}
                    px={0}
                    py={4}
                    data-testid="accordion-button"
                    asChild
                  >
                    <Accordion.ItemIndicator />
                    <Box textAlign="left">
                      <Text color="primary.600" fontSize="sm" pl="1">
                        {getAccordionTitle<T>(fields, column, translations)}
                      </Text>
                    </Box>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent
                    pb={4}
                    pr={3}
                    display="flex"
                    flexDir="column"
                  >
                    {column.matchedOptions.map((option) => (
                      <SubMatchingSelect
                        option={option}
                        column={column}
                        onSubChange={onSubChange}
                        key={option.entry}
                      />
                    ))}
                  </Accordion.ItemContent>
                </Accordion.Item>
              </Accordion.Root>
            </Flex>
          )}
        </>
      )}
    </Flex>
  )
}
