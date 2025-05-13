import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import { useTranslation } from "react-i18next"
import { Star } from "@mui/icons-material"

interface RatingCardProps {
  rating: number
  ratingCount: number
}

export default function RatingCard({ rating, ratingCount }: RatingCardProps) {
  const { t } = useTranslation();
  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {t("rating.yourRating")}
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center" }}
          >
            <Star color='warning'/>
            <Typography variant="h4" component="p">
              {rating}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {t("rating.basedOn", { ratingCount: ratingCount })}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
