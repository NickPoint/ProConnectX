import * as React from "react"
import { useMemo } from "react"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import StatCard, { StatCardProps, StatType } from "./StatCard"
import RatingCard from "./RatingCard"
import {
  ProfileStatus,
  ProfileType,
  useGetCurrentUserQuery,
  useGetStatsOverviewQuery,
} from "../../../features/api/pcxApi.ts"
import RegistrationsTable from "./RegistrationsTable.tsx"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

const statTypesByProfile: Record<ProfileType, StatType[]> = {
  FREELANCER: [
    "DAILY_TOTAL_EARNINGS",
    "ORDERS_COMPLETED",
    "PROFILE_RATING",
    "ORDER_SUCCESS_RATE",
    "ACTIVE_ORDERS",
  ],
  CLIENT: [
    "TOTAL_SERVICES_PURCHASED",
    "PROFILE_RATING",
    // ...
  ],
  // ADMIN: [
  //     'TOTAL_REVENUE',
  //     'TOTAL_USERS',
  //     // ...
  // ],
}

export default function DashboardOverviewTab() {
  const { data: user } = useGetCurrentUserQuery()
  const { t } = useTranslation()
  const queryArgs = useMemo(() => {
    const end = dayjs()
    const start = end.subtract(30, "days")

    return {
      start: start.startOf("day").toISOString(),
      end: end.endOf("day").toISOString(),
      zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }, [])
  const { data: cards } = useGetStatsOverviewQuery(queryArgs, {
    skip: user && user.activeProfile.status !== ProfileStatus.Active,
  })

  const visibleStatTypes =
    statTypesByProfile[user?.activeProfile.profileType] || []

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: theme => theme.spacing(2) }}
      >
        <RegistrationsTable />
        {cards &&
          visibleStatTypes.map((type, index) => {
            const card = cards[type]
            if (!card) return null

            return (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                {type === "PROFILE_RATING" ? (
                  <RatingCard
                    rating={card.value}
                    ratingCount={card.helperValue}
                  />
                ) : (
                  <StatCard
                    type={type}
                    title={t(`enum.statistics.${type}`)}
                    value={card.value}
                    percentGrow={card.percentGrow}
                    interval={t("dashboard.stats.last30Days")}
                    startDate={queryArgs.start}
                    endDate={queryArgs.end}
                    trend={card.trend}
                    data={card.data}
                  />
                )}
              </Grid>
            )
          })}
        {/*                <Grid size={{xs: 12, sm: 6, lg: 3}}>
                    <HighlightedCard/>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                    <SessionsChart/>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                    <PageViewsBarChart/>
                </Grid>*/}
      </Grid>
      {/*<Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
        </Grid>*/}
    </Box>
  )
}

/*Stat | Freelancer
Total Earnings | Sum of all completed job payouts (where status = PAID or COMPLETED) +
Jobs Completed | Count of jobs where status = COMPLETED +
Job Success Rate (%) | (Completed Jobs / (Completed + Canceled Jobs)) * 100 +
Profile Views | Count of unique users who visited the freelancer's profile
Proposal Conversion Rate | (Number of proposals that turned into contracts / Total proposals sent) * 100
Active Contracts | Count of jobs/contracts with status = ACTIVE or IN_PROGRESS +
Pending Payments | Sum of earnings from milestones or hours logged but not yet paid +
Average Rating | AVG(review.rating) — average of all received review ratings +
New Messages | Count of unread messages from clients (or messages since last login)
New Invitations to Jobs | Count of job invites where status = PENDING or UNSEEN
Work Hours Tracked | Sum of tracked time (if using time-tracker), across all hourly contracts
Top Categories | Top N categories sorted by number of jobs completed in each category;*/