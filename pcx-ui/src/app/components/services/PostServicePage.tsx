import {Field, FieldArray} from "formik";
import {array, number, object, string} from "yup";
import {
    CategoryType,
    Faq,
    // useCreateServiceMutation,
    WorkflowStep
} from "../../../features/api/pcxApi";
import {
    useCreateServiceMutation
} from "../../../features/api/enhancedApi";
import Grid from "@mui/material/Grid"
import {Button, Divider, FormControl, IconButton, MenuItem, Typography, useMediaQuery} from "@mui/material";
import {Category} from "../../../features/enums";
import {useTheme} from "@mui/material/styles";
import {Select, TextField} from "formik-mui";
import {StepperForm} from "../StepperForm.tsx";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import {Delete, DragHandle} from "@mui/icons-material";
import {closestCenter, DndContext} from '@dnd-kit/core';
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {FileUpload} from "../FileUpload.tsx";
import {useNavigate} from "react-router-dom";
import StarterKit from "@tiptap/starter-kit";
import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    RichTextEditorRef
} from "mui-tiptap";
import {useRef} from "react";
import {enqueueSnackbar} from "notistack";
import {useTranslation} from "react-i18next";


const Step1 = () => {
    return (
        <Grid container spacing={1}>
            <Grid size={12}>
                <Field name="step1.title" label="Title" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={12}>
                <Field name="step1.price" label="Price" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={12}>
                <Field name="step1.location" label="Location" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={12}>
                <FormControl required fullWidth>
                    <Field component={Select}
                           name='step1.categories'
                           label='Categories'
                           multiple>
                        {Object.values(Category).map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Field>
                </FormControl>
            </Grid>
            <Grid size={12}>
                <FileUpload name='step1.images' />
            </Grid>
        </Grid>
    );
}

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

const Step2 = () => {
    return (
        <FieldArray name="step2.workflow">
            {({push, remove, form, move}) => {
                const items = form.values.step2.workflow.map((_: WorkflowStep, index: number) => index.toString());

                return (
                    <>
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => {
                                const {active, over} = event;
                                if (active.id !== over?.id) {
                                    move(Number(active.id), Number(over?.id));
                                }
                            }}
                        >
                            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                {form.values.step2.workflow.map((_: WorkflowStep, index: number) => (
                                    <SortableItem key={index} id={index.toString()} index={index}>
                                        <Grid container spacing={1}>
                                            <Grid size={12}>
                                                <Field
                                                    name={`step2.workflow[${index}].title`}
                                                    label="Step Title"
                                                    component={TextField}
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            <Grid size={12}>
                                                <Field
                                                    name={`step2.workflow[${index}].description`}
                                                    label="Step Description"
                                                    component={TextField}
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                />
                                            </Grid>
                                            <Grid size={12} textAlign='right'>
                                                <IconButton color="error" onClick={() => remove(index)}>
                                                    <Delete/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>

                        <Button
                            variant="contained"
                            sx={{mt: 2}}
                            onClick={() => push({
                                stepNumber: form.values.step2.workflow.length + 1,
                                title: '',
                                description: ''
                            })}
                        >
                            Add Step
                        </Button>
                    </>
                );
            }}
        </FieldArray>
    );
}

const Step3 = () => {
    return (
        <FieldArray name="step3.faqs">
            {({push, remove, form, move}) => {
                const items = form.values.step3.faqs.map((_: Faq, index: number) => index.toString());

                return (
                    <>
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => {
                                const {active, over} = event;
                                if (active.id !== over?.id) {
                                    move(Number(active.id), Number(over?.id));
                                }
                            }}
                        >
                            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                {form.values.step3.faqs.map((_: Faq, index: number) => (
                                    <SortableItem key={index} id={index.toString()} index={index}>
                                        <Grid container spacing={1}>
                                            <Grid size={12}>
                                                <Field
                                                    name={`step3.faqs[${index}].question`}
                                                    label="Question"
                                                    component={TextField}
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            <Grid size={12}>
                                                <Field
                                                    name={`step3.faqs[${index}].answer`}
                                                    label="Answer"
                                                    component={TextField}
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    required
                                                />
                                            </Grid>
                                            <Grid size={12} textAlign='right'>
                                                <IconButton color="error" onClick={() => remove(index)}>
                                                    <Delete/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>

                        <Button
                            variant="contained"
                            sx={{mt: 2}}
                            onClick={() => push({
                                stepNumber: form.values.step3.faqs.length + 1,
                                title: '',
                                description: ''
                            })}
                        >
                            Add Step
                        </Button>
                    </>
                );
            }}
        </FieldArray>
    );
}

const Step4 = () => {
    const rteRef = useRef<RichTextEditorRef>(null);
    return (
        <Grid size={12}>
            <RichTextEditor
                ref={rteRef}
                extensions={[StarterKit]}
                // Optionally include `renderControls` for a menu-bar atop the editor:
                renderControls={() => (
                    <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold />
                        <MenuButtonItalic />
                        {/* Add more controls of your choosing here */}
                    </MenuControlsContainer>
                )}
            />
        </Grid>
    );
}

interface PostServiceFormValues {
    step1: {
        title: string,
        price: number,
        location: string,
        categories: CategoryType[],
        images: FileList | File[]
    },
    step2: {
        description: string,
    };
    step3: {
        workflow: WorkflowStep[]
    },
    step4: {
        faqs: Faq[]
    },
}

const initialValues: PostServiceFormValues = {
    step1: {
        title: '',
        price: 0,
        location: '',
        categories: [],
        images: []
    },
    step2: {
        description: ''
    },
    step3: {
        workflow: [
            {
                stepNumber: 1,
                title: '',
                description: '',
            }
        ],
    },
    step4: {
        faqs: [
            {
                question: '',
                answer: '',
            }
        ]
    },
}

const serviceDetailsValidationSchema = object({
    step1: object().shape({
        title: string().required('Title is required'),
        price: number().required('Budget is required'),
        location: string().required('Location is required'),
        categories: array().min(1, 'At least one category is required'),
        images: array().min(1, "At least one image is required"),
    })
});

const descriptionSchema = object({
    step2: object().shape({
        description: string().required('Description is required'),
    })
})

const workflowValidationSchema = object({
    step3: object().shape({
        workflow: array()
            .of(
                object({
                    stepNumber: number().required(),
                    title: string().required('Step title is required'),
                    description: string(),
                })
            )
    })
});

const faqsValidationSchema = object({
    step4: object().shape({
        faqs: array()
            .of(
                object({
                    question: string().required('Question is required'),
                    answer: string().required('Answer is required'),
                })
            )
    })
});

const mapFormToRequest = (values: PostServiceFormValues): FormData => {
    let formData = new FormData();
    formData.append('title', values.step1.title);
    formData.append('description', values.step2.description);
    formData.append('price', values.step1.price.toString());
    formData.append('location', values.step1.location);
    formData.append('categories', values.step1.categories.toString());
    formData.append('workflowJson', JSON.stringify(values.step3.workflow));
    formData.append('faqsJson', JSON.stringify(values.step4.faqs));
    Array.from(values.step1.images).forEach((file) => {
        formData.append('images', file); // `images` must match @RequestParam name
    });
    return formData;
};

const PostsServicePage = () => {
    const [postService] = useCreateServiceMutation();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'))
    const navigate = useNavigate();
    const {t} = useTranslation();

    function getDividerOrientation() {
        return matches ? 'vertical' : 'horizontal';
    }

    return (
        <Grid container spacing={4}>
            <Grid
                size={{
                    xs: 12,
                    md: 'auto',
                }} sx={{alignItems: 'center', display: 'flex'}}>
                <Typography variant='h3' component='h1'>Post a Service</Typography>
            </Grid>
            <Grid size={{
                xs: 12,
                md: 'auto'
            }}>
                <Divider orientation={getDividerOrientation()}/>
            </Grid>
            <Grid size={{xs: 12, md: 'grow'}}>
                <StepperForm
                    submitPerStep={false}
                    steps={[
                        {
                            label: 'Service Details',
                            content: <Step1/>,
                            validationSchema: serviceDetailsValidationSchema
                        },
                        {
                            label: 'Workflow',
                            content: <Step2/>,
                            validationSchema: workflowValidationSchema
                        },
                        {
                            label: 'FAQs',
                            content: <Step3/>,
                            validationSchema: faqsValidationSchema
                        },
                        {
                            label: 'Gallery',
                            content: <Step4/>,
                            validationSchema: descriptionSchema
                        }
                    ]}
                    initialValues={initialValues}
                    onComplete={(values) =>
                        postService(mapFormToRequest(values)).unwrap()
                            .then(response => {
                                enqueueSnackbar(t('service.create'), {variant: 'success'});
                                navigate(`/service/${response.id}`);
                            })}/>
            </Grid>
        </Grid>
    );
}
/*<Alert
    severity="error"
    action={
        <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
                formik.setStatus(undefined);
            }}
        >
            <CloseIcon fontSize="inherit"/>
        </IconButton>
    }
    sx={{mb: 2}}
>
    {formik.status}
</Alert>*/

export default PostsServicePage;