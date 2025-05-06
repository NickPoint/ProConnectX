import {AccountStatus, AccountType, RegistrationRequestDto,} from "../../../features/api/pcxApi.ts";
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
                                                                 accountStatus,
                                                                 rejectionReason,
                                                                 registrationDate,
                                                                 accountType
                                                             }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (accountType === AccountType.Freelancer) {
            navigate(`/freelancer/${id}`);
        } else if (accountType === AccountType.Client) {
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
                        <Chip label={accountStatus}
                              color={accountStatus === AccountStatus.Active ? 'success' : 'error'}/>

                        {/* Rejection Reason */}
                        {accountStatus === AccountStatus.Rejected && rejectionReason && (
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
    const [accountStatus, setAccountStatus] = useState<AccountStatus>(AccountStatus.Pending);
    const {data: regReqs, isSuccess} = useGetRegistrationRequestsQuery({accountStatus: accountStatus});
    const {t} = useTranslation();

    if (!isSuccess || !regReqs) {
        return <Typography>Seems like something went totally wrong</Typography>
    }

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextField
                    select
                    value={accountStatus}
                    onChange={(e) =>
                        setAccountStatus(e.target.value as AccountStatus)}
                    label={t('dashboard.menu.registrations.accountStatus')}>
                    {Object.values(AccountStatus).map((accountStatus, index) => (
                        <MenuItem key={index} value={accountStatus}>
                            {accountStatus}
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