import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Card } from '@mui/material';
import Header from './Header';
import SideNavbar from './SideNavbar';

const Layout: React.FC = () => {
  const [sideNavActive, setSideNavActive] = useState(true);

  const handleSideNavActive = () => {
    setSideNavActive(!sideNavActive);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <SideNavbar
        sideNavActive={sideNavActive}
        handleSideNavActive={handleSideNavActive}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuClick={handleSideNavActive} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: '#ffffff',
            minHeight: 'calc(100vh - 90px)',
            overflow: 'auto',
          }}
        >
          <Card
            elevation={2}
            sx={{
              width: '100%',
              borderRadius: 2,
              p: 3,
              backgroundColor: '#F8F9FC',
              minHeight: 'calc(100vh - 150px)',
            }}
          >
            <Outlet />
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
