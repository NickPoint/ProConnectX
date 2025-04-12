import {
    ButtonGroup,
    Chip,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Stack
} from "@mui/material";
import {DocumentType, useGetPrincipalFilesQuery} from "../../../../features/api/pcxApi.ts";
import {Field} from "formik";
import {fieldToTextField, Select, TextFieldProps} from "formik-mui";
import {Delete, Download, FilePresent} from "@mui/icons-material";


const FileUploadInput = (props: TextFieldProps) => {
    const {
        form: {setFieldValue},
        field: {name},
    } = props;

    return <MuiFileInput {...fieldToTextField(props)} onChange={(file) => setFieldValue(name, file)}/>;
}

const FileUploadForm = () => {
    const {data: files, isLoading, isFetching} = useGetPrincipalFilesQuery();
    return (
        <Grid container spacing={1}>
            <Grid size={{xs: 12}}>
                <Field component={FileUploadInput} name='fileUpload.file' label='Upload File' required fullWidth/>
            </Grid>
            <Grid size={{xs: 12}}>
                <FormControl required fullWidth>
                    <Field component={Select}
                           name='fileUpload.documentType'
                           label='Document Type *'>
                        {Object.values(DocumentType).map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Field>
                </FormControl>
            </Grid>
            <Grid size={{xs: 12}}>
                <List>
                    {files?.map((file, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <FilePresent />
                            </ListItemIcon>
                            <ListItemText
                                primary={file.fileName}
                                secondary={`${file.documentType}`}
                            />
                            <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                                <ButtonGroup>
                                    {/*TODO: make dynamic href*/}
                                    {/*TODO: SUS for testing*/}
                                    {/*TODO: Meeting with Lydia at 31 April 13:00 estonia*/}
                                    <IconButton href={`${import.meta.env.VITE_API_URL}/api/files/download/${file.id}`}>
                                        <Download/>
                                    </IconButton>
                                    <IconButton >
                                        <Delete/>
                                    </IconButton>
                                </ButtonGroup>
                                {file.verified ? <Chip variant='filled' color='primary' label='Verified'/> :
                                <Chip variant='filled' color='warning' label='Not Verified'/>}
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
}

export default FileUploadForm;