import { Divider, Grid, Pagination, Rating, Stack } from "@mui/material"
import Typography from "@mui/material/Typography"
import {
  ServiceDto,
  useGetServiceReviewsQuery,
} from "../../features/api/pcxApi.ts"
import Box from "@mui/material/Box"
import ReviewCard from "./ReviewCard.tsx"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

interface ReviewsProps {
  service: ServiceDto
}

const ServiceReviews: React.FC<ReviewsProps> = ({ service }) => {
  const [page, setPage] = useState(0)
  const { rating, ratingCount } = service
  const { t } = useTranslation()

  if (rating <= 0) {
    return <Typography>{t("service.noReviews")}</Typography>
  }

  const { data } = useGetServiceReviewsQuery({
    serviceId: service.id,
    page: page,
    size: 5,
    sort: ["createdAt", "desc"],
  })

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
          <Typography variant="h1" component="span">
            {rating}
          </Typography>
          <Box>
            <Rating value={rating} readOnly />
            <Typography variant="body2">
              {`Based on ${ratingCount} reviews`}
            </Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid container size={12}>
        {data?.content?.map((review, index) => (
          <Grid key={index} size={12}>
            <ReviewCard {...review} />
          </Grid>
        ))}
      </Grid>
      <Grid size={12}>
        <Pagination
          count={data?.totalPages || 0}
          page={page + 1}
          onChange={(event, value) => setPage(value - 1)}
        />
      </Grid>
    </Grid>
  )
}

export default ServiceReviews
