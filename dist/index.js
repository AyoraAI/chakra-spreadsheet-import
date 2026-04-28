import merge from 'lodash/merge.js';
import * as React from 'react';
import { createContext, useState, useRef, useContext, useCallback, useMemo, useEffect, useSyncExternalStore } from 'react';
import { createToaster, Tooltip, Portal, Toaster, Toast, Spinner, Stack, Dialog, Steps as Steps$1, CloseButton, Progress, Button, Box, Heading, Switch, RadioGroup, Flex, Text, Checkbox, Input, Accordion, IconButton } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx-ugnis';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRowSelection, DataGrid } from 'react-data-grid';
import { CgInfo, CgUndo, CgClose, CgCheck } from 'react-icons/cg';
import { v4 } from 'uuid';
import { Select } from 'chakra-react-select';
import uniqBy from 'lodash/uniqBy.js';
import lavenstein from 'js-levenshtein';
import { CheckIcon } from '@heroicons/react/24/outline';

// src/index.tsx

// src/steps/UploadStep/utils/getDropZoneBorder.ts
var getDropZoneBorder = (color) => {
  return {
    bgGradient: `repeating-linear(0deg, ${color}, ${color} 10px, transparent 10px, transparent 20px, ${color} 20px), repeating-linear-gradient(90deg, ${color}, ${color} 10px, transparent 10px, transparent 20px, ${color} 20px), repeating-linear-gradient(180deg, ${color}, ${color} 10px, transparent 10px, transparent 20px, ${color} 20px), repeating-linear-gradient(270deg, ${color}, ${color} 10px, transparent 10px, transparent 20px, ${color} 20px)`,
    backgroundSize: "2px 100%, 100% 2px, 2px 100% , 100% 2px",
    backgroundPosition: "0 0, 0 0, 100% 0, 0 100%",
    backgroundRepeat: "no-repeat",
    borderRadius: "4px"
  };
};
var RsiContext = createContext({});
var rootId = "chakra-modal-rsi";
var Providers = ({
  children,
  rsiValues
}) => {
  return /* @__PURE__ */ jsx(RsiContext.Provider, { value: rsiValues, children });
};

// src/hooks/useRsi.ts
var useRsi = () => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  useContext(RsiContext)
);

// src/steps/UploadStep/utils/readFilesAsync.ts
var readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
var rsiToaster = createToaster({
  placement: "bottom-start",
  pauseOnPageIdle: true,
  duration: 3e3
});
var RsiToaster = () => {
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(Toaster, { toaster: rsiToaster, insetInline: { mdDown: "4" }, children: (toast) => /* @__PURE__ */ jsxs(Toast.Root, { width: { md: "sm" }, children: [
    toast.type === "loading" ? /* @__PURE__ */ jsx(Spinner, { size: "sm", color: "blue.solid" }) : /* @__PURE__ */ jsx(Toast.Indicator, {}),
    /* @__PURE__ */ jsxs(Stack, { gap: "1", flex: "1", maxWidth: "100%", children: [
      toast.title && /* @__PURE__ */ jsx(Toast.Title, { fontWeight: 700, children: toast.title }),
      toast.description && /* @__PURE__ */ jsx(Toast.Description, { whiteSpace: "pre-wrap", children: toast.description })
    ] }),
    toast.action && /* @__PURE__ */ jsx(Toast.ActionTrigger, { children: toast.action.label }),
    /* @__PURE__ */ jsx(Toast.CloseTrigger, {})
  ] }) }) });
};

// src/lib/wrapAsyncError.ts
function wrapAsyncError(fn, onAsyncError) {
  return (...args) => {
    void Promise.resolve(fn(...args)).catch((err) => {
      onAsyncError?.(err);
    });
  };
}
var DropZone = ({ onContinue, isLoading }) => {
  const { translations: translations2, maxFileSize, dateFormat, parseRaw, onAsyncError } = useRsi();
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: maxFileSize,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx"
      ],
      "text/csv": [".csv"]
    },
    onDropRejected: (fileRejections) => {
      setLoading(false);
      fileRejections.forEach((fileRejection) => {
        rsiToaster.create({
          type: "error",
          title: `${fileRejection.file.name} ${translations2.uploadStep.dropzone.errorToastDescription}`,
          description: fileRejection.errors[0].message
        });
      });
    },
    onDropAccepted: wrapAsyncError(async ([file]) => {
      setLoading(true);
      const arrayBuffer = await readFileAsync(file);
      const workbook = XLSX.read(arrayBuffer, {
        cellDates: true,
        dateNF: dateFormat,
        raw: parseRaw,
        dense: true,
        codepage: 65001
      });
      setLoading(false);
      onContinue(workbook, file);
    }, onAsyncError)
  });
  return /* @__PURE__ */ jsxs(
    Box,
    {
      ...getRootProps(),
      ...getDropZoneBorder("var(--chakra-colors-primary-500)"),
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      flex: 1,
      border: "2px dashed",
      borderColor: "primary.500",
      borderRadius: "lg",
      p: "2rem",
      mt: "1rem",
      children: [
        /* @__PURE__ */ jsx("input", { ...getInputProps(), "data-testid": "rsi-dropzone" }),
        isDragActive ? /* @__PURE__ */ jsx(
          Text,
          {
            fontSize: "lg",
            lineHeight: "7",
            fontWeight: "semibold",
            color: "textColor",
            children: translations2.uploadStep.dropzone.activeDropzoneTitle
          }
        ) : loading || isLoading ? /* @__PURE__ */ jsx(
          Text,
          {
            fontSize: "lg",
            lineHeight: "7",
            fontWeight: "semibold",
            color: "textColor",
            children: translations2.uploadStep.dropzone.loadingTitle
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Text, { fontSize: "14px", color: "gray.500", children: translations2.uploadStep.dropzone.title }),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: open,
              size: "xs",
              fontWeight: "bold",
              mt: "1rem",
              colorPalette: "primary",
              children: translations2.uploadStep.dropzone.buttonTitle
            }
          )
        ] })
      ]
    }
  );
};
function subscribe(callback) {
  const el = document.documentElement;
  const obs = new MutationObserver(callback);
  obs.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => {
    obs.disconnect();
  };
}
function getSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
function getServerSnapshot() {
  return "light";
}
function useDocumentColorMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
var Table = ({ className, ...props }) => {
  const { rtl } = useRsi();
  const colorMode = useDocumentColorMode();
  return /* @__PURE__ */ jsx(
    DataGrid,
    {
      className: `rdg-${colorMode} ${className ?? ""}`,
      direction: rtl ? "rtl" : "ltr",
      ...props
    }
  );
};
var RsiTooltip = React.forwardRef(
  function RsiTooltip2(props, ref) {
    const { children, disabled, content, contentProps, portalRef, ...rest } = props;
    if (disabled) return children;
    return /* @__PURE__ */ jsxs(Tooltip.Root, { ...rest, children: [
      /* @__PURE__ */ jsx(Tooltip.Trigger, { asChild: true, children }),
      /* @__PURE__ */ jsx(Portal, { container: portalRef, children: /* @__PURE__ */ jsx(Tooltip.Positioner, { children: /* @__PURE__ */ jsxs(
        Tooltip.Content,
        {
          borderRadius: "lg",
          padding: ".75rem",
          ref,
          ...contentProps,
          children: [
            /* @__PURE__ */ jsx(Tooltip.Arrow, { children: /* @__PURE__ */ jsx(Tooltip.ArrowTip, {}) }),
            content
          ]
        }
      ) }) })
    ] });
  }
);
var generateColumns = (fields) => fields.map(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (column) => ({
    key: column.key,
    name: column.label,
    minWidth: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    renderHeaderCell: (_) => /* @__PURE__ */ jsxs(Box, { display: "flex", gap: 1, alignItems: "center", position: "relative", children: [
      /* @__PURE__ */ jsx(Box, { flex: 1, overflow: "hidden", textOverflow: "ellipsis", children: column.label }),
      column.description && /* @__PURE__ */ jsx(
        RsiTooltip,
        {
          positioning: { placement: "top" },
          content: column.description,
          children: /* @__PURE__ */ jsx(Box, { flex: "0 0 auto", children: /* @__PURE__ */ jsx(CgInfo, { size: "16px" }) })
        }
      )
    ] }),
    renderCell: ({ row }) => /* @__PURE__ */ jsx(
      Box,
      {
        minWidth: "100%",
        minHeight: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "sm",
        display: "flex",
        alignItems: "center",
        children: row[column.key]
      }
    )
  })
);

// src/steps/UploadStep/utils/generateExampleRow.ts
var titleMap = {
  checkbox: "Boolean",
  select: "Options",
  input: "Text"
};
var generateExampleRow = (fields) => [
  fields.reduce(
    (acc, field) => {
      acc[field.key] = field.example ?? titleMap[field.fieldType.type];
      return acc;
    },
    {}
  )
];
var ExampleTable = ({
  fields
}) => {
  const [renderKey, setRenderKey] = useState(0);
  const containerRef = useRef(null);
  const data = useMemo(() => generateExampleRow(fields), [fields]);
  const columns = useMemo(() => generateColumns(fields), [fields]);
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setRenderKey((prev) => {
            return prev + 1;
          });
        } else {
          setTimeout(checkSize, 100);
        }
      }
    };
    const timer = setTimeout(checkSize, 200);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { ref: containerRef, style: { width: "100%" }, children: /* @__PURE__ */ jsx(
    Table,
    {
      rows: data,
      columns,
      className: "rdg-example",
      rowHeight: 35,
      style: { width: "100%" }
    },
    renderKey
  ) });
};
var FadingOverlay = () => /* @__PURE__ */ jsx(
  Box,
  {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "48px",
    pointerEvents: "none",
    zIndex: 2,
    bgGradient: "linear(to-b, transparent, var(--chakra-colors-background))"
  }
);
var UploadStep = ({ onContinue }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { translations: translations2, fields, onAsyncError } = useRsi();
  const handleOnContinue = useCallback(
    async (data, file) => {
      setIsLoading(true);
      await onContinue(data, file);
      setIsLoading(false);
    },
    [onContinue]
  );
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", height: "100%", p: "2rem", children: [
    /* @__PURE__ */ jsx(Heading, { size: "3xl", as: "h2", mb: "2rem", children: translations2.uploadStep.title }),
    /* @__PURE__ */ jsx(Text, { fontSize: "2xl", fontWeight: "semibold", mb: "2rem", children: translations2.uploadStep.manifestTitle }),
    /* @__PURE__ */ jsx(Text, { fontSize: "md", color: "fg.muted", mb: "1rem", children: translations2.uploadStep.manifestDescription }),
    /* @__PURE__ */ jsxs(Box, { mt: "1rem", position: "relative", children: [
      /* @__PURE__ */ jsx(ExampleTable, { fields }),
      /* @__PURE__ */ jsx(FadingOverlay, {})
    ] }),
    /* @__PURE__ */ jsx(
      DropZone,
      {
        onContinue: wrapAsyncError(handleOnContinue, onAsyncError),
        isLoading
      }
    )
  ] });
};
var SELECT_COLUMN_KEY = "select-row";
function SelectFormatter(props) {
  const { isRowSelected, onRowSelectionChange } = useRowSelection();
  return /* @__PURE__ */ jsx(
    RadioGroup.Root,
    {
      bg: "inherit",
      "aria-label": "Select",
      value: isRowSelected ? "1" : "0",
      size: "md",
      colorPalette: "primary",
      onValueChange: (event) => {
        onRowSelectionChange({
          row: props.row,
          checked: Boolean(event.value),
          isShiftClick: false
        });
      },
      children: /* @__PURE__ */ jsxs(RadioGroup.Item, { value: "1", children: [
        /* @__PURE__ */ jsx(RadioGroup.ItemHiddenInput, {}),
        /* @__PURE__ */ jsx(RadioGroup.ItemIndicator, {})
      ] })
    }
  );
}
var SelectColumn = {
  key: SELECT_COLUMN_KEY,
  name: "",
  width: 35,
  minWidth: 35,
  maxWidth: 35,
  resizable: false,
  sortable: false,
  frozen: true,
  cellClass: "rdg-radio",
  renderCell: SelectFormatter
};
var generateSelectionColumns = (data) => {
  const longestRowLength = data.reduce(
    (acc, curr) => acc > curr.length ? acc : curr.length,
    0
  );
  return [
    SelectColumn,
    ...Array.from(Array(longestRowLength), (_, index) => ({
      key: index.toString(),
      name: ""
    }))
  ];
};
var SelectHeaderTable = ({
  data,
  selectedRows,
  setSelectedRows
}) => {
  const columns = useMemo(() => generateSelectionColumns(data), [data]);
  return /* @__PURE__ */ jsx(
    Table,
    {
      rowKeyGetter: (row) => data.indexOf(row),
      rows: data,
      columns,
      selectedRows,
      onSelectedRowsChange: (newRows) => {
        newRows.forEach((value) => {
          if (!selectedRows.has(value)) {
            setSelectedRows(/* @__PURE__ */ new Set([value]));
            return;
          }
        });
      },
      onCellClick: (row) => {
        setSelectedRows(/* @__PURE__ */ new Set([data.indexOf(row)]));
      },
      headerRowHeight: 0,
      className: "rdg-static"
    }
  );
};
var ContinueButton = ({
  onContinue,
  onBack,
  title,
  backTitle,
  isLoading
}) => {
  const nextButtonMobileWidth = onBack ? "8rem" : "100%";
  return /* @__PURE__ */ jsxs(
    Dialog.Footer,
    {
      position: "sticky",
      bottom: "0",
      bgColor: "bg.muted",
      w: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      children: [
        onBack && /* @__PURE__ */ jsx(
          Button,
          {
            size: "md",
            onClick: onBack,
            loading: isLoading,
            variant: "outline",
            children: backTitle
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            onClick: onContinue,
            loading: isLoading,
            colorPalette: "primary",
            fontWeight: "bold",
            w: { base: nextButtonMobileWidth, md: "21rem" },
            textTransform: "uppercase",
            children: title
          }
        )
      ]
    }
  );
};
var SelectHeaderStep = ({
  data,
  onContinue,
  onBack
}) => {
  const { translations: translations2, onAsyncError } = useRsi();
  const [selectedRows, setSelectedRows] = useState(
    /* @__PURE__ */ new Set([0])
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleContinue = useCallback(async () => {
    const [selectedRowIndex] = selectedRows;
    const trimmedData = data.slice(selectedRowIndex + 1);
    setIsLoading(true);
    await onContinue(data[selectedRowIndex], trimmedData);
    setIsLoading(false);
  }, [onContinue, data, selectedRows]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Dialog.Body, { pb: 0, overflow: "hidden", children: [
      /* @__PURE__ */ jsx(Heading, { mb: "1rem", children: translations2.selectHeaderStep.title }),
      /* @__PURE__ */ jsx(
        SelectHeaderTable,
        {
          data,
          selectedRows,
          setSelectedRows
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ContinueButton,
      {
        onContinue: wrapAsyncError(handleContinue, onAsyncError),
        onBack,
        title: translations2.selectHeaderStep.nextButtonTitle,
        backTitle: translations2.selectHeaderStep.backButtonTitle,
        isLoading
      }
    )
  ] });
};
var SelectSheetStep = ({
  sheetNames,
  onContinue,
  onBack
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { translations: translations2, onAsyncError } = useRsi();
  const [value, setValue] = useState(sheetNames[0]);
  const handleOnContinue = useCallback(
    async (data) => {
      setIsLoading(true);
      await onContinue(data);
      setIsLoading(false);
    },
    [onContinue]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Dialog.Body, { alignItems: "center", justifyContent: "center", p: 8, flex: 1, children: [
      /* @__PURE__ */ jsx(Heading, { children: translations2.uploadStep.selectSheet.title }),
      /* @__PURE__ */ jsx(
        RadioGroup.Root,
        {
          onValueChange: (e) => {
            setValue(e.value ?? "");
          },
          value,
          children: sheetNames.map((sheetName) => /* @__PURE__ */ jsxs(RadioGroup.Item, { value: sheetName, children: [
            /* @__PURE__ */ jsx(RadioGroup.ItemHiddenInput, {}),
            /* @__PURE__ */ jsx(RadioGroup.ItemIndicator, {}),
            /* @__PURE__ */ jsx(RadioGroup.ItemText, { children: sheetName })
          ] }, sheetName))
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ContinueButton,
      {
        isLoading,
        onContinue: wrapAsyncError(
          () => handleOnContinue(value),
          onAsyncError
        ),
        onBack,
        title: translations2.uploadStep.selectSheet.nextButtonTitle,
        backTitle: translations2.uploadStep.selectSheet.backButtonTitle
      }
    )
  ] });
};
var mapWorkbook = (workbook, sheetName) => {
  const worksheet = workbook.Sheets[sheetName ?? workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: false,
    raw: false
  });
  return data;
};
var addErrorsAndRunHooks = async (data, fields, rowHook, tableHook, changedRowIndexes) => {
  const errors = {};
  const addError = (source, rowIndex, fieldKey, error) => {
    errors[rowIndex] = {
      ...errors[rowIndex],
      [fieldKey]: { ...error, source }
    };
  };
  if (tableHook) {
    data = await tableHook(data, (...props) => {
      addError("table" /* Table */, ...props);
    });
  }
  if (rowHook) {
    if (changedRowIndexes) {
      for (const index of changedRowIndexes) {
        data[index] = await rowHook(
          data[index],
          (...props) => {
            addError("row" /* Row */, index, ...props);
          },
          data
        );
      }
    } else {
      data = await Promise.all(
        data.map(
          async (value, index) => rowHook(
            value,
            (...props) => {
              addError("row" /* Row */, index, ...props);
            },
            data
          )
        )
      );
    }
  }
  fields.forEach((field) => {
    field.validations?.forEach((validation) => {
      switch (validation.rule) {
        case "unique": {
          const values = data.map((entry) => entry[field.key]);
          const taken = /* @__PURE__ */ new Set();
          const duplicates = /* @__PURE__ */ new Set();
          values.forEach((value) => {
            if (validation.allowEmpty && !value) {
              return;
            }
            if (taken.has(value)) {
              duplicates.add(value);
            } else {
              taken.add(value);
            }
          });
          values.forEach((value, index) => {
            if (duplicates.has(value)) {
              addError("table" /* Table */, index, field.key, {
                level: validation.level ?? "error",
                message: validation.errorMessage ?? "Field must be unique"
              });
            }
          });
          break;
        }
        case "required": {
          const dataToValidate = changedRowIndexes ? changedRowIndexes.map((index) => data[index]) : data;
          dataToValidate.forEach((entry, index) => {
            const realIndex = changedRowIndexes ? changedRowIndexes[index] : index;
            if (!entry[field.key]) {
              addError("row" /* Row */, realIndex, field.key, {
                level: validation.level ?? "error",
                message: validation.errorMessage ?? "Field is required"
              });
            }
          });
          break;
        }
        case "regex": {
          const dataToValidate = changedRowIndexes ? changedRowIndexes.map((index) => data[index]) : data;
          const regex = new RegExp(validation.value, validation.flags);
          dataToValidate.forEach((entry, index) => {
            const realIndex = changedRowIndexes ? changedRowIndexes[index] : index;
            const value = entry[field.key]?.toString() ?? "";
            if (!value.match(regex)) {
              addError("row" /* Row */, realIndex, field.key, {
                level: validation.level ?? "error",
                message: `Field did not match the regex /${validation.value}/${validation.flags ?? ""} `
              });
            }
          });
          break;
        }
      }
    });
  });
  return data.map((value, index) => {
    if (!("__index" in value)) {
      value.__index = v4();
    }
    const newValue = value;
    if (!changedRowIndexes || changedRowIndexes.includes(index)) {
      if (errors[index]) {
        return { ...newValue, __errors: errors[index] };
      }
      if (!errors[index] && value.__errors) {
        return { ...newValue, __errors: null };
      }
    } else {
      const hasRowErrors = value.__errors && Object.values(value.__errors).some(
        (error) => error.source === "row" /* Row */
      );
      if (!hasRowErrors) {
        if (errors[index]) {
          return { ...newValue, __errors: errors[index] };
        }
        return newValue;
      }
      const errorsWithoutTableError = Object.entries(
        value.__errors ?? {}
      ).reduce((acc, [key, value2]) => {
        if (value2.source === "row" /* Row */) {
          acc[key] = value2;
        }
        return acc;
      }, {});
      const newErrors = { ...errorsWithoutTableError, ...errors[index] };
      return { ...newValue, __errors: newErrors };
    }
    return newValue;
  });
};
var TableSelect = ({ onChange, value, options }) => {
  return /* @__PURE__ */ jsx(
    Select,
    {
      autoFocus: true,
      size: "sm",
      value,
      onChange,
      placeholder: " ",
      closeMenuOnScroll: true,
      menuPosition: "fixed",
      menuIsOpen: true,
      menuPortalTarget: document.getElementById(rootId),
      options
    }
  );
};
var SELECT_COLUMN_KEY2 = "select-row";
function autoFocusAndSelect(input) {
  input?.focus();
  input?.select();
}
var generateColumns2 = (fields) => [
  {
    key: SELECT_COLUMN_KEY2,
    name: "",
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    resizable: false,
    sortable: false,
    frozen: true,
    cellClass: "rdg-checkbox",
    renderCell: (props) => {
      const { isRowSelected, onRowSelectionChange } = useRowSelection();
      return /* @__PURE__ */ jsxs(
        Checkbox.Root,
        {
          bg: "white",
          "aria-label": "Select",
          size: "sm",
          colorPalette: "primary",
          checked: isRowSelected,
          onCheckedChange: (event) => {
            onRowSelectionChange({
              row: props.row,
              checked: Boolean(event.checked),
              isShiftClick: false
            });
          },
          children: [
            /* @__PURE__ */ jsx(Checkbox.HiddenInput, {}),
            /* @__PURE__ */ jsx(Checkbox.Control, {})
          ]
        }
      );
    }
  },
  ...fields.map(
    (column) => ({
      key: column.key,
      name: column.label,
      minWidth: 150,
      resizable: true,
      renderHeaderCell: () => /* @__PURE__ */ jsxs(Box, { display: "flex", gap: 1, alignItems: "center", position: "relative", children: [
        /* @__PURE__ */ jsx(Box, { flex: 1, overflow: "hidden", textOverflow: "ellipsis", children: column.label }),
        column.description && /* @__PURE__ */ jsx(
          RsiTooltip,
          {
            positioning: { placement: "top" },
            content: column.description,
            children: /* @__PURE__ */ jsx(Box, { flex: "0 0 auto", children: /* @__PURE__ */ jsx(CgInfo, { size: "16px" }) })
          }
        )
      ] }),
      editable: column.fieldType.type !== "checkbox",
      renderEditCell: ({ row, onRowChange, onClose }) => {
        let component;
        switch (column.fieldType.type) {
          case "select":
            component = /* @__PURE__ */ jsx(
              TableSelect,
              {
                value: column.fieldType.options.find(
                  (option) => (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                    option.value === row[column.key]
                  )
                ),
                onChange: (value) => {
                  onRowChange({ ...row, [column.key]: value?.value }, true);
                },
                options: column.fieldType.options
              }
            );
            break;
          default:
            component = /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(
              Input,
              {
                ref: autoFocusAndSelect,
                variant: "flushed",
                autoFocus: true,
                size: "sm",
                value: row[column.key],
                onChange: (event) => {
                  onRowChange({ ...row, [column.key]: event.target.value });
                },
                onBlur: () => {
                  onClose(true);
                }
              }
            ) });
        }
        return component;
      },
      renderCell: ({ row, onRowChange }) => {
        let component;
        switch (column.fieldType.type) {
          case "checkbox":
            component = /* @__PURE__ */ jsx(
              Box,
              {
                display: "flex",
                alignItems: "center",
                height: "100%",
                onClick: (event) => {
                  event.stopPropagation();
                },
                children: /* @__PURE__ */ jsxs(
                  Switch.Root,
                  {
                    checked: row[column.key],
                    onCheckedChange: (event) => {
                      onRowChange({
                        ...row,
                        [column.key]: event.checked ? row[column.key] : null
                      });
                    },
                    children: [
                      /* @__PURE__ */ jsx(Switch.HiddenInput, {}),
                      /* @__PURE__ */ jsx(Switch.Control, {})
                    ]
                  }
                )
              }
            );
            break;
          case "select":
            component = /* @__PURE__ */ jsx(
              Box,
              {
                minWidth: "100%",
                minHeight: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                children: column.fieldType.options.find(
                  (option) => option.value === row[column.key]
                )?.label ?? null
              }
            );
            break;
          default:
            component = /* @__PURE__ */ jsx(
              Box,
              {
                minWidth: "100%",
                minHeight: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "sm",
                display: "flex",
                alignItems: "center",
                children: row[column.key]
              }
            );
        }
        if (row.__errors?.[column.key]) {
          return /* @__PURE__ */ jsx(
            RsiTooltip,
            {
              positioning: { placement: "top" },
              content: row.__errors[column.key].message,
              children: component
            }
          );
        }
        return component;
      },
      cellClass: (row) => {
        switch (row.__errors?.[column.key]?.level) {
          case "error":
            return "rdg-cell-error";
          case "warning":
            return "rdg-cell-warning";
          case "info":
            return "rdg-cell-info";
          default:
            return "";
        }
      }
    })
  )
];
var SubmitDataAlert = ({ isOpen, onClose, onConfirm }) => {
  const { allowInvalidSubmit, translations: translations2 } = useRsi();
  const cancelRef = useRef(null);
  return /* @__PURE__ */ jsx(
    Dialog.Root,
    {
      open: isOpen,
      onOpenChange: onClose,
      role: "alertdialog",
      placement: "center",
      children: /* @__PURE__ */ jsxs(Portal, { children: [
        /* @__PURE__ */ jsx(Dialog.Backdrop, {}),
        /* @__PURE__ */ jsx(Dialog.Positioner, { children: /* @__PURE__ */ jsxs(Dialog.Content, { children: [
          /* @__PURE__ */ jsx(Dialog.Header, { fontSize: "lg", fontWeight: "bold", children: translations2.alerts.submitIncomplete.headerTitle }),
          /* @__PURE__ */ jsx(Dialog.Body, { children: allowInvalidSubmit ? translations2.alerts.submitIncomplete.bodyText : translations2.alerts.submitIncomplete.bodyTextSubmitForbidden }),
          /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                ref: cancelRef,
                onClick: onClose,
                variant: "outline",
                size: "xs",
                children: translations2.alerts.submitIncomplete.cancelButtonTitle
              }
            ),
            allowInvalidSubmit && /* @__PURE__ */ jsx(
              Button,
              {
                onClick: onConfirm,
                ml: 3,
                size: "xs",
                fontWeight: "bold",
                textTransform: "uppercase",
                colorPalette: "primary",
                children: translations2.alerts.submitIncomplete.finishButtonTitle
              }
            )
          ] })
        ] }) })
      ] })
    }
  );
};
var ValidationStep = ({
  initialData,
  file,
  onBack
}) => {
  const {
    translations: translations2,
    fields,
    onClose,
    onSubmit,
    rowHook,
    tableHook,
    onAsyncError
  } = useRsi();
  const [data, setData] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState(/* @__PURE__ */ new Set());
  const [filterByErrors, setFilterByErrors] = useState(false);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const updateData = useCallback(
    async (rows, indexes) => {
      if (rowHook?.constructor.name === "AsyncFunction" || tableHook?.constructor.name === "AsyncFunction") {
        setData(rows);
      }
      await addErrorsAndRunHooks(
        rows,
        fields,
        rowHook,
        tableHook,
        indexes
      ).then((data2) => {
        setData(data2);
      });
    },
    [rowHook, tableHook, fields]
  );
  const deleteSelectedRows = async () => {
    if (selectedRows.size) {
      const newData = data.filter((value) => !selectedRows.has(value.__index));
      await updateData(newData);
      setSelectedRows(/* @__PURE__ */ new Set());
    }
  };
  const updateRows = useCallback(
    (rows, changedData) => {
      const changes = changedData?.indexes.reduce(
        (acc, index) => {
          const realIndex = data.findIndex(
            (value) => value.__index === rows[index].__index
          );
          acc[realIndex] = rows[index];
          return acc;
        },
        {}
      );
      const realIndexes = changes && Object.keys(changes).map((index) => Number(index));
      const newData = Object.assign([], data, changes);
      updateData(newData, realIndexes).catch(() => {
        rsiToaster.create({
          type: "error",
          title: translations2.alerts.submitError.title,
          description: translations2.alerts.submitError.defaultMessage
        });
      });
    },
    [
      data,
      translations2.alerts.submitError.defaultMessage,
      translations2.alerts.submitError.title,
      updateData
    ]
  );
  const columns = useMemo(() => generateColumns2(fields), [fields]);
  const tableData = useMemo(() => {
    if (filterByErrors) {
      return data.filter((value) => {
        if (value.__errors) {
          return Object.values(value.__errors).filter(
            (err) => err.level === "error"
          ).length;
        }
        return false;
      });
    }
    return data;
  }, [data, filterByErrors]);
  const rowKeyGetter = useCallback((row) => row.__index, []);
  const submitData = () => {
    const calculatedData = data.reduce(
      (acc, value) => {
        const { __index, __errors, ...values } = value;
        if (__errors) {
          for (const key in __errors) {
            if (__errors[key].level === "error") {
              acc.invalidData.push(values);
              return acc;
            }
          }
        }
        acc.validData.push(values);
        return acc;
      },
      { validData: [], invalidData: [], all: data }
    );
    setShowSubmitAlert(false);
    setSubmitting(true);
    onSubmit(calculatedData, file).then(() => {
      onClose();
    }).catch((err) => {
      rsiToaster.create({
        type: "error",
        title: translations2.alerts.submitError.title,
        description: err instanceof Error ? err.message : translations2.alerts.submitError.defaultMessage
      });
    }).finally(() => {
      setSubmitting(false);
    });
  };
  const onContinue = () => {
    const invalidData = data.find((value) => {
      if (value.__errors) {
        return !!Object.values(value.__errors).filter(
          (err) => err.level === "error"
        ).length;
      }
      return false;
    });
    if (!invalidData) {
      submitData();
    } else {
      setShowSubmitAlert(true);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SubmitDataAlert,
      {
        isOpen: showSubmitAlert,
        onClose: () => {
          setShowSubmitAlert(false);
        },
        onConfirm: submitData
      }
    ),
    /* @__PURE__ */ jsxs(Dialog.Body, { pb: 0, children: [
      /* @__PURE__ */ jsxs(
        Box,
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "2rem",
          mt: "1rem",
          flexWrap: "wrap",
          gap: "8px",
          children: [
            /* @__PURE__ */ jsx(Heading, { fontSize: "3xl", children: translations2.validationStep.title }),
            /* @__PURE__ */ jsxs(Box, { display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "xs",
                  colorPalette: "primary",
                  fontWeight: "bold",
                  onClick: wrapAsyncError(deleteSelectedRows, onAsyncError),
                  children: translations2.validationStep.discardButtonTitle
                }
              ),
              /* @__PURE__ */ jsxs(
                Switch.Root,
                {
                  display: "flex",
                  alignItems: "center",
                  checked: filterByErrors,
                  colorPalette: "primary",
                  size: "sm",
                  onCheckedChange: (e) => {
                    setFilterByErrors(e.checked);
                  },
                  children: [
                    /* @__PURE__ */ jsx(Switch.HiddenInput, {}),
                    /* @__PURE__ */ jsx(Switch.Control, { children: /* @__PURE__ */ jsx(Switch.Thumb, {}) }),
                    /* @__PURE__ */ jsx(Switch.Label, { children: translations2.validationStep.filterSwitchTitle }),
                    /* @__PURE__ */ jsx(Switch.Indicator, {})
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Table,
        {
          rowKeyGetter,
          rows: tableData,
          onRowsChange: updateRows,
          columns,
          selectedRows,
          onSelectedRowsChange: (selectedRows2) => {
            setSelectedRows(selectedRows2);
          },
          renderers: {
            noRowsFallback: /* @__PURE__ */ jsx(
              Box,
              {
                display: "flex",
                justifyContent: "center",
                gridColumn: "1/-1",
                mt: "32px",
                children: filterByErrors ? translations2.validationStep.noRowsMessageWhenFiltered : translations2.validationStep.noRowsMessage
              }
            )
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ContinueButton,
      {
        isLoading: isSubmitting,
        onContinue,
        onBack,
        title: translations2.validationStep.nextButtonTitle,
        backTitle: translations2.validationStep.backButtonTitle
      }
    )
  ] });
};
var UserTableColumn = (props) => {
  const {
    column: { header, index, type },
    entries,
    onIgnore,
    onRevertIgnore
  } = props;
  return /* @__PURE__ */ jsxs(Box, { children: [
    /* @__PURE__ */ jsxs(Flex, { px: 6, justifyContent: "space-between", alignItems: "center", mb: 4, children: [
      /* @__PURE__ */ jsx(
        Text,
        {
          fontSize: "xs",
          lineHeight: "4",
          fontWeight: "bold",
          letterSpacing: "wider",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          color: type === 1 /* ignored */ ? "fg.subtle" : "textColor",
          children: header
        }
      ),
      type === 1 /* ignored */ ? /* @__PURE__ */ jsx(
        IconButton,
        {
          "aria-label": "Ignore column",
          onClick: () => {
            onRevertIgnore(index);
          },
          size: "2xs",
          variant: "subtle",
          borderRadius: "lg",
          colorScheme: "gray",
          children: /* @__PURE__ */ jsx(CgUndo, {})
        }
      ) : /* @__PURE__ */ jsx(
        IconButton,
        {
          "aria-label": "Ignore column",
          onClick: () => {
            onIgnore(index);
          },
          size: "2xs",
          variant: "subtle",
          borderRadius: "lg",
          colorScheme: "gray",
          color: "textColor",
          children: /* @__PURE__ */ jsx(CgClose, {})
        }
      )
    ] }),
    entries.map((entry, index2) => /* @__PURE__ */ jsx(
      Text,
      {
        fontSize: "sm",
        fontWeight: "medium",
        px: "6",
        py: "2",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        color: type === 1 /* ignored */ ? "fg.subtle" : "textColor",
        children: entry
      },
      (entry ?? "") + index2.toString()
    ))
  ] });
};
var MatchIcon = (props) => {
  return /* @__PURE__ */ jsx(
    Box,
    {
      minW: 6,
      minH: 6,
      w: 6,
      h: 6,
      ml: "0.875rem",
      mr: 3,
      "data-testid": "column-checkmark",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      borderWidth: "2px",
      bg: props.isChecked ? "green.500" : "transparent",
      color: "background",
      borderColor: props.isChecked ? "green.500" : "gray.300",
      transitionDuration: "ultra-fast",
      children: props.isChecked && /* @__PURE__ */ jsx(CgCheck, { size: "24px" })
    }
  );
};
var MatchColumnSelect = ({
  onChange,
  value,
  options,
  placeholder,
  name
}) => {
  return /* @__PURE__ */ jsx(
    Select,
    {
      value: value ?? null,
      onChange,
      placeholder,
      options,
      menuPosition: "fixed",
      "aria-label": name
    }
  );
};

// src/steps/MatchColumnsStep/utils/getFieldOptions.ts
var getFieldOptions = (fields, fieldKey) => {
  const field = fields.find(({ key }) => fieldKey === key);
  return field?.fieldType.type === "select" ? field.fieldType.options : [];
};
var SubMatchingSelect = ({
  option,
  column,
  onSubChange
}) => {
  const { translations: translations2, fields } = useRsi();
  const options = getFieldOptions(fields, column.value);
  const value = options.find((opt) => opt.value == option.value);
  return /* @__PURE__ */ jsxs(Box, { pl: 2, pb: "0.375rem", children: [
    /* @__PURE__ */ jsx(
      Text,
      {
        pt: "0.375rem",
        pb: "2",
        fontSize: "md",
        lineHeight: "6",
        fontWeight: "medium",
        color: "textColor",
        children: option.entry
      }
    ),
    /* @__PURE__ */ jsx(
      MatchColumnSelect,
      {
        value,
        placeholder: translations2.matchColumnsStep.subSelectPlaceholder,
        onChange: (value2) => {
          onSubChange(value2?.value, column.index, option.entry);
        },
        options,
        name: option.entry
      }
    )
  ] });
};
var getAccordionTitle = (fields, column, translations2) => {
  const fieldLabel = fields.find(
    (field) => "value" in column && field.key === column.value
  )?.label;
  const unmatchedCount = "matchedOptions" in column ? column.matchedOptions.filter((option) => !option.value).length : 0;
  return fieldLabel ? `${translations2.matchColumnsStep.matchDropdownTitle} ${fieldLabel} (${unmatchedCount.toString()} ${translations2.matchColumnsStep.unmatched})` : "";
};
var TemplateColumn = ({
  column,
  onChange,
  onSubChange
}) => {
  const { translations: translations2, fields } = useRsi();
  const isIgnored = column.type === 1 /* ignored */;
  const isChecked = column.type === 2 /* matched */ || column.type === 3 /* matchedCheckbox */ || column.type === 5 /* matchedSelectOptions */;
  const isSelect = "matchedOptions" in column;
  const selectOptions = fields.map(({ label, key }) => ({ value: key, label }));
  const selectValue = selectOptions.find(
    ({ value }) => "value" in column && column.value === value
  );
  return /* @__PURE__ */ jsx(Flex, { minH: 10, w: "100%", flexDir: "column", justifyContent: "center", children: isIgnored ? /* @__PURE__ */ jsx(Text, { fontSize: "sm", fontWeight: "normal", color: "fg.subtle", px: "4", children: translations2.matchColumnsStep.ignoredColumnText }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Flex, { alignItems: "center", minH: 10, w: "100%", children: [
      /* @__PURE__ */ jsx(Box, { flex: 1, children: /* @__PURE__ */ jsx(
        MatchColumnSelect,
        {
          placeholder: translations2.matchColumnsStep.selectPlaceholder,
          value: selectValue,
          onChange: (value) => {
            onChange(value?.value, column.index);
          },
          options: selectOptions,
          name: column.header
        }
      ) }),
      /* @__PURE__ */ jsx(MatchIcon, { isChecked })
    ] }),
    isSelect && /* @__PURE__ */ jsx(Flex, { width: "100%", children: /* @__PURE__ */ jsx(Accordion.Root, { multiple: true, width: "100%", children: /* @__PURE__ */ jsxs(Accordion.Item, { value: column.header, border: "none", py: 1, children: [
      /* @__PURE__ */ jsxs(
        Accordion.ItemTrigger,
        {
          _hover: { bg: "transparent" },
          _focus: { boxShadow: "none" },
          px: 0,
          py: 4,
          "data-testid": "accordion-button",
          asChild: true,
          children: [
            /* @__PURE__ */ jsx(Accordion.ItemIndicator, {}),
            /* @__PURE__ */ jsx(Box, { textAlign: "left", children: /* @__PURE__ */ jsx(Text, { color: "primary.600", fontSize: "sm", pl: "1", children: getAccordionTitle(fields, column, translations2) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Accordion.ItemContent,
        {
          pb: 4,
          pr: 3,
          display: "flex",
          flexDir: "column",
          children: column.matchedOptions.map((option) => /* @__PURE__ */ jsx(
            SubMatchingSelect,
            {
              option,
              column,
              onSubChange
            },
            option.entry
          ))
        }
      )
    ] }) }) })
  ] }) });
};
var FadingWrapper = ({ gridColumn, gridRow }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(
    Box,
    {
      gridColumn,
      gridRow,
      borderRadius: "1.2rem",
      border: "1px solid",
      borderColor: "border",
      pointerEvents: "none"
    }
  ),
  /* @__PURE__ */ jsx(
    Box,
    {
      gridColumn,
      gridRow,
      pointerEvents: "none",
      bgGradient: "linear(to-b, transparent, var(--chakra-colors-background))"
    }
  )
] });
var ColumnGrid = ({
  columns,
  userColumn,
  templateColumn,
  onContinue,
  onBack,
  isLoading
}) => {
  const { translations: translations2 } = useRsi();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Dialog.Body, { flexDir: "column", p: 8, overflow: "auto", h: "100%", children: [
      /* @__PURE__ */ jsx(Heading, { fontSize: "3xl", mb: "2rem", children: translations2.matchColumnsStep.title }),
      /* @__PURE__ */ jsxs(
        Flex,
        {
          flex: 1,
          display: "grid",
          gridTemplateRows: "auto auto auto 1fr",
          gridTemplateColumns: `0.75rem repeat(${columns.length.toString()}, minmax(18rem, auto)) 0.75rem`,
          children: [
            /* @__PURE__ */ jsx(Box, { gridColumn: `1/${(columns.length + 3).toString()}`, children: /* @__PURE__ */ jsx(Text, { color: "textColor", fontSize: "2xl", fontWeight: "semibold", mb: "4", children: translations2.matchColumnsStep.userTableTitle }) }),
            columns.map((column, index) => /* @__PURE__ */ jsx(
              Box,
              {
                gridRow: "2/3",
                gridColumn: `${(index + 2).toString()}/${(index + 3).toString()}`,
                pt: 3,
                children: userColumn(column)
              },
              column.header + index.toString()
            )),
            /* @__PURE__ */ jsx(
              FadingWrapper,
              {
                gridColumn: `1/${(columns.length + 3).toString()}`,
                gridRow: "2/3"
              }
            ),
            /* @__PURE__ */ jsx(Box, { gridColumn: `1/${(columns.length + 3).toString()}`, mt: 7, children: /* @__PURE__ */ jsx(Text, { color: "textColor", fontSize: "2xl", fontWeight: "semibold", mb: "4", children: translations2.matchColumnsStep.templateTitle }) }),
            /* @__PURE__ */ jsx(
              FadingWrapper,
              {
                gridColumn: `1/${(columns.length + 3).toString()}`,
                gridRow: "4/5"
              }
            ),
            columns.map((column, index) => /* @__PURE__ */ jsx(
              Box,
              {
                gridRow: "4/5",
                gridColumn: `${(index + 2).toString()}/${(index + 3).toString()}`,
                py: "1.125rem",
                pl: 2,
                pr: 3,
                children: templateColumn(column)
              },
              column.header + index.toString()
            ))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ContinueButton,
      {
        isLoading,
        onContinue,
        onBack,
        title: translations2.matchColumnsStep.nextButtonTitle,
        backTitle: translations2.matchColumnsStep.backButtonTitle
      }
    )
  ] });
};
var uniqueEntries = (data, index) => uniqBy(
  data.map((row) => ({ entry: row[index] })),
  "entry"
).filter(({ entry }) => !!entry);

// src/steps/MatchColumnsStep/utils/setColumn.ts
var setColumn = (oldColumn, field, data, autoMapSelectValues) => {
  switch (field?.fieldType.type) {
    case "select": {
      const fieldOptions = field.fieldType.options;
      const uniqueData = uniqueEntries(
        data ?? [],
        oldColumn.index
      );
      const matchedOptions = autoMapSelectValues ? uniqueData.map((record) => {
        const value = fieldOptions.find(
          (fieldOption) => fieldOption.value === record.entry || fieldOption.label === record.entry
        )?.value;
        return value ? { ...record, value } : record;
      }) : uniqueData;
      const allMatched = matchedOptions.filter((o) => o.value).length == uniqueData.length;
      return {
        ...oldColumn,
        type: allMatched ? 5 /* matchedSelectOptions */ : 4 /* matchedSelect */,
        value: field.key,
        matchedOptions
      };
    }
    case "checkbox":
      return {
        index: oldColumn.index,
        type: 3 /* matchedCheckbox */,
        value: field.key,
        header: oldColumn.header
      };
    case "input":
      return {
        index: oldColumn.index,
        type: 2 /* matched */,
        value: field.key,
        header: oldColumn.header
      };
    default:
      return {
        index: oldColumn.index,
        header: oldColumn.header,
        type: 0 /* empty */
      };
  }
};

// src/steps/MatchColumnsStep/utils/setIgnoreColumn.ts
var setIgnoreColumn = ({
  header,
  index
}) => ({
  header,
  index,
  type: 1 /* ignored */
});

// src/steps/MatchColumnsStep/utils/setSubColumn.ts
var setSubColumn = (oldColumn, entry, value) => {
  const options = oldColumn.matchedOptions.map(
    (option) => option.entry === entry ? { ...option, value } : option
  );
  const allMathced = options.every(({ value: value2 }) => !!value2);
  if (allMathced) {
    return {
      ...oldColumn,
      matchedOptions: options,
      type: 5 /* matchedSelectOptions */
    };
  } else {
    return {
      ...oldColumn,
      matchedOptions: options,
      type: 4 /* matchedSelect */
    };
  }
};

// src/steps/MatchColumnsStep/utils/normalizeCheckboxValue.ts
var booleanWhitelist = {
  yes: true,
  no: false,
  true: true,
  false: false
};
var normalizeCheckboxValue = (value) => {
  if (value && value.toLowerCase() in booleanWhitelist) {
    return booleanWhitelist[value.toLowerCase()];
  }
  return false;
};

// src/steps/MatchColumnsStep/utils/normalizeTableData.ts
var normalizeTableData = (columns, data, fields) => data.map(
  (row) => columns.reduce((acc, column, index) => {
    const curr = row[index];
    switch (column.type) {
      case 3 /* matchedCheckbox */: {
        const field = fields.find((field2) => field2.key === column.value);
        if (field && "booleanMatches" in field.fieldType && Object.keys(field.fieldType).length) {
          const booleanMatchKey = Object.keys(
            field.fieldType.booleanMatches ?? []
          ).find((key) => key.toLowerCase() === curr?.toLowerCase());
          const booleanMatch = field.fieldType.booleanMatches?.[booleanMatchKey ?? ""];
          acc[column.value] = booleanMatchKey ? booleanMatch : normalizeCheckboxValue(curr);
        } else {
          acc[column.value] = normalizeCheckboxValue(curr);
        }
        return acc;
      }
      case 2 /* matched */: {
        acc[column.value] = curr === "" ? void 0 : curr;
        return acc;
      }
      case 4 /* matchedSelect */:
      case 5 /* matchedSelectOptions */: {
        const matchedOption = column.matchedOptions.find(
          ({ entry }) => entry === curr
        );
        acc[column.value] = matchedOption?.value ?? void 0;
        return acc;
      }
      case 0 /* empty */:
      case 1 /* ignored */: {
        return acc;
      }
      default:
        return acc;
    }
  }, {})
);
var findMatch = (header, fields, autoMapDistance) => {
  if (fields.length === 0) return void 0;
  const smallestValue = fields.reduce(
    (acc, field) => {
      const keyDistance = lavenstein(field.key, header);
      const alternateMatches = field.alternateMatches?.map(
        (alternate) => lavenstein(alternate, header)
      ) ?? [];
      const distance = Math.min(...[keyDistance, ...alternateMatches]);
      return distance < acc.distance ? { value: field.key, distance } : acc;
    },
    { distance: Infinity, value: fields[0].key }
  );
  return smallestValue.distance <= autoMapDistance ? smallestValue.value : void 0;
};

// src/steps/MatchColumnsStep/utils/getMatchedColumns.ts
var getMatchedColumns = (columns, fields, data, autoMapDistance, autoMapSelectValues) => columns.reduce((arr, column) => {
  const autoMatch = findMatch(column.header, fields, autoMapDistance);
  if (autoMatch) {
    const field = fields.find((field2) => field2.key === autoMatch);
    const duplicateIndex = arr.findIndex(
      (column2) => "value" in column2 && column2.value === field.key
    );
    if (duplicateIndex !== -1) {
      const duplicate = arr[duplicateIndex];
      if ("value" in duplicate) {
        return lavenstein(duplicate.value, duplicate.header) < lavenstein(autoMatch, column.header) ? [
          ...arr.slice(0, duplicateIndex),
          setColumn(
            arr[duplicateIndex],
            field,
            data,
            autoMapSelectValues
          ),
          ...arr.slice(duplicateIndex + 1),
          setColumn(column)
        ] : [
          ...arr.slice(0, duplicateIndex),
          setColumn(arr[duplicateIndex]),
          ...arr.slice(duplicateIndex + 1),
          setColumn(column, field, data, autoMapSelectValues)
        ];
      }
    }
    return [...arr, setColumn(column, field, data, autoMapSelectValues)];
  } else {
    return [...arr, column];
  }
}, []);
var UnmatchedFieldsAlert = ({
  isOpen,
  onClose,
  onConfirm,
  fields
}) => {
  const { allowInvalidSubmit, translations: translations2 } = useRsi();
  const cancelRef = useRef(null);
  return /* @__PURE__ */ jsx(
    Dialog.Root,
    {
      open: isOpen,
      onOpenChange: onClose,
      role: "alertdialog",
      placement: "center",
      children: /* @__PURE__ */ jsxs(Portal, { children: [
        /* @__PURE__ */ jsx(Dialog.Backdrop, {}),
        /* @__PURE__ */ jsx(Dialog.Positioner, { children: /* @__PURE__ */ jsxs(Dialog.Content, { children: [
          /* @__PURE__ */ jsx(Dialog.Header, { fontSize: "lg", fontWeight: "bold", children: translations2.alerts.unmatchedRequiredFields.headerTitle }),
          /* @__PURE__ */ jsxs(Dialog.Body, { children: [
            translations2.alerts.unmatchedRequiredFields.bodyText,
            /* @__PURE__ */ jsxs(Box, { pt: 3, children: [
              /* @__PURE__ */ jsx(Text, { display: "inline", children: translations2.alerts.unmatchedRequiredFields.listTitle }),
              /* @__PURE__ */ jsxs(Text, { display: "inline", fontWeight: "bold", children: [
                " ",
                fields.join(", ")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                ref: cancelRef,
                onClick: onClose,
                variant: "outline",
                size: "xs",
                children: translations2.alerts.unmatchedRequiredFields.cancelButtonTitle
              }
            ),
            allowInvalidSubmit && /* @__PURE__ */ jsx(
              Button,
              {
                onClick: onConfirm,
                ml: 3,
                size: "xs",
                fontWeight: "bold",
                textTransform: "uppercase",
                colorPalette: "primary",
                children: translations2.alerts.unmatchedRequiredFields.continueButtonTitle
              }
            )
          ] })
        ] }) })
      ] })
    }
  );
};

// src/steps/MatchColumnsStep/utils/findUnmatchedRequiredFields.ts
var findUnmatchedRequiredFields = (fields, columns) => fields.filter(
  (field) => field.validations?.some((validation) => validation.rule === "required")
).filter(
  (field) => columns.findIndex(
    (column) => "value" in column && column.value === field.key
  ) === -1
).map((field) => field.label);
var MatchColumnsStep = ({
  data,
  headerValues,
  onContinue,
  onBack
}) => {
  const dataExample = data.slice(0, 2);
  const {
    fields,
    autoMapHeaders,
    autoMapSelectValues,
    autoMapDistance,
    translations: translations2
  } = useRsi();
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState(
    // Do not remove spread, it indexes empty array elements, otherwise map() skips over them
    [...headerValues].map((value, index) => ({
      type: 0 /* empty */,
      index,
      header: value
    }))
  );
  const [showUnmatchedFieldsAlert, setShowUnmatchedFieldsAlert] = useState(false);
  const onChange = useCallback(
    (value, columnIndex) => {
      const field = fields.find(
        (field2) => field2.key === value
      );
      const existingFieldIndex = columns.findIndex(
        (column) => "value" in column && column.value === field.key
      );
      setColumns(
        columns.map((column, index) => {
          if (columnIndex === index) {
            return setColumn(column, field, data, autoMapSelectValues);
          } else if (index === existingFieldIndex) {
            rsiToaster.create({
              type: "warning",
              title: translations2.matchColumnsStep.duplicateColumnWarningTitle,
              description: translations2.matchColumnsStep.duplicateColumnWarningDescription
            });
            return setColumn(column);
          } else {
            return column;
          }
        })
      );
    },
    [
      autoMapSelectValues,
      columns,
      data,
      fields,
      translations2.matchColumnsStep.duplicateColumnWarningDescription,
      translations2.matchColumnsStep.duplicateColumnWarningTitle
    ]
  );
  const onIgnore = useCallback(
    (columnIndex) => {
      setColumns(
        columns.map(
          (column, index) => columnIndex === index ? setIgnoreColumn(column) : column
        )
      );
    },
    [columns, setColumns]
  );
  const onRevertIgnore = useCallback(
    (columnIndex) => {
      setColumns(
        columns.map(
          (column, index) => columnIndex === index ? setColumn(column) : column
        )
      );
    },
    [columns, setColumns]
  );
  const onSubChange = useCallback(
    (value, columnIndex, entry) => {
      setColumns(
        columns.map(
          (column, index) => columnIndex === index && "matchedOptions" in column ? setSubColumn(column, entry, value) : column
        )
      );
    },
    [columns, setColumns]
  );
  const unmatchedRequiredFields = useMemo(
    () => findUnmatchedRequiredFields(fields, columns),
    [fields, columns]
  );
  const handleOnContinue = useCallback(() => {
    if (unmatchedRequiredFields.length > 0) {
      setShowUnmatchedFieldsAlert(true);
    } else {
      setIsLoading(true);
      onContinue(normalizeTableData(columns, data, fields), data, columns);
      setIsLoading(false);
    }
  }, [unmatchedRequiredFields.length, onContinue, columns, data, fields]);
  const handleAlertOnContinue = useCallback(() => {
    setShowUnmatchedFieldsAlert(false);
    setIsLoading(true);
    onContinue(normalizeTableData(columns, data, fields), data, columns);
    setIsLoading(false);
  }, [onContinue, columns, data, fields]);
  useEffect(() => {
    if (autoMapHeaders && columns.length > 0) {
      const matchedColumns = getMatchedColumns(
        columns,
        fields,
        data,
        autoMapDistance,
        autoMapSelectValues
      );
      setColumns(matchedColumns);
    }
  }, [
    autoMapHeaders,
    fields,
    data,
    autoMapDistance,
    autoMapSelectValues
    // Removed 'columns' from dependencies to prevent infinite loop
    // This effect should only run once for auto-mapping, not every time columns change
  ]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      UnmatchedFieldsAlert,
      {
        isOpen: showUnmatchedFieldsAlert,
        onClose: () => {
          setShowUnmatchedFieldsAlert(false);
        },
        fields: unmatchedRequiredFields,
        onConfirm: handleAlertOnContinue
      }
    ),
    /* @__PURE__ */ jsx(
      ColumnGrid,
      {
        columns,
        onContinue: handleOnContinue,
        onBack,
        isLoading,
        userColumn: (column) => /* @__PURE__ */ jsx(
          UserTableColumn,
          {
            column,
            onIgnore,
            onRevertIgnore,
            entries: dataExample.map((row) => row[column.index])
          }
        ),
        templateColumn: (column) => /* @__PURE__ */ jsx(
          TemplateColumn,
          {
            column,
            onChange,
            onSubChange
          }
        )
      }
    )
  ] });
};

// src/utils/exceedsMaxRecords.ts
var exceedsMaxRecords = (workSheet, maxRecords) => {
  const [top, bottom] = workSheet["!ref"]?.split(":").map((position) => parseInt(position.replace(/\D/g, ""), 10)) ?? [];
  return bottom - top > maxRecords;
};
var StepType = /* @__PURE__ */ ((StepType2) => {
  StepType2["upload"] = "upload";
  StepType2["selectSheet"] = "selectSheet";
  StepType2["selectHeader"] = "selectHeader";
  StepType2["matchColumns"] = "matchColumns";
  StepType2["validateData"] = "validateData";
  return StepType2;
})(StepType || {});
var UploadFlow = ({ state, onNext, onBack }) => {
  const {
    maxRecords,
    translations: translations2,
    uploadStepHook,
    selectHeaderStepHook,
    matchColumnsStepHook,
    fields,
    rowHook,
    tableHook,
    onAsyncError
  } = useRsi();
  const [uploadedFile, setUploadedFile] = useState(null);
  const errorToast = useCallback(
    (description) => {
      rsiToaster.create({
        type: "error",
        title: translations2.alerts.toast.error,
        description
      });
    },
    [translations2]
  );
  const handleContinue = async (values, rawData, columns) => {
    try {
      const data = await matchColumnsStepHook(values, rawData, columns);
      const dataWithMeta = await addErrorsAndRunHooks(
        data,
        fields,
        rowHook,
        tableHook
      );
      onNext({
        type: "validateData" /* validateData */,
        data: dataWithMeta
      });
    } catch (e) {
      errorToast(e.message);
    }
  };
  switch (state.type) {
    case "upload" /* upload */:
      return /* @__PURE__ */ jsx(
        UploadStep,
        {
          onContinue: async (workbook, file) => {
            setUploadedFile(file);
            const isSingleSheet = workbook.SheetNames.length === 1;
            if (isSingleSheet) {
              if (maxRecords && exceedsMaxRecords(
                workbook.Sheets[workbook.SheetNames[0]],
                maxRecords
              )) {
                errorToast(
                  translations2.uploadStep.maxRecordsExceeded(
                    maxRecords.toString()
                  )
                );
                return;
              }
              try {
                const mappedWorkbook = await uploadStepHook(
                  mapWorkbook(workbook)
                );
                onNext({
                  type: "selectHeader" /* selectHeader */,
                  data: mappedWorkbook
                });
              } catch (e) {
                errorToast(e.message);
              }
            } else {
              onNext({ type: "selectSheet" /* selectSheet */, workbook });
            }
          }
        }
      );
    case "selectSheet" /* selectSheet */:
      return /* @__PURE__ */ jsx(
        SelectSheetStep,
        {
          sheetNames: state.workbook.SheetNames,
          onContinue: async (sheetName) => {
            if (maxRecords && exceedsMaxRecords(state.workbook.Sheets[sheetName], maxRecords)) {
              errorToast(
                translations2.uploadStep.maxRecordsExceeded(
                  maxRecords.toString()
                )
              );
              return;
            }
            try {
              const mappedWorkbook = await uploadStepHook(
                mapWorkbook(state.workbook, sheetName)
              );
              onNext({
                type: "selectHeader" /* selectHeader */,
                data: mappedWorkbook
              });
            } catch (e) {
              errorToast(e.message);
            }
          },
          onBack
        }
      );
    case "selectHeader" /* selectHeader */:
      return /* @__PURE__ */ jsx(
        SelectHeaderStep,
        {
          data: state.data,
          onContinue: async (...args) => {
            try {
              const { data, headerValues } = await selectHeaderStepHook(...args);
              onNext({
                type: "matchColumns" /* matchColumns */,
                data,
                headerValues
              });
            } catch (e) {
              errorToast(e.message);
            }
          },
          onBack
        }
      );
    case "matchColumns" /* matchColumns */:
      return /* @__PURE__ */ jsx(
        MatchColumnsStep,
        {
          data: state.data,
          headerValues: state.headerValues,
          onContinue: wrapAsyncError(handleContinue, onAsyncError),
          onBack
        }
      );
    case "validateData" /* validateData */:
      return uploadedFile && /* @__PURE__ */ jsx(
        ValidationStep,
        {
          initialData: state.data,
          file: uploadedFile,
          onBack
        }
      );
    default:
      return /* @__PURE__ */ jsx(Progress.Root, { value: null, children: /* @__PURE__ */ jsx(Progress.Track, { children: /* @__PURE__ */ jsx(Progress.Range, {}) }) });
  }
};

// src/utils/steps.ts
var steps = [
  "uploadStep",
  "selectHeaderStep",
  "matchColumnsStep",
  "validationStep"
];
var StepTypeToStepRecord = {
  ["upload" /* upload */]: "uploadStep",
  ["selectSheet" /* selectSheet */]: "uploadStep",
  ["selectHeader" /* selectHeader */]: "selectHeaderStep",
  ["matchColumns" /* matchColumns */]: "matchColumnsStep",
  ["validateData" /* validateData */]: "validationStep"
};
var StepToStepTypeRecord = {
  uploadStep: "upload" /* upload */,
  selectHeaderStep: "selectHeader" /* selectHeader */,
  matchColumnsStep: "matchColumns" /* matchColumns */,
  validationStep: "validateData" /* validateData */
};
var stepIndexToStepType = (stepIndex) => {
  const step = steps[stepIndex];
  return StepToStepTypeRecord[step];
};
var stepTypeToStepIndex = (type) => {
  const step = StepTypeToStepRecord[type ?? "upload" /* upload */];
  return Math.max(0, steps.indexOf(step));
};
var Steps = () => {
  const { initialStepState, translations: translations2, isNavigationEnabled } = useRsi();
  const initialStep = stepTypeToStepIndex(initialStepState?.type);
  const [step, setStep] = useState(initialStep);
  const [state, setState] = useState({ type: "upload" /* upload */ });
  const history = useRef([]);
  const onClickStep = (stepIndex) => {
    const type = stepIndexToStepType(stepIndex);
    const historyIdx = history.current.findIndex((v) => v.type === type);
    if (historyIdx === -1) return;
    const nextHistory = history.current.slice(0, historyIdx + 1);
    history.current = nextHistory;
    setState(nextHistory[nextHistory.length - 1]);
    setStep(stepIndex);
  };
  const onBack = () => {
    onClickStep(Math.max(step - 1, 0));
  };
  const onNext = (v) => {
    history.current.push(state);
    setState(v);
    if (v.type !== "selectSheet" /* selectSheet */) setStep(step + 1);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Dialog.Header, { display: ["none", "none", "block"], bgColor: "bg.muted", children: /* @__PURE__ */ jsx(
      Steps$1.Root,
      {
        step,
        onStepChange: (e) => {
          if (isNavigationEnabled) {
            onClickStep(e.step);
          }
        },
        count: steps.length,
        colorPalette: "primary",
        size: "md",
        children: /* @__PURE__ */ jsx(Steps$1.List, { children: steps.map((key, index) => /* @__PURE__ */ jsxs(
          Steps$1.Item,
          {
            index,
            title: translations2[key].title,
            children: [
              /* @__PURE__ */ jsx(Steps$1.Indicator, { children: /* @__PURE__ */ jsx(
                Steps$1.Status,
                {
                  incomplete: index + 1,
                  complete: /* @__PURE__ */ jsx(CheckIcon, {})
                }
              ) }),
              /* @__PURE__ */ jsx(Steps$1.Title, { children: translations2[key].title }),
              /* @__PURE__ */ jsx(Steps$1.Separator, {})
            ]
          },
          key
        )) })
      }
    ) }),
    /* @__PURE__ */ jsx(Dialog.Body, { p: "0", children: /* @__PURE__ */ jsx(
      UploadFlow,
      {
        state,
        onNext,
        onBack: isNavigationEnabled ? onBack : void 0
      }
    ) })
  ] });
};
var ConfirmCloseAlert = ({ isOpen, onClose, onConfirm }) => {
  const { translations: translations2 } = useRsi();
  const cancelRef = useRef(null);
  return /* @__PURE__ */ jsx(
    Dialog.Root,
    {
      open: isOpen,
      onOpenChange: onClose,
      role: "alertdialog",
      placement: "center",
      children: /* @__PURE__ */ jsxs(Portal, { children: [
        /* @__PURE__ */ jsx(Dialog.Backdrop, {}),
        /* @__PURE__ */ jsx(Dialog.Positioner, { children: /* @__PURE__ */ jsxs(Dialog.Content, { children: [
          /* @__PURE__ */ jsx(Dialog.Header, { children: /* @__PURE__ */ jsx(Dialog.Title, { children: translations2.alerts.confirmClose.headerTitle }) }),
          /* @__PURE__ */ jsx(Dialog.Body, { children: translations2.alerts.confirmClose.bodyText }),
          /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                ref: cancelRef,
                onClick: onClose,
                variant: "outline",
                size: "xs",
                children: translations2.alerts.confirmClose.cancelButtonTitle
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: onConfirm,
                ml: 3,
                size: "xs",
                fontWeight: "bold",
                colorPalette: "red",
                textTransform: "uppercase",
                children: translations2.alerts.confirmClose.exitButtonTitle
              }
            )
          ] })
        ] }) })
      ] })
    }
  );
};
var ModalCloseButton = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ConfirmCloseAlert,
      {
        isOpen: showModal,
        onClose: () => {
          setShowModal(false);
        },
        onConfirm: () => {
          setShowModal(false);
          onClose();
        }
      }
    ),
    /* @__PURE__ */ jsx(
      CloseButton,
      {
        "aria-label": "Close modal",
        borderRadius: "full",
        onClick: () => {
          setShowModal(true);
        }
      }
    )
  ] });
};
var ModalWrapper = ({ children, isOpen, onClose }) => {
  const { rtl } = useRsi();
  return /* @__PURE__ */ jsx(
    Dialog.Root,
    {
      open: isOpen,
      onOpenChange: onClose,
      id: "rsi",
      scrollBehavior: "inside",
      closeOnEscape: true,
      role: "dialog",
      size: "cover",
      placement: "center",
      children: /* @__PURE__ */ jsxs("div", { dir: rtl ? "rtl" : "ltr", children: [
        /* @__PURE__ */ jsx(Dialog.Backdrop, {}),
        /* @__PURE__ */ jsx(Dialog.Positioner, { children: /* @__PURE__ */ jsxs(Dialog.Content, { overflow: "hidden", borderRadius: "xl", children: [
          /* @__PURE__ */ jsx(Dialog.Header, { justifyContent: "flex-end", p: "0", bgColor: "bg.muted", children: /* @__PURE__ */ jsx(ModalCloseButton, { onClose }) }),
          children
        ] }) })
      ] })
    }
  );
};

// src/translationsRSIProps.ts
var translations = {
  uploadStep: {
    title: "Upload file",
    manifestTitle: "Data that we expect:",
    manifestDescription: "(You will have a chance to rename or remove columns in next steps)",
    maxRecordsExceeded: (maxRecords) => `Too many records. Up to ${maxRecords} allowed`,
    dropzone: {
      title: "Upload .xlsx, .xls or .csv file",
      errorToastDescription: "upload rejected",
      activeDropzoneTitle: "Drop file here...",
      buttonTitle: "Select file",
      loadingTitle: "Processing..."
    },
    selectSheet: {
      title: "Select the sheet to use",
      nextButtonTitle: "Next",
      backButtonTitle: "Back"
    }
  },
  selectHeaderStep: {
    title: "Select header row",
    nextButtonTitle: "Next",
    backButtonTitle: "Back"
  },
  matchColumnsStep: {
    title: "Match Columns",
    nextButtonTitle: "Next",
    backButtonTitle: "Back",
    userTableTitle: "Your table",
    templateTitle: "Will become",
    selectPlaceholder: "Select column...",
    ignoredColumnText: "Column ignored",
    subSelectPlaceholder: "Select...",
    matchDropdownTitle: "Match",
    unmatched: "Unmatched",
    duplicateColumnWarningTitle: "Another column unselected",
    duplicateColumnWarningDescription: "Columns cannot duplicate"
  },
  validationStep: {
    title: "Validate data",
    nextButtonTitle: "Confirm",
    backButtonTitle: "Back",
    noRowsMessage: "No data found",
    noRowsMessageWhenFiltered: "No data containing errors",
    discardButtonTitle: "Discard selected rows",
    filterSwitchTitle: "Show only rows with errors"
  },
  alerts: {
    confirmClose: {
      headerTitle: "Exit import flow",
      bodyText: "Are you sure? Your current information will not be saved.",
      cancelButtonTitle: "Cancel",
      exitButtonTitle: "Exit flow"
    },
    submitIncomplete: {
      headerTitle: "Errors detected",
      bodyText: "There are still some rows that contain errors. Rows with errors will be ignored when submitting.",
      bodyTextSubmitForbidden: "There are still some rows containing errors.",
      cancelButtonTitle: "Cancel",
      finishButtonTitle: "Submit"
    },
    submitError: {
      title: "Error",
      defaultMessage: "An error occurred while submitting data"
    },
    unmatchedRequiredFields: {
      headerTitle: "Not all columns matched",
      bodyText: "There are required columns that are not matched or ignored. Do you want to continue?",
      listTitle: "Columns not matched:",
      cancelButtonTitle: "Cancel",
      continueButtonTitle: "Continue"
    },
    toast: {
      error: "Error"
    }
  }
};
var defaultRSIProps = {
  autoMapHeaders: true,
  autoMapSelectValues: false,
  allowInvalidSubmit: true,
  autoMapDistance: 2,
  isNavigationEnabled: false,
  translations,
  uploadStepHook: (data) => Promise.resolve(data),
  selectHeaderStepHook: (headerValues, data) => Promise.resolve({
    headerValues,
    data
  }),
  matchColumnsStepHook: (table, ..._args) => Promise.resolve(table),
  dateFormat: "yyyy-mm-dd",
  // ISO 8601,
  parseRaw: true
};
var ReactSpreadsheetImport = (propsWithoutDefaults) => {
  const props = merge({}, defaultRSIProps, propsWithoutDefaults);
  const mergedTranslations = props.translations !== translations ? merge(translations, props.translations) : translations;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(RsiToaster, {}),
    /* @__PURE__ */ jsx(Providers, { rsiValues: { ...props, translations: mergedTranslations }, children: /* @__PURE__ */ jsx(ModalWrapper, { isOpen: props.isOpen, onClose: props.onClose, children: /* @__PURE__ */ jsx(Steps, {}) }) })
  ] });
};

export { ReactSpreadsheetImport, RsiToaster, StepType, defaultRSIProps, rsiToaster };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map