import * as yup from "yup";
import {t} from "i18next";
import dayjs from "dayjs";

// --- Types ---

type FieldType = 'text' | 'richtext' | 'select' | 'file' | 'addressGroup' | 'array' | 'number' | 'date';

interface BaseFieldConfig {
    label: string;
    required?: boolean;
    size?: number;
    disabled?: boolean;
    dependsOn?: {
        field: string;                // Field to watch (relative path in same object)
        value?: any;                  // Value that triggers the condition (optional: truthy by default)
        required?: boolean;          // Override required
    };
}

interface TextFieldConfig extends BaseFieldConfig {
    type: 'text';
    email?: boolean;
    multiline?: boolean;
    maxRows?: number;
    rows?: number;
}

interface NumberFieldConfig extends BaseFieldConfig {
    type: 'number';
    min?: number;
    max?: number;
}

interface RichTextFieldConfig extends BaseFieldConfig {
    type: 'richtext';
}

interface SelectFieldConfig extends BaseFieldConfig {
    type: 'select';
    enum: Record<string, string> | string[];
    multiple?: boolean;
    min?: number;
    max?: number;
    maxSize?: boolean;
}

interface FileFieldConfig extends BaseFieldConfig {
    type: 'file';
    allowedMimeTypes?: string[];
    multiple?: boolean;
    min?: number;
    max?: number;
}

interface AddressGroupFieldConfig {
    type: 'addressGroup';
    fields: Record<string, TextFieldConfig>;
}

interface ArrayFieldConfig extends BaseFieldConfig {
    type: 'array';
    fields: Record<string, FieldConfig>;
}

interface DateFieldConfig extends BaseFieldConfig {
    type: 'date';
}

export type FieldConfig =
    | TextFieldConfig
    | NumberFieldConfig
    | RichTextFieldConfig
    | SelectFieldConfig
    | FileFieldConfig
    | AddressGroupFieldConfig
    | ArrayFieldConfig
    | DateFieldConfig;

export type FormStepsConfig = {
    [stepName: string]: {
        [fieldName: string]: FieldConfig;
    };
};

// --- Functions ---

export const generateValidationSchema = (fieldsConfig: FieldConfig) => {
    const buildShape = (config: FieldConfig): Record<string, any> => {
        const shape: Record<string, any> = {};

        for (const [fieldName, fieldConfig] of Object.entries(config)) {
            if (fieldConfig.type) {
                let schema: any;

                switch (fieldConfig.type) {
                    case 'number':
                        schema = yup.number();
                        break;
                    case 'text':
                    case 'richtext':
                        schema = yup.string();
                        break;
                    case 'select':
                    case 'file':
                        schema = yup.array();
                        break;
                    case 'addressGroup':
                        schema = yup.object().shape(buildShape(fieldConfig.fields));
                        break;
                    case 'array':
                        schema = yup.array().of(yup.object().shape(buildShape(fieldConfig.fields)));
                        break;
                    case 'date':
                        schema = yup.date()
                        break;
                    default:
                        schema = yup.string();
                }

                if (fieldConfig.dependsOn) {
                    const { field, value, required = true } = fieldConfig.dependsOn;

                    schema = schema.when(field, {
                        is: val => value !== undefined ? val === value : !!val,
                        then: s => required
                            ? s.required(
                                t('form.error.required', { field: t(`form.fields.${fieldConfig.label}`) })
                            ) : s,
                        otherwise: s => s.notRequired(),
                    });
                } else if (fieldConfig.required) {
                    schema = schema.required(
                        t('form.error.required', { field: t(`form.fields.${fieldConfig.label}`) })
                    );
                }

                if (fieldConfig.email) {
                    schema = schema.email(t('form.error.email'));
                }

                if (fieldConfig.min) {
                    if (fieldConfig.type === 'number') {
                        schema = schema.min(
                            fieldConfig.min,
                            t('form.error.minValue', { number: fieldConfig.min, field: t(`form.fields.${fieldConfig.label}`) })
                        );
                    } else if (fieldConfig.type === 'date') {
                        schema = schema.min(fieldConfig.min, t('form.error.dateMinValue'))
                    } else {
                        schema = schema.min(
                            fieldConfig.min,
                            t('form.error.min', {number: fieldConfig.min, field: t(`form.fields.${fieldConfig.label}`)})
                        );
                    }
                }

                if (fieldConfig.max) {
                    schema = schema.max(
                        fieldConfig.max,
                        t('form.error.max', { number: fieldConfig.max, field: t(`form.fields.${fieldConfig.label}`) })
                    );
                }

                if (fieldConfig.maxSize) {
                    schema
                        .test('fileSize', t('form.fileUpload.error.fileTooLarge'), (value) => {
                            if (!value) return false;
                            return value.size <= 50 * 1024 * 1024;
                        })
                }

                shape[fieldName] = schema;
            } else {
                // Nested object without "type"
                shape[fieldName] = yup.object().shape(buildShape(fieldConfig));
            }
        }

        return shape;
    };

    return yup.object().shape(buildShape(fieldsConfig));
};

export const generateInitialValuesFromConfig = (config: FieldConfig): any => {
    if (typeof config !== 'object' || config === null) return '';

    const result: any = {};

    for (const key in config) {
        const field = config[key];

        if (field.type) {
            switch (field.type) {
                case 'number':
                    result[key] = 0;
                    break;
                case 'text':
                case 'richtext':
                    result[key] = '';
                    break;
                case 'select':
                case 'file':
                    result[key] = [];
                    break;
                case 'addressGroup':
                    result[key] = generateInitialValuesFromConfig(field.fields);
                    break;
                case 'array':
                    result[key] = [generateInitialValuesFromConfig(field.fields)];
                    break;
                case 'date':
                    result[key] = dayjs();
                    break;
                default:
                    result[key] = '';
                    break;
            }
        } else {
            result[key] = generateInitialValuesFromConfig(field);
        }
    }

    return result;
};

export function deepRemoveFiles(obj: any): any {
    if (obj instanceof File || obj instanceof FileList) {
        return undefined; // remove files
    }
    if (Array.isArray(obj)) {
        return obj.map(deepRemoveFiles).filter(v => v !== undefined);
    }
    if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            const cleaned = deepRemoveFiles(obj[key]);
            if (cleaned !== undefined) {
                newObj[key] = cleaned;
            }
        }
        return newObj;
    }
    return obj;
}

export const generateDefaultArrayItem = (fields: Record<string, FieldConfig>) => {
    const item: any = {};
    for (const [key, field] of Object.entries(fields)) {
        if (field.type === 'text' || field.type === 'richtext') {
            item[key] = '';
        } else if (field.type === 'select' || field.type === 'file') {
            item[key] = [];
        } else if (field.type === 'addressGroup') {
            item[key] = generateInitialValuesFromConfig(field.fields);
        } else if (field.type === 'array') {
            item[key] = [];
        }
    }
    return item;
};