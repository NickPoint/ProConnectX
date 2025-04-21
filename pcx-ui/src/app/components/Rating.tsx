import {Stack, Typography} from "@mui/material";
import {StarRate} from "@mui/icons-material";
import Chip from "@mui/material/Chip";

export type RatingProps =
    | { rating: number; ratingCount: undefined, withRatingCount?: false }
    | { rating: number; ratingCount: number; withRatingCount: true };

function getRatingText(rating: number): string {
    if (rating <= 0) {
        return 'No rating';
    } else if (rating < 2) {
        return 'Poor';
    } else if (rating < 3) {
        return 'Average';
    } else if (rating < 4) {
        return 'Good';
    } else if (rating < 5) {
        return 'Very good';
    } else {
        return 'Excellent';
    }
}

const Rating: React.FC<RatingProps> = ({rating, ratingCount, withRatingCount}) => {
    if (rating <= 0) {
        return <Chip color='primary' label='New' />;
    }
    return (
        <>
            <Stack direction="row" spacing={1}>
                <StarRate/>
                <Typography variant="body1">{`${rating}/5 - ${getRatingText(rating)}`}</Typography>
            </Stack>
            {withRatingCount && ratingCount > 0 &&
                (<Typography component="a" variant="body2">{`${ratingCount} reviews`}</Typography>)}
        </>
    );
}

export default Rating;