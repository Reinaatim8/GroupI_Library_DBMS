import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Logout,
} from '@mui/icons-material';

// ---- Tab component ----
interface TabProps {
  value: string;
  onClick: () => void;
  icon: React.ReactNode;
  isActive: boolean;
  to?: string; // Optional route
}

const Tab: React.FC<TabProps> = ({ value, onClick, icon, isActive, to }) => (
  <Button
    onClick={onClick}
    startIcon={icon}
    component={to ? Link : 'button'}
    to={to}
    sx={{
      justifyContent: 'flex-start',
      textTransform: 'none',
      px: 3,
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
      fontSize: '1rem',
    }}
  >
    {value}
  </Button>
);

// ---- Sidebar component ----
interface SideNavbarProps {
  sideNavActive: boolean;
  handleSideNavActive: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ sideNavActive, handleSideNavActive }) => {
  const [active, setActive] = useState<string>('dashboard');

  const handleActive = (value: string) => {
    setActive(value);
    if (window.innerWidth <= 1280) handleSideNavActive();
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // TODO: Add logout logic (e.g., clear token, redirect)
  };

  return (
    <Drawer
      variant="persistent"
      open={sideNavActive}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#E4EDFC',
          borderRight: '1px solid #ccc',
          p: 2,
        },
      }}
    >
      {/* Sidebar Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          py: 4,
        }}
      >
        {/* Logo or title */}
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontWeight: 600,
            color: '#1976d2',
          }}
        >
          My Dashboard
        </Typography>

        {/* Navigation Tabs */}
        <Tab
          value="Dashboard"
          onClick={() => handleActive('dashboard')}
          icon={<Dashboard />}
          isActive={active === 'dashboard'}
           to="/dashboard"
        />

        <Tab
          value="Issue Book"
          onClick={() => handleActive('issue-book')}
          icon={<Book />}
          isActive={active === 'issue-book'}
          to="/dashboard/issue-book"
        />

        <Tab
          value="Return Book"
          onClick={() => handleActive('return-book')}
          icon={<LibraryBooks />}
          isActive={active === 'return-book'}
          to="/dashboard/return-book"
        />

        <Tab
          value="Manage Books"
          onClick={() => handleActive('manage-books')}
          icon={<Book />}
          isActive={active === 'manage-books'}
          to="/dashboard/manage-book"
        />

        <Tab
          value="Manage Members"
          onClick={() => handleActive('manage-members')}
          icon={<People />}
          isActive={active === 'manage-members'}
          to="/dashboard/manage-member"
        />

        <Tab
          value="View Loans"
          onClick={() => handleActive('view-loans')}
          icon={<Description />}
          isActive={active === 'view-loans'}
          to="/dashboard/view-loan"
        />

        {/* Spacer + Logout */}
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            color: '#FF3B3B',
            justifyContent: 'flex-start',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              color: '#E63535',
              backgroundColor: 'grey.100',
            },
          }}
        >
          Log Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default SideNavbar;