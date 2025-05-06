import * as React from 'react';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, {breadcrumbsClasses} from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import {useTranslation} from 'react-i18next';
import {useLocation} from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({theme}) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

export default function NavbarBreadcrumbs() {
    const { t } = useTranslation();
    const location = useLocation();

    const pathnames = location.pathname
        .split('/')
        .filter((x) => x && x !== 'dashboard');

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            <Typography variant="body1">{t('dashboard.title')}</Typography>
            {pathnames.map((value, index) => {
                const isLast = index === pathnames.length - 1;
                const label = t(`dashboard.menu.${value}.title`, value);

                return (
                    <Typography
                        key={index}
                        variant="body1"
                        sx={{ color: 'text.primary', fontWeight: 600 }}
                    >
                        {label}
                    </Typography>
                );
            })}
        </StyledBreadcrumbs>
    );
}
