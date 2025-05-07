import {Field, FieldArray, useField} from "formik";
import {TextField} from "formik-mui";
import {DatePicker} from 'formik-mui-x-date-pickers';
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack
} from "@mui/material";
import {FileUpload} from "./FileUpload";
import {useAppDispatch} from "../hooks";
import {setActiveField} from "../../features/form/formSlice";
import {useTranslation} from "react-i18next";
import AddressAutocomplete from "./AddressAutocomplete.tsx";
import {FieldConfig, generateDefaultArrayItem} from "./formUtils.ts";
import {TextEditor} from "./TextEditor.tsx";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import {Delete, DragHandle} from "@mui/icons-material";
import {closestCenter, DndContext} from "@dnd-kit/core";
import Chip from "@mui/material/Chip";
import * as React from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import GoogleMaps from "./MuiAddressAutocomplete.tsx";

interface FieldRendererProps {
    fieldName: string;
    step?: string;
    fieldConfig: FieldConfig;
    helperText?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ step, fieldName, fieldConfig, helperText }) => {
    const dispatch = useAppDispatch();
    const fullName = step ? `${step}.${fieldName}` : fieldName;
    const { t } = useTranslation();

    const size = fieldConfig.size || 12;

    if (fieldConfig.type === 'richtext') {
        return (
            <Grid size={{xs: size}}>
                <TextEditor name={fullName} />
            </Grid>
        );
    }

    if (fieldConfig.type === 'addressGroup') {
        return (
            <Grid size={12}>
                <GoogleMaps
                    name={fullName}
                    required={fieldConfig.required}
                    label={t(`form.fields.${fieldConfig.fields.fullAddress.label}`)}
                    onFocus={() => dispatch(setActiveField(`${step}.${fieldName}.fullAddress`))}
                    childs={Object.keys(fieldConfig.fields).filter(key => key !== 'fullAddress')}
                    houseNumberRequired={fieldConfig.fields.houseNumber.required}
                    disabled={fieldConfig.disabled}
                    size={fieldConfig.size}
                />
            </Grid>
        );
    }

    if (fieldConfig.type === 'select') {
        return (
            <Grid size={{xs: size}}>
                <Field name={fullName}>
                    {({ field, form, meta }: any) => (
                        <FormControl required={fieldConfig.required} fullWidth error={Boolean(meta.touched && meta.error)}>
                            <InputLabel>{t(`form.fields.${fieldConfig.label}`)}</InputLabel>
                            <Select
                                label={t(`form.fields.${fieldConfig.label}`)}
                                multiple
                                value={field.value || []}
                                onChange={(event) => form.setFieldValue(fullName, event.target.value)}
                                onBlur={field.onBlur}
                                onFocus={() => dispatch(setActiveField(fullName))}
                                renderValue={(selected: any) => (
                                    <Stack spacing={1} direction='row'>
                                        {selected.map((value: string) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Stack>
                                )}
                            >
                                {Object.values(fieldConfig.enum).map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {t(`enum.${fieldConfig.label}.${option}`)}
                                    </MenuItem>
                                ))}
                            </Select>
                            {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
                        </FormControl>
                    )}
                </Field>
            </Grid>
        );
    }

    if (fieldConfig.type === 'file') {
        return (
            <Grid size={{xs: size}}>
                <FileUpload
                    name={fullName}
                    label={t(`form.fields.${fieldConfig.label}`)}
                    multiple={fieldConfig.multiple}
                    allowedMimeTypes={fieldConfig.allowedMimeTypes}
                />
            </Grid>
        );
    }

    if (fieldConfig.type === 'array') {
        return (
            <FieldArray name={fullName}>
                {({ push, remove, form, move }) => {
                    const items = form.values[step][fieldName].map((_: any, index: number) => index.toString());

                    return (
                        <Grid size={12}>
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => {
                                    const { active, over } = event;
                                    if (active.id !== over?.id) {
                                        move(Number(active.id), Number(over?.id));
                                    }
                                }}
                            >
                                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                    {form.values[step][fieldName]?.map((_: any, index: number) => (
                                        <SortableItem key={index} id={index.toString()} index={index}>
                                            <Grid container spacing={1}>
                                                {Object.entries(fieldConfig.fields).map(([childName, childConfig]) => (
                                                    <Grid size={12} key={childName}>
                                                        <FieldRenderer
                                                            step={`${fullName}[${index}]`}
                                                            fieldName={childName}
                                                            fieldConfig={childConfig}
                                                            helperText={fullName}
                                                        />
                                                    </Grid>
                                                ))}
                                                <Grid size={12} textAlign="right">
                                                    <IconButton color="error" onClick={() => remove(index)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </SortableItem>
                                    ))}
                                </SortableContext>
                            </DndContext>

                            <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                onClick={() =>{
                                    push(generateDefaultArrayItem(fieldConfig.fields));
                                }}
                            >
                                Add Step
                            </Button>
                        </Grid>
                    );
                }}
            </FieldArray>
        );
    }

    if (fieldConfig.type === 'date') {
        return (
            <Grid size={{xs: size}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Field
                        component={DatePicker}
                        label={t(`form.fields.${fieldConfig.label}`)}
                        name={fullName}
                        textField={{
                            required: fieldConfig.required,
                            fullWidth: true
                        }}
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
            </Grid>
        );
    }

    if (fieldConfig.type === 'number') {
        const [, , {setValue}] = useField(fullName);

        return (<Grid size={{xs: size}}>
            <Field
                component={TextField}
                type="number"
                name={fullName}
                label={t(`form.fields.${fieldConfig.label}`)}
                sx={{display: fieldConfig.display}}
                fullWidth
                disabled={fieldConfig.disabled}
                onFocus={() => dispatch(setActiveField(helperText ? helperText : fullName))}
                required={fieldConfig.required}
                onBlur={(e) => {
                    const value = parseFloat(e.target.value).toFixed(2);
                    setValue(value);
                }}
            />
        </Grid>);
    }


    return (
        <Grid size={{xs: size}}>
            <Field
                component={TextField}
                name={fullName}
                type={fieldConfig.inputType}
                label={t(`form.fields.${fieldConfig.label}`)}
                sx={{display: fieldConfig.display}}
                fullWidth
                disabled={fieldConfig.disabled}
                onFocus={() => dispatch(setActiveField(helperText ? helperText : fullName))}
                required={fieldConfig.required}
                multiline={fieldConfig.multiline}
                maxRows={fieldConfig.maxRows}
                rows={fieldConfig.rows}
            />
        </Grid>
    );
};

const SortableItem =
    ({id, index, children}: { id: string, index: number, children: React.ReactNode }) => {
        const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            marginBottom: 8,
            boxShadow: transform ? '0px 5px 15px rgba(0,0,0,0.2)' : undefined,
            zIndex: transform ? 1000 : undefined,
        };

        return (
            <Grid ref={setNodeRef} style={style} {...attributes} sx={{p: 2}} container spacing={2} key={index}
                  component={Paper} variant='outlined'>
                <Grid size={12} sx={{display: "flex", justifyContent: "space-between"}}>
                    <Avatar>
                        {index + 1}
                    </Avatar>
                    <IconButton {...listeners}>
                        <DragHandle/>
                    </IconButton>
                </Grid>
                <Grid size={12}>
                    {children}
                </Grid>
            </Grid>
        );
    };