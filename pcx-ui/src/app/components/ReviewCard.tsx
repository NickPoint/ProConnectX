import {
  Card,
  CardContent,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material"
import { ReviewDto } from "../../features/api/pcxApi.ts"
import UserCard from "./UserCard.tsx"
import { parseOffsetDateTimeToString } from "../../utils/dateParser.ts"

const ReviewCard: React.FC<ReviewDto> = ({
  id,
  rating,
  reviewer,
  body,
  createdAt,
}) => {
  return (
    <Card>
      <CardContent sx={{ p: 2 }} component={Stack} spacing={2}>
        <UserCard {...reviewer} variant="box" withRating />
        <Divider />
        <Stack
          direction="row"
          sx={{ dispay: "flex", alignItems: "center" }}
          spacing={1}
        >
          <Rating value={rating} precision={0.5} readOnly />
          <Typography variant="body2">•</Typography>
          <Typography variant="body2">
            {`${parseOffsetDateTimeToString(createdAt)}`}
          </Typography>
        </Stack>
        {body && <Typography variant="body1">{body}</Typography>}
      </CardContent>
    </Card>
  )
}

export default ReviewCard
