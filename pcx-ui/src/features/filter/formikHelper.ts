import {FormikValues} from "formik";

export const replaceEmptyStringsWithNull = (values: FormikValues) => {
    if (typeof values === 'string') {
        return values === '' ? undefined : values;
    }
    const result: Record<string, any> = {};
    for (let key in values) {
        if (values.hasOwnProperty(key)) {
            result[key] = values[key] === '' ? undefined : values[key];
        }
    }
    return result;
}