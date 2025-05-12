import * as React from "react"
import Rating from "@mui/material/Rating"
import Box from "@mui/material/Box"
import StarIcon from "@mui/icons-material/Star"
import { useField } from "formik"
import { useTranslation } from "react-i18next"

interface FormikRatingProps {
  name: string
  labels: { [index: number]: string }
  precision?: number
  getLabelText?: (value: number) => string
}

const FormikRating: React.FC<FormikRatingProps> = ({
  name,
  precision = 0.5,
}) => {
  const [field, , { setValue }] = useField(name)
  const [hover, setHover] = React.useState(-1)
  const { t } = useTranslation()

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number | null,
  ) => {
    setValue(newValue)
  }

  function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`
  }

  const labels: { [index: string]: string } = {
    0.5: t("rating.useless"),
    1: t("rating.useless") + "+",
    1.5: t("rating.poor"),
    2: t("rating.poor") + "+",
    2.5: t("rating.average"),
    3: t("rating.average") + "+",
    3.5: t("rating.good"),
    4: t("rating.good") + "+",
    4.5: t("rating.excellent"),
    5: t("rating.excellent") + "+",
  }

  return (
    <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
      <Rating
        name={name}
        value={field.value}
        precision={precision}
        getLabelText={getLabelText}
        onChange={handleChange}
        onChangeActive={(event, newHover) => {
          setHover(newHover)
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {field.value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : field.value]}</Box>
      )}
    </Box>
  )
}

export default FormikRating
