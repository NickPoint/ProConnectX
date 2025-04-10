import Grid from "@mui/material/Grid"
import {Box, BoxProps, ButtonProps, Chip, Typography} from "@mui/material";
import {useGetProjectQuery} from "../../../features/api/enhancedApi";
import {Place, UnfoldMore} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import {Link as RouterLink, useNavigate, useParams} from "react-router-dom";
import {format} from 'date-fns';
import {useAppDispatch} from "../../hooks";
import {useEffect} from "react";
import {setPageTitle} from "../../../features/header/headerSlice";
import {GetProjectApiResponse, ProjectOwnerDto, ProjectType} from "../../../features/api/pcxApi";
import BidCard from "../bids/BidCard";

export const FloatingButton = styled(Button)<ButtonProps>(({theme}) => ({
    position: 'fixed',
    bottom: theme.spacing(5),
    left: '50%',
    transform: 'translateX(-50%)'
}));

export const BoxMainInfo = styled(Box)<BoxProps>(({theme}) => ({
    borderRadius: theme.spacing(2),
    borderColor: theme.palette.grey["400"],
    borderStyle: 'solid',
    borderWidth: theme.spacing(0.3),
    height: '100%',
}));

export const useFormattedDate = (dateString: string | undefined, dateFormat: string = 'MMMM do, yyyy') => {
    if (!dateString) {
        return '';
    }
    const date = new Date(dateString);
    return format(date, dateFormat);
}

const checkDataTypes = (data: GetProjectApiResponse): data is ProjectOwnerDto => {
    return (data as ProjectOwnerDto).bids !== undefined;
}

const ProjectPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    if (!id) {
        return <div>Error</div>;
    }

    useEffect(() => {
        dispatch(setPageTitle('Project'));
    }, [dispatch]);

    const {data, isSuccess, isLoading, isFetching}
        = useGetProjectQuery({projectId: Number.parseInt(id)});

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    if (!isSuccess || !data) {
        return <div>Error</div>;
    }

    return (<>
        <Grid container spacing={4} sx={{
            textAlign: 'left'
        }}>
            <Grid size={12}>
                <Grid container spacing={1.5}>
                    <Grid size={12}>
                        <Typography variant='h2' component='h1'>{data.title}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Chip icon={<Place/>} label={data.location}/>
                    </Grid>
                    <Grid size={12} sx={{
                        textAlign: 'center'
                    }}>
                        <Grid container spacing={1}>
                            {data.projectType === ProjectType.Fixed &&
                                <Grid size={6}>
                                    <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                                 flexDirection='column'>
                                        <Typography variant='body1'>{data.budget}</Typography>
                                        <Typography variant='body2'>Fixed price</Typography>
                                    </BoxMainInfo>
                                </Grid>
                            }
                            {data.projectType === ProjectType.Bid &&
                                <>
                                    <Grid size={4}>
                                        <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                                     flexDirection='column'>
                                            <Typography variant='body1'>{data.maxBid}</Typography>
                                            <Typography variant='body2'>Max bid</Typography>
                                        </BoxMainInfo>
                                    </Grid>
                                    <Grid size={4}>
                                        <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                                     flexDirection='column'>
                                            <Typography variant='body1'>{data.bidCount}</Typography>
                                            <Typography variant='body2'>Bids number</Typography>
                                        </BoxMainInfo>
                                    </Grid>
                                </>
                            }
                            <Grid size={data.projectType === ProjectType.Fixed ? 6 : 4}>
                                <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                             flexDirection='column'>
                                    <Typography variant='body1'>{useFormattedDate(data.dueDate)}</Typography>
                                    <Typography variant='body2'>Deadline</Typography>
                                </BoxMainInfo>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Typography variant='h4' sx={{
                    mb: 1
                }}>Description</Typography>
                <Typography variant='body1'>{data.description}</Typography>
            </Grid>
            <Grid size={12}>
                {data.categories.map((category, index) => (
                    <Chip key={index} label={category}/>
                ))}
            </Grid>
            {checkDataTypes(data) &&
                <>
                    <Grid size={12}>
                        <Typography variant='h4' sx={{
                            mb: 1
                        }}>Bids</Typography>
                        <Grid container spacing={3}>
                            {data.bids.slice(0, 3).map((bid, index) => (
                                <Grid
                                    key={index}
                                    size={{
                                        xs: 12,
                                        md: 6,
                                        lg: 4
                                    }}>
                                    <BidCard {...bid}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid size={12}>
                        <Button startIcon={<UnfoldMore/>} onClick={() => navigate('bids')}>View all bids</Button>
                    </Grid>
                </>
            }
        </Grid>
        {!checkDataTypes(data) &&
            <FloatingButton component={RouterLink} variant='contained' color='primary' to='apply'>Apply
                Now</FloatingButton>
        }
    </>);
}

export default ProjectPage;