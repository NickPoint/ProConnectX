import * as React from 'react';
import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import Notification from "../Notification.tsx";

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
{/*        <Search />
        <CustomDatePicker />*/}
      <Notification />
        {/*<ArrowDropDown />*/}
      </Stack>
    </Stack>
  );
}
