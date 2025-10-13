import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// import sidebar from '../components/sidebar.css';
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
  style?: React.CSSProperties; // Optional style
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
      mb: 5,
      fontWeight: 600,
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
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
    toast.success('Logged out successfully');
  };

  return (
    <Drawer
      variant="persistent"
      open={sideNavActive}
      sx={{
        width: 450,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 450,
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
          width: '80%',
          py: 4,
        }}
      >
        {/* Logo or title */}
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            textAlign: 'column',
            fontWeight: 'bold',
            color: '#1976d2',
          }}
        >
          MY LIBRARY DASHBOARD!
        </Typography>

        {/* Navigation Tabs */}
        
        <Tab
          value="LIBRARY STATISTICS OVERVIEW"
          onClick={() => handleActive('dashboard')}
          icon={<Dashboard sx={{ iconSize: 40}} />}
          isActive={active === 'dashboard'}
           to="/dashboard"
        />

        <Tab
          value="ISSUE BOOKS / BORROW BOOKS"
          onClick={() => handleActive('issue-book')}
          icon={<Book  sx={{ fontSize: 40}}/>}
          isActive={active === 'issue-book'}
          to="/dashboard/issue-book"
          style={{ fontSize: '5.1rem', fontWeight: 600 , color: '#1976d2'}}
        />

        <Tab
          value="RETURN LOANED / BORROWED BOOKS"
          onClick={() => handleActive('return-book')}
          icon={<LibraryBooks sx={{ fontSize: 40}}/>}
          isActive={active === 'return-book'}
          to="/dashboard/return-book"
        />

        <Tab
          value="MANAGE BOOK RECORDS"
          onClick={() => handleActive('manage-books')}
          icon={<Book sx={{ fontSize: 40}}/>}
          isActive={active === 'manage-books'}
          to="/dashboard/manage-book"
        />

        <Tab
          value="MANAGE MEMBERS"
          onClick={() => handleActive('manage-members')}
          icon={<People sx={{ fontSize: 40}} />}
          isActive={active === 'manage-members'}
          to="/dashboard/manage-member"
        />

        <Tab
          value="VIEW LIBRARY BOOK LOANS"
          onClick={() => handleActive('view-loans')}
          icon={<Description sx={{ fontSize: 40}}/>}
          isActive={active === 'view-loans'}
          to="/dashboard/view-loan"
        />

        {/* Spacer + Logout */}
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            color: 'white',
            justifyContent: 'flex-start',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            backgroundColor:'red',
            fontSize: '1rem',
            fontWeight: 900,
            borderRadius: 4,
            '&:hover': {
              color: 'red',
              backgroundColor: '#ffe6e6',
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