import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Drawer,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Book,
  LibraryBooks,
  People,
  Description,
  Logout,
} from '@mui/icons-material';

// ---- Tab Component ----
interface TabProps {
  value: string;
  onClick: () => void;
  icon: React.ReactNode;
  isActive: boolean;
  to?: string;
}

const Tab: React.FC<TabProps> = ({ value, onClick, icon, isActive, to }) => {
  const theme = useTheme();
  return (
    <Button
      component={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      startIcon={icon}
      sx={{
        justifyContent: 'flex-start',
        textTransform: 'none',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        width: '100%',
        color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
        backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
        },
        mb: 1.5,
        fontWeight: 500,
        fontSize: '0.95rem',
      }}
    >
      {value}
    </Button>
  );
};

// ---- Sidebar Component ----
interface SideNavbarProps {
  sideNavActive: boolean;
  handleSideNavActive: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ sideNavActive, handleSideNavActive }) => {
  const [active, setActive] = useState<string>('dashboard');
  const theme = useTheme();

  const handleActive = (value: string) => {
    setActive(value);
    if (window.innerWidth <= 1280) handleSideNavActive();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    toast.success('Logged out successfully');
  };

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
          backgroundColor: theme.palette.background.paper,
          borderRight: 'none',
          p: 2,
          transition: 'all 0.3s ease',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          py: 3,
        }}
      >
        {/* Logo/Title */}
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: theme.palette.primary.main,
            letterSpacing: '-0.025em',
          }}
        >
          LIBRARY DASH
        </Typography>

        {/* Navigation Tabs */}
        <Box sx={{ flexGrow: 1 }}>
          <Tab
            value="Overview"
            onClick={() => handleActive('dashboard')}
            icon={<Dashboard />}
            isActive={active === 'dashboard'}
            to="/dashboard"
          />
          <Tab
            value="Issue Books"
            onClick={() => handleActive('issue-book')}
            icon={<Book />}
            isActive={active === 'issue-book'}
            to="/dashboard/issue-book"
          />
          <Tab
            value="Return Books"
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
        </Box>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            color: theme.palette.error.contrastText,
            backgroundColor: theme.palette.error.main,
            fontWeight: 600,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
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
