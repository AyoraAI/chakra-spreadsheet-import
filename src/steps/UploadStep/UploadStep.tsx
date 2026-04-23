import type XLSX from "xlsx-ugnis"
import { Box, Heading, Text, Flex } from "@chakra-ui/react"
import { DropZone } from "./components/DropZone"
import { useRsi } from "../../hooks/useRsi"
import { ExampleTable } from "./components/ExampleTable"
import { useCallback, useState } from "react"
import { FadingOverlay } from "./components/FadingOverlay"
import { wrapAsyncError } from "../../lib/wrapAsyncError"

interface UploadProps {
  onContinue: (data: XLSX.WorkBook, file: File) => Promise<void>
}

export const UploadStep = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { translations, fields, onAsyncError } = useRsi()
  const handleOnContinue = useCallback(
    async (data: XLSX.WorkBook, file: File) => {
      setIsLoading(true)
      await onContinue(data, file)
      setIsLoading(false)
    },
    [onContinue],
  )

  return (
    <Flex direction="column" height="100%" p="2rem">
      <Heading size="3xl" as="h2" mb="2rem">
        {translations.uploadStep.title}
      </Heading>
      <Text fontSize="2xl" fontWeight="semibold" mb="2rem">
        {translations.uploadStep.manifestTitle}
      </Text>
      <Text fontSize="md" color="fg.muted" mb="1rem">
        {translations.uploadStep.manifestDescription}
      </Text>
      <Box mt="1rem" position="relative">
        <ExampleTable fields={fields} />
        <FadingOverlay />
      </Box>
      <DropZone
        onContinue={wrapAsyncError(handleOnContinue, onAsyncError)}
        isLoading={isLoading}
      />
    </Flex>
  )
}
