import * as react_jsx_runtime from 'react/jsx-runtime';
import { DeepPartial, DeepReadonly } from 'ts-essentials';
import XLSX from 'xlsx-ugnis';
import * as _zag_js_toast from '@zag-js/toast';

interface Meta {
    __index: string;
    __errors?: Error | null;
}
type Error = Record<string, InfoWithSource>;

declare const translations: {
    uploadStep: {
        title: string;
        manifestTitle: string;
        manifestDescription: string;
        maxRecordsExceeded: (maxRecords: string) => string;
        dropzone: {
            title: string;
            errorToastDescription: string;
            activeDropzoneTitle: string;
            buttonTitle: string;
            loadingTitle: string;
        };
        selectSheet: {
            title: string;
            nextButtonTitle: string;
            backButtonTitle: string;
        };
    };
    selectHeaderStep: {
        title: string;
        nextButtonTitle: string;
        backButtonTitle: string;
    };
    matchColumnsStep: {
        title: string;
        nextButtonTitle: string;
        backButtonTitle: string;
        userTableTitle: string;
        templateTitle: string;
        selectPlaceholder: string;
        ignoredColumnText: string;
        subSelectPlaceholder: string;
        matchDropdownTitle: string;
        unmatched: string;
        duplicateColumnWarningTitle: string;
        duplicateColumnWarningDescription: string;
    };
    validationStep: {
        title: string;
        nextButtonTitle: string;
        backButtonTitle: string;
        noRowsMessage: string;
        noRowsMessageWhenFiltered: string;
        discardButtonTitle: string;
        filterSwitchTitle: string;
    };
    alerts: {
        confirmClose: {
            headerTitle: string;
            bodyText: string;
            cancelButtonTitle: string;
            exitButtonTitle: string;
        };
        submitIncomplete: {
            headerTitle: string;
            bodyText: string;
            bodyTextSubmitForbidden: string;
            cancelButtonTitle: string;
            finishButtonTitle: string;
        };
        submitError: {
            title: string;
            defaultMessage: string;
        };
        unmatchedRequiredFields: {
            headerTitle: string;
            bodyText: string;
            listTitle: string;
            cancelButtonTitle: string;
            continueButtonTitle: string;
        };
        toast: {
            error: string;
        };
    };
};
type TranslationsRSIProps = DeepPartial<typeof translations>;

declare enum ColumnType {
    empty = 0,
    ignored = 1,
    matched = 2,
    matchedCheckbox = 3,
    matchedSelect = 4,
    matchedSelectOptions = 5
}
interface MatchedOptions<T> {
    entry: string;
    value: T;
}
interface EmptyColumn {
    type: ColumnType.empty;
    index: number;
    header: string;
}
interface IgnoredColumn {
    type: ColumnType.ignored;
    index: number;
    header: string;
}
interface MatchedColumn<T> {
    type: ColumnType.matched;
    index: number;
    header: string;
    value: T;
}
interface MatchedSwitchColumn<T> {
    type: ColumnType.matchedCheckbox;
    index: number;
    header: string;
    value: T;
}
interface MatchedSelectColumn<T> {
    type: ColumnType.matchedSelect;
    index: number;
    header: string;
    value: T;
    matchedOptions: Partial<MatchedOptions<T>>[];
}
interface MatchedSelectOptionsColumn<T> {
    type: ColumnType.matchedSelectOptions;
    index: number;
    header: string;
    value: T;
    matchedOptions: MatchedOptions<T>[];
}
type Column<T extends string> = EmptyColumn | IgnoredColumn | MatchedColumn<T> | MatchedSwitchColumn<T> | MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T>;
type Columns<T extends string> = Column<T>[];

declare enum StepType {
    upload = "upload",
    selectSheet = "selectSheet",
    selectHeader = "selectHeader",
    matchColumns = "matchColumns",
    validateData = "validateData"
}
type StepState = {
    type: StepType.upload;
} | {
    type: StepType.selectSheet;
    workbook: XLSX.WorkBook;
} | {
    type: StepType.selectHeader;
    data: RawData[];
} | {
    type: StepType.matchColumns;
    data: RawData[];
    headerValues: RawData;
} | {
    type: StepType.validateData;
    data: any[];
};

interface RsiProps<T extends string> {
    isOpen: boolean;
    onClose: () => void;
    fields: Fields<T>;
    uploadStepHook?: (data: RawData[]) => Promise<RawData[]>;
    selectHeaderStepHook?: (headerValues: RawData, data: RawData[]) => Promise<{
        headerValues: RawData;
        data: RawData[];
    }>;
    matchColumnsStepHook?: (table: Data<T>[], rawData: RawData[], columns: Columns<T>) => Promise<Data<T>[]>;
    rowHook?: RowHook<T>;
    tableHook?: TableHook<T>;
    onSubmit: (data: Result<T>, file: File) => Promise<unknown>;
    allowInvalidSubmit?: boolean;
    isNavigationEnabled?: boolean;
    translations?: TranslationsRSIProps;
    customTheme?: object;
    maxRecords?: number;
    maxFileSize?: number;
    autoMapHeaders?: boolean;
    autoMapSelectValues?: boolean;
    autoMapDistance?: number;
    initialStepState?: StepState;
    dateFormat?: string;
    parseRaw?: boolean;
    rtl?: boolean;
    /** Called when an async handler rejects (e.g. dropzone, column match). Host apps can forward to Sentry. */
    onAsyncError?: (err: unknown) => void;
}
type RawData = (string | undefined)[];
type Data<T extends string> = Record<T, string | boolean | undefined>;
type Fields<T extends string> = DeepReadonly<Field<T>[]>;
interface Field<T extends string> {
    label: string;
    key: T;
    description?: string;
    alternateMatches?: string[];
    validations?: Validation[];
    fieldType: Checkbox | Select | Input;
    example?: string;
}
interface Checkbox {
    type: "checkbox";
    booleanMatches?: Record<string, boolean>;
}
interface Select {
    type: "select";
    options: SelectOption[];
}
interface SelectOption {
    label: string;
    value: string;
}
interface Input {
    type: "input";
}
type Validation = RequiredValidation | UniqueValidation | RegexValidation;
interface RequiredValidation {
    rule: "required";
    errorMessage?: string;
    level?: ErrorLevel;
}
interface UniqueValidation {
    rule: "unique";
    allowEmpty?: boolean;
    errorMessage?: string;
    level?: ErrorLevel;
}
interface RegexValidation {
    rule: "regex";
    value: string;
    flags?: string;
    errorMessage: string;
    level?: ErrorLevel;
}
type RowHook<T extends string> = (row: Data<T>, addError: (fieldKey: T, error: Info) => void, table: Data<T>[]) => Data<T> | Promise<Data<T>>;
type TableHook<T extends string> = (table: Data<T>[], addError: (rowIndex: number, fieldKey: T, error: Info) => void) => Data<T>[] | Promise<Data<T>[]>;
type ErrorLevel = "info" | "warning" | "error";
interface Info {
    message: string;
    level: ErrorLevel;
}
declare enum ErrorSources {
    Table = "table",
    Row = "row"
}
type InfoWithSource = Info & {
    source: ErrorSources;
};
interface Result<T extends string> {
    validData: Data<T>[];
    invalidData: Data<T>[];
    all: (Data<T> & Meta)[];
}

declare const rsiToaster: _zag_js_toast.Store<any>;
declare const RsiToaster: () => react_jsx_runtime.JSX.Element;

declare const defaultRSIProps: {
    readonly autoMapHeaders: true;
    readonly autoMapSelectValues: false;
    readonly allowInvalidSubmit: true;
    readonly autoMapDistance: 2;
    readonly isNavigationEnabled: false;
    readonly translations: {
        uploadStep: {
            title: string;
            manifestTitle: string;
            manifestDescription: string;
            maxRecordsExceeded: (maxRecords: string) => string;
            dropzone: {
                title: string;
                errorToastDescription: string;
                activeDropzoneTitle: string;
                buttonTitle: string;
                loadingTitle: string;
            };
            selectSheet: {
                title: string;
                nextButtonTitle: string;
                backButtonTitle: string;
            };
        };
        selectHeaderStep: {
            title: string;
            nextButtonTitle: string;
            backButtonTitle: string;
        };
        matchColumnsStep: {
            title: string;
            nextButtonTitle: string;
            backButtonTitle: string;
            userTableTitle: string;
            templateTitle: string;
            selectPlaceholder: string;
            ignoredColumnText: string;
            subSelectPlaceholder: string;
            matchDropdownTitle: string;
            unmatched: string;
            duplicateColumnWarningTitle: string;
            duplicateColumnWarningDescription: string;
        };
        validationStep: {
            title: string;
            nextButtonTitle: string;
            backButtonTitle: string;
            noRowsMessage: string;
            noRowsMessageWhenFiltered: string;
            discardButtonTitle: string;
            filterSwitchTitle: string;
        };
        alerts: {
            confirmClose: {
                headerTitle: string;
                bodyText: string;
                cancelButtonTitle: string;
                exitButtonTitle: string;
            };
            submitIncomplete: {
                headerTitle: string;
                bodyText: string;
                bodyTextSubmitForbidden: string;
                cancelButtonTitle: string;
                finishButtonTitle: string;
            };
            submitError: {
                title: string;
                defaultMessage: string;
            };
            unmatchedRequiredFields: {
                headerTitle: string;
                bodyText: string;
                listTitle: string;
                cancelButtonTitle: string;
                continueButtonTitle: string;
            };
            toast: {
                error: string;
            };
        };
    };
    readonly uploadStepHook: (data: RawData[]) => Promise<RawData[]>;
    readonly selectHeaderStepHook: (headerValues: RawData, data: RawData[]) => Promise<{
        headerValues: RawData;
        data: RawData[];
    }>;
    readonly matchColumnsStepHook: <T extends string = string>(table: Data<T>[], _args_0: RawData[], _args_1: Columns<T>) => Promise<Data<T>[]>;
    readonly dateFormat: "yyyy-mm-dd";
    readonly parseRaw: true;
};

declare const ReactSpreadsheetImport: <T extends string = string>(propsWithoutDefaults: RsiProps<T>) => react_jsx_runtime.JSX.Element;

export { type Data, type Field, type Fields, type RawData, ReactSpreadsheetImport, type Result, type RsiProps, RsiToaster, StepType, defaultRSIProps, rsiToaster };
