import {Stack, Typography} from "@mui/material";
import {StarRate} from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import {t} from "i18next";

export type RatingProps =
    | { rating: number; ratingCount: undefined, withRatingCount?: false }
    | { rating: number; ratingCount: number; withRatingCount: true };

function getRatingText(rating: number): string {
    if (rating <= 0) {
        return t('rating.noRating');
    } else if (rating < 2) {
        return t('rating.poor');
    } else if (rating < 3) {
        return t('rating.average');
    } else if (rating < 4) {
        return t('rating.good');
    } else if (rating < 5) {
        return t('rating.veryGood');
    } else {
        return t('rating.excellent');
    }
}

const Rating: React.FC<RatingProps> = ({rating, ratingCount, withRatingCount}) => {
    if (rating <= 0) {
        return <Chip color='primary' label={t('general.new')} />;
    }
    return (
        <>
            <Stack direction="row" spacing={1}>
                <StarRate/>
                <Typography variant="body1">{`${rating}/5 - ${getRatingText(rating)}`}</Typography>
            </Stack>
            {withRatingCount && ratingCount > 0 &&
                (<Typography component="a" variant="body2">{`${ratingCount} ${t('rating.reviews')}`}</Typography>)}
        </>
    );
}

export default Rating;