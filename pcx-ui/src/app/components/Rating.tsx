import {Box, Chip, Typography} from "@mui/material";
import {Star} from "@mui/icons-material";

interface RatingProps {
    ratingCount?: number;
    rating?: number;
}

const Rating = (props: RatingProps) =>{
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
            }}>
            {props.ratingCount !== undefined && props.ratingCount > 5 ? (
                <>
                    <Star sx={{color: "primary.main"}}/>
                    <Typography variant="h6" sx={{
                        ml: 0.5
                    }}>{props.rating?.toPrecision(2)}</Typography>
                </>
            ) : (
                <Chip label="Newbie" variant='outlined' color="success"/>
            )}
        </Box>
    );
}

export default Rating;