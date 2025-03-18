import {FormikValues, isEmptyArray} from "formik";

export const replaceEmptyStringsWithNull = (values: FormikValues) => {
    if (typeof values === 'string') {
        return values === '' ? null : values;
    }
    const result: Record<string, any> = {};
    for (let key in values) {
        if (values.hasOwnProperty(key)) {
            result[key] = values[key] === '' || Array.isArray(values[key]) && isEmptyArray(values[key]) ? null : values[key];
        }
    }
    return result;
}