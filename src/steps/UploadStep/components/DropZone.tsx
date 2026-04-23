import { Box, Button, Text } from "@chakra-ui/react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx-ugnis"
import { useState } from "react"
import { getDropZoneBorder } from "../utils/getDropZoneBorder"
import { useRsi } from "../../../hooks/useRsi"
import { readFileAsync } from "../utils/readFilesAsync"
import { rsiToaster } from "../../../lib/rsiToaster"
import { wrapAsyncError } from "../../../lib/wrapAsyncError"

interface DropZoneProps {
  onContinue: (data: XLSX.WorkBook, file: File) => void
  isLoading: boolean
}

export const DropZone = ({ onContinue, isLoading }: DropZoneProps) => {
  const { translations, maxFileSize, dateFormat, parseRaw, onAsyncError } =
    useRsi()

  const [loading, setLoading] = useState(false)
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: maxFileSize,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
    onDropRejected: (fileRejections) => {
      setLoading(false)
      fileRejections.forEach((fileRejection) => {
        rsiToaster.create({
          type: "error",
          title: `${fileRejection.file.name} ${translations.uploadStep.dropzone.errorToastDescription}`,
          description: fileRejection.errors[0].message,
        })
      })
    },
    onDropAccepted: wrapAsyncError(async ([file]) => {
      setLoading(true)
      const arrayBuffer = await readFileAsync(file)
      const workbook = XLSX.read(arrayBuffer, {
        cellDates: true,
        dateNF: dateFormat,
        raw: parseRaw,
        dense: true,
        codepage: 65001,
      })
      setLoading(false)
      onContinue(workbook, file)
    }, onAsyncError),
  })

  return (
    <Box
      {...getRootProps()}
      {...getDropZoneBorder("var(--chakra-colors-primary-500)")}
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      flex={1}
      border="2px dashed"
      borderColor="primary.500"
      borderRadius="lg"
      p="2rem"
      mt="1rem"
    >
      <input {...getInputProps()} data-testid="rsi-dropzone" />
      {isDragActive ? (
        <Text
          fontSize="lg"
          lineHeight="7"
          fontWeight="semibold"
          color="textColor"
        >
          {translations.uploadStep.dropzone.activeDropzoneTitle}
        </Text>
      ) : loading || isLoading ? (
        <Text
          fontSize="lg"
          lineHeight="7"
          fontWeight="semibold"
          color="textColor"
        >
          {translations.uploadStep.dropzone.loadingTitle}
        </Text>
      ) : (
        <>
          <Text fontSize="14px" color="gray.500">
            {translations.uploadStep.dropzone.title}
          </Text>
          <Button
            onClick={open}
            size="xs"
            fontWeight="bold"
            mt="1rem"
            colorPalette="primary"
          >
            {translations.uploadStep.dropzone.buttonTitle}
          </Button>
        </>
      )}
    </Box>
  )
}
