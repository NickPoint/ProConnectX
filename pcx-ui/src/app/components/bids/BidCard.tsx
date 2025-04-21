import Grid from "@mui/material/Grid"
import {Divider, Paper, Typography} from "@mui/material";
import {BidCardDto} from "../../../features/api/pcxApi";
import Rating from "../Rating.tsx";
import ClientInfo from "../ClientInfo";
import {useLocation, useNavigate} from "react-router-dom";

const BidCard = (props: BidCardDto) => {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname.includes('bids') ? '' : 'bids/';

    return (
        (<Paper sx={{p: 2}} onClick={() => navigate(`${url}${props.id}`)}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Grid container sx={{
                        alignItems: 'center'
                    }}>
                        <Grid size={6}>
                            <ClientInfo firstName={props.owner?.firstName} lastName={props.owner?.lastName}/>
                        </Grid>
                        <Grid size={6}>
                            <Rating rating={props.owner?.rating} ratingCount={props.owner?.ratingCount}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={12} sx={{
                    textAlign: 'left'
                }}>
                    <Typography variant='body1'>{props.shortCoverLetter}</Typography>
                </Grid>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid size={12}>
                    <Grid container>
                        <Grid size={6} sx={{
                            textAlign: 'left'
                        }}>
                            {props.dueDate && <Typography variant='body1'>by {props.dueDate}</Typography>}
                        </Grid>
                        <Grid size={6} sx={{
                            textAlign: 'right'
                        }}>
                            <Typography variant='h6'>${props.amount}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>)
    );
}

export default BidCard;