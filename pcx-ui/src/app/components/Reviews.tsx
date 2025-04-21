import {Divider, Grid, Paper, Rating, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Review, ReviewDto} from "../../features/api/pcxApi.ts";
import Box from "@mui/material/Box";
import ReviewCard from "./ReviewCard.tsx";

interface ReviewsProps {
    rating: number;
    ratingCount: number;
    reviews?: ReviewDto[];
}

const Reviews: React.FC<ReviewsProps> = ({rating, ratingCount, reviews}) => {
    if (rating < 0 || !reviews) { {}
        return <></>;
    }
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Stack spacing={1} direction='row' sx={{alignItems: "center"}}>
                    <Typography variant='h1' component='span'>
                        {rating}
                    </Typography>
                    <Box>
                        <Rating value={rating} readOnly/>
                        <Typography variant='body2'>
                            {`Based on ${ratingCount} reviews`}
                        </Typography>
                    </Box>
                </Stack>
            </Grid>
            <Grid size={12}>
                <Divider />
            </Grid>
            <Grid container size={12}>
                {reviews.map((review, index) => (
                    <Grid key={index} size={12}>
                        <ReviewCard {...review}/>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}

export default Reviews;