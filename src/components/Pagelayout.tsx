import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Card } from '@mui/material';
import Header from '../components/Header';
import SideNavbar from '../components/SideNavbar';

const Layout: React.FC = () => {
  const [sideNavActive, setSideNavActive] = useState(true);

  const handleSideNavActive = () => {
    setSideNavActive(!sideNavActive);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '90vh', backgroundColor: '#f5f5f5',minWidth:'40vh' }}>
      <SideNavbar
        sideNavActive={sideNavActive}
        handleSideNavActive={handleSideNavActive}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'center' }}>
        <Header onMenuClick={handleSideNavActive} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'center',
            backgroundColor: '#ffffff',
            minHeight: '90vh',
            overflow: 'hidden',
            marginTop: '30px',
            width:'50vh'
          }}
        >
          <Card
            elevation={2}
            sx={{
              flexGrow: 1,
              mt: 11,
              width: '100%',
              borderRadius: 2,
              p: 3,
              display: 'flex',
              flexDirection: 'center',
              overflow: 'auto',
              backgroundColor: '#F8F9FC',
              
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