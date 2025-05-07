import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {SparkLineChart} from '@mui/x-charts/SparkLineChart';
import {areaElementClasses} from '@mui/x-charts/LineChart';
import dayjs from "dayjs";
import {parseOffsetDateTime} from "../../../utils/dateParser.ts";

export type StatType =
    | 'DAILY_TOTAL_EARNINGS'
    | 'ORDERS_COMPLETED'
    | 'ORDER_SUCCESS_RATE'
    | 'ACTIVE_ORDERS'
    | 'PENDING_PAYMENTS'
    | 'TOTAL_SERVICES_PURCHASED'

export type StatCardProps = {
    type: StatType;
    title: string;
    value: number;
    interval: string;
    percentGrow?: number;
    trend?: 'up' | 'down' | 'neutral';
    startDate?: string;
    endDate?: string;
    data?: number[];
};

function getDaysBetween(start?: Date | string, end?: Date | string): string[] {
    if (!start || !end) {
        return [];
    }
    const startDate = dayjs(start).startOf('day');
    const endDate = dayjs(end).startOf('day');

    const days: string[] = [];
    let current = startDate;

    while (current.isSame(endDate) || current.isBefore(endDate)) {
        days.push(parseOffsetDateTime(current.format('YYYY-MM-DD')));
        current = current.add(1, 'day');
    }

    return days;
}

function getModifiedValue(value: number, statType: StatType): string {
    switch (statType) {
        case 'DAILY_TOTAL_EARNINGS':
            return `€${value}`;
        case 'ORDER_SUCCESS_RATE':
            return `${value}%`;
        default:
            return value.toString();
    }
}

function getValueFormater(statType: StatType): (value: number | null) => string {
    switch (statType) {
        case 'DAILY_TOTAL_EARNINGS':
            return (value) => `€${value}`
        default:
            return (value) => `${value}`
    }
}

function AreaGradient({color, id}: { color: string; id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
        </defs>
    );
}

function getLabelColor(trend?: 'up' | 'down' | 'neutral') {
    switch (trend) {
        case 'up':
            return 'success';
        case 'down':
            return 'error';
        case 'neutral':
            return 'default'
        default:
            return 'default';
    }
}

const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    const theme = useTheme();

    switch (trend) {
        case 'up':
            return theme.palette.mode === 'light'
                ? theme.palette.success.main
                : theme.palette.success.dark;
        case 'down':
            return theme.palette.mode === 'light'
                ? theme.palette.error.main
                : theme.palette.error.dark;
        case 'neutral':
            return theme.palette.mode === 'light'
                ? theme.palette.grey[400]
                : theme.palette.grey[700];
        default:
            return theme.palette.mode === 'light'
                ? theme.palette.grey[600] // For undefined or any other invalid state, a neutral color
                : theme.palette.grey[500];
    }
};


export default function StatCard({
                                     type,
                                     title,
                                     value,
                                     interval,
                                     percentGrow,
                                     trend,
                                     startDate,
                                     endDate,
                                     data,
                                 }: StatCardProps) {

    return (
        <Card variant="outlined" sx={{height: '100%', flexGrow: 1}}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    {title}
                </Typography>
                <Stack
                    direction="column"
                    sx={{justifyContent: 'space-between', flexGrow: '1', gap: 1}}
                >
                    <Stack sx={{justifyContent: 'space-between'}}>
                        <Stack
                            direction="row"
                            sx={{justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography variant="h4" component="p">
                                {getModifiedValue(value, type)}
                            </Typography>
                            {trend &&
                                <Chip size="small" color={getLabelColor(trend)} label={`${percentGrow}%`}/>
                            }
                        </Stack>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>
                            {interval}
                        </Typography>
                    </Stack>
                    {data && data.length > 0  &&
                        <Box sx={{width: '100%', height: 50}}>
                            <SparkLineChart
                                colors={[getTrendColor(trend)]}
                                data={data}
                                valueFormatter={getValueFormater(type)}
                                area
                                showHighlight
                                showTooltip
                                xAxis={{
                                    scaleType: 'band',
                                    data: getDaysBetween(startDate, endDate),
                                }}
                                sx={{
                                    [`& .${areaElementClasses.root}`]: {
                                        fill: `url(#area-gradient-${value})`,
                                    },
                                }}
                            >
                                <AreaGradient color={getTrendColor(trend)} id={`area-gradient-${value}`}/>
                            </SparkLineChart>
                        </Box>
                    }
                </Stack>
            </CardContent>
        </Card>
    );
}
