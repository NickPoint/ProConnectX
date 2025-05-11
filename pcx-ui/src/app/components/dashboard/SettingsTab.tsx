import {Avatar, Button, Grid} from "@mui/material";
import {
    ClientDto,
    FreelancerDto,
    ProfileType,
    useGetClientQuery,
    useGetCurrentUserQuery,
    useGetFreelancerQuery,
    useUpdateClientMutation,
    useUpdateFreelancerMutation
} from "../../../features/api/pcxApi.ts";
import {GlobalLoadingBackdrop} from "../GlobalLoadingBackdrop.tsx";
import {Form, Formik} from "formik";
import {generateValidationSchema} from "../formUtils.ts";
import {FieldRenderer} from "../FieldRenderer.tsx";
import {useTranslation} from "react-i18next";
import {useMemo, useState} from "react";
import {CloudUpload} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {useUpdateAvatarMutation} from "../../../features/api/enhancedApi.ts";
import {enqueueSnackbar} from "notistack";

const formConf = {
    firstName: { label: 'firstName', required: true, type: 'text', size: 6 },
    lastName: { label: 'lastName', required: true, type: 'text', size: 6 },
    phoneNumber: { label: 'phoneNumber', required: true, type: 'text', size: 12 },
    address: {
        type: 'addressGroup',
        fields: {
            fullAddress: { label: 'address', required: true, type: 'place', size: 12 },
            houseNumber: { label: 'houseNumber', required: true, type: 'text', size: 4 },
            street: { label: 'street', required: true, type: 'text', size: 12 },
            city: { label: 'city', required: true, type: 'text', size: 6 },
            region: { label: 'region', required: true, type: 'text', size: 6 },
            postalCode: { label: 'postalCode', required: true, type: 'text', size: 6 },
            country: { label: 'country', required: true, type: 'text', size: 6 },
        }
    }
};


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export function ImageUpload() {
    const {t} = useTranslation();
    const [updateAvatar] = useUpdateAvatarMutation();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        formData.append('avatar', files[0]);

        updateAvatar(formData).unwrap()
            .then(() => enqueueSnackbar(t('dashboard.settings.imageUpload.success'), {variant: 'success'}));
    };

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
        >
            {t('buttons.imageUpload')}
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => handleUpload(event)}
                accept="image/*"
            />
        </Button>
    );
}

const SettingsTab = () => {
    const {t} = useTranslation();
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [updateFreelancer] = useUpdateFreelancerMutation();
    const [updateClient] = useUpdateClientMutation();
    const controlledFormConf = useMemo(() => {
        const addDisabled = (fields) => {
            return Object.fromEntries(
                Object.entries(fields).map(([key, config]) => {
                    return [key, { ...config, disabled: isReadOnly }];
                })
            );
        };

        return addDisabled(formConf);
    }, [isReadOnly]);

    const {data: user} = useGetCurrentUserQuery();
    if (!user) {
        return <GlobalLoadingBackdrop />
    }

    let profileData: ClientDto | FreelancerDto | undefined;
    let onSubmit: any
    if (user.activeProfile?.profileType === ProfileType.Freelancer) {
        const {data, refetch} = useGetFreelancerQuery();
        profileData = data;
        onSubmit = updateFreelancer;
    } else if (user.activeProfile?.profileType === ProfileType.Client) {
        const {data, refetch} = useGetClientQuery()
        profileData = data;
        onSubmit = updateClient;
    }

    if (!profileData) {
        return <GlobalLoadingBackdrop />
    }

    const initialValues = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        address: {
            fullAddress: {
                placeId: null,
                description: `${profileData.address.street} ${profileData.address.houseNumber}, ${profileData.address.city}, ${profileData.address.region}, ${profileData.address.postalCode}, ${profileData.address.country}`,
                structured_formatting: null,
            },
            street: profileData.address.street,
            houseNumber: profileData.address.houseNumber,
            city: profileData.address.city,
            postalCode: profileData.address.postalCode,
            region: profileData.address.region,
            country: profileData.address.country,
        }
    }

    return (
        <Grid container alignItems="center" spacing={4}>
            <Grid container size={{xs: 12, md: 4}} spacing={1}>
                <Grid size={12} display="flex" alignItems="center" justifyContent="center">
                    <Avatar sx={{
                        width: '256px',
                        height: '256px',
                    }} slotProps={{
                        img: {
                            style: {
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                            },
                        },
                    }} alt={profileData.firstName} src={profileData.avatarImageUrl}/>
                </Grid>
                <Grid size={12} display="flex" alignItems="center" justifyContent="center">
                    <ImageUpload />
                </Grid>
            </Grid>
            <Grid size={{xs: 12, md: 8}}>
                <Formik initialValues={initialValues}
                            validationSchema={generateValidationSchema(formConf)}
                            onSubmit={(values, formikHelpers) => {
                                onSubmit({userProfileUpdateDto: values}).unwrap()
                                    .then(() => enqueueSnackbar(t('dashboard.settings.userProfile.success'), {variant: 'success'}))
                                    .finally(() => {
                                        setIsReadOnly(true);
                                    });
                            }}>
                    {({resetForm, isSubmitting}) =>
                        <Form noValidate>
                            <Grid container size={12} spacing={2}>
                            <Grid container size={12} spacing={1}>
                                {Object.entries(controlledFormConf).map(([fieldName, fieldConfig]) => (
                                    <FieldRenderer key={fieldName} fieldName={fieldName} fieldConfig={fieldConfig}/>
                                ))}
                            </Grid>
                            <Grid size={12} container spacing={1} justifyContent='flex-end'>
                                {isReadOnly ?
                                    <Button onClick={() => setIsReadOnly(false)}>{t('buttons.change')}</Button>
                                    : <>
                                        <Button onClick={() => {
                                            setIsReadOnly(true)
                                            resetForm({ values: initialValues })}}>{t('buttons.cancel')}</Button>
                                        <Button loading={isSubmitting} color='success' variant='contained' type='submit'>{t('buttons.save')}</Button>
                                    </>
                                }
                            </Grid>
                            </Grid>
                        </Form>
                    }
                </Formik>
            </Grid>
        </Grid>
    );
}

export default SettingsTab;