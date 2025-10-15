import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Book,
  LibraryBooks,
  People,
  Description,
} from '@mui/icons-material';

// Tab component
interface TabProps {
  value: string;
  icon: React.ReactNode;
  to: string;
  isActive: boolean;
}

const Tab: React.FC<TabProps> = ({ value, icon, to, isActive }) => (
  <Button
    component={Link}
    to={to}
    startIcon={icon}
    sx={{
      justifyContent: 'flex-start',
      textTransform: 'none',
      px: 2,
      py: 1.5,
      borderRadius: 2,
      width: '100%',
      color: isActive ? '#fff' : '#333',
      backgroundColor: isActive ? '#1976d2' : 'transparent',
      '&:hover': {
        backgroundColor: isActive ? '#1565c0' : '#E4EDFC',
      },
      mb: 1,
      fontWeight: 500,
      fontSize: '0.9rem',
    }}
  >
    {value}
  </Button>
);

// Sidebar component
interface SideNavbarProps {
  sideNavActive: boolean;
  handleSideNavActive: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ sideNavActive, handleSideNavActive }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Issue Book', icon: <Book />, path: '/dashboard/issue-book' },
    { label: 'Return Book', icon: <LibraryBooks />, path: '/dashboard/return-book' },
    { label: 'Manage Books', icon: <Book />, path: '/dashboard/manage-book' },
    { label: 'Manage Members', icon: <People />, path: '/dashboard/manage-member' },
    { label: 'View Loans', icon: <Description />, path: '/dashboard/view-loan' },
  ];

  return (
    <Drawer
      variant="persistent"
      open={sideNavActive}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #ddd',
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          py: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center',
          }}
        >
          Library Dashboard
        </Typography>

        {menuItems.map((item) => (
          <Tab
            key={item.path}
            value={item.label}
            icon={item.icon}
            to={item.path}
            isActive={location.pathname === item.path}
          />
        ))}
      </Box>
    </Drawer>
  );
};

export default SideNavbar;
