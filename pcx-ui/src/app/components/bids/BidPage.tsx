import {Grid, Typography} from "@mui/material"
import {useAppDispatch} from "../../hooks";
import {BidCardDto, useGetFilteredBidsQuery} from "../../../features/api/pcxApi";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {setPageTitle} from "../../../features/header/headerSlice";
import {BoxMainInfo, useFormattedDate} from "../projects/ProjectPage";

const BidPage = () => {
    const dispatch = useAppDispatch();
    const {projectId, id} = useParams<{ projectId: string, id: string }>();

    useEffect(() => {
        dispatch(setPageTitle('Bid'));
    }, [dispatch]);

    if (!projectId || !id) {
        return <div>Can't find chose bid</div>;
    }

    const {bid} =
        useGetFilteredBidsQuery({projectId: Number.parseInt(projectId)}, {
            selectFromResult: ({data}) => ({
                bid: data?.find((bid: BidCardDto) => bid.id === Number.parseInt(id))})
        });

    if (!bid) {
        return <div>Can't find chose bid</div>;
    }

    return (
        (<Grid container spacing={2} direction={{sm: 'row-reverse'}}>
            <Grid
                size={{
                    xs: 12,
                    sm: 6
                }}
                sx={{
                    textAlign: 'center'
                }}>
                <Grid container spacing={1}>
                    <Grid size={6}>
                        <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                     flexDirection='column' sx={{p: 1}}>
                            <Typography variant='body1'>€{bid?.amount}</Typography>
                            <Typography variant='body2'>Amount</Typography>
                        </BoxMainInfo>
                    </Grid>
                    <Grid size={6}>
                        <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                     flexDirection='column' sx={{p: 1}}>
                            {bid.dueDate ? <Typography variant='body1'>{useFormattedDate(bid.dueDate)}</Typography>
                                : <Typography variant='body1'>No deadline specified</Typography>}
                            <Typography variant='body2'>Deadline</Typography>
                        </BoxMainInfo>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 6
                }}
                sx={{
                    textAlign: 'left'
                }}>
                <Typography variant='h4'>Cover Letter</Typography>
            </Grid>
            <Grid size={12}>
                <Typography variant='body1'>{bid?.coverLetter}</Typography>
            </Grid>
        </Grid>)
    );
}

export default BidPage;