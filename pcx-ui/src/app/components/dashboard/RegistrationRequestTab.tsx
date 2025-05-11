import {ProfileStatus, ProfileType, RegistrationRequestDto,} from "../../../features/api/pcxApi.ts";
import {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Avatar,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";


const RegistrationRequestCard: FC<RegistrationRequestDto> = ({
                                                                 id,
                                                                 firstName,
                                                                 lastName,
                                                                 avatarImageUrl,
                                                                 phoneNumber,
                                                                 status,
                                                                 rejectionReason,
                                                                 registrationDate,
                                                                 profileType
                                                             }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (profileType === ProfileType.Freelancer) {
            navigate(`/freelancer/${id}`);
        } else if (profileType === ProfileType.Client) {
            navigate(`/client/${id}`);
        }
    };

    return (
        <Card sx={{width: 300, margin: 2}}>
            <CardActionArea onClick={handleCardClick}>
                <CardContent>
                    <Stack spacing={2}>
                        <Avatar src={avatarImageUrl} alt={firstName}
                                style={{width: 50, height: 50, borderRadius: '50%'}}/>

                        {/* Name */}
                        <Typography
                            variant="h6">{firstName} {lastName}</Typography>

                        {/* Phone Number */}
                        <Typography variant="body2">{phoneNumber}</Typography>

                        {/* Registration Date */}
                        <Typography variant="body2">Registered
                            on: {new Date(registrationDate).toLocaleDateString()}</Typography>

                        {/* Status Chip */}
                        <Chip label={status}
                              color={status === ProfileStatus.Active ? 'success' : 'error'}/>

                        {/* Rejection Reason */}
                        {status === ProfileStatus.Rejected && rejectionReason && (
                            <Typography variant="body2"
                                        color="error">Reason: {rejectionReason}</Typography>
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

const RegistrationRequestTab = () => {
    const [status, setProfileStatus] = useState<ProfileStatus>(ProfileStatus.Pending);
    const {data: regReqs, isSuccess} = useGetRegistrationRequestsQuery({status: status});
    const {t} = useTranslation();

    if (!isSuccess || !regReqs) {
        return <Typography>Seems like something went totally wrong</Typography>
    }

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextField
                    select
                    value={status}
                    onChange={(e) =>
                        setProfileStatus(e.target.value as ProfileStatus)}
                    label={t('dashboard.menu.registrations.status')}>
                    {Object.values(ProfileStatus).map((status, index) => (
                        <MenuItem key={index} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            {regReqs.map((regReq, index) => (
                <Grid size={{xs: 12, md: 6}} key={index}>
                    <RegistrationRequestCard {...regReq} />
                </Grid>
            ))}
        </Grid>
    );
}

export default RegistrationRequestTab;