import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Book as BookIcon,
  LibraryBooks as LibraryBooksIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  LibraryAdd as LibraryAddIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

// ---- Navigation Item component ----
interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  to: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, to, isActive, onClick }) => (
  <ListItem disablePadding>
    <ListItemButton
      component={Link}
      to={to}
      onClick={onClick}
      selected={isActive}
      sx={{
        borderRadius: 'var(--border-radius-md)',
        mx: 1,
        mb: 0.5,
        '&.Mui-selected': {
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--primary-hover)',
          },
          '& .MuiListItemIcon-root': {
            color: 'white',
          },
        },
        '&:hover': {
          backgroundColor: isActive ? 'var(--primary-hover)' : 'rgba(25, 118, 210, 0.04)',
        },
        minHeight: 48,
        px: 2.5,
      }}
    >
      <ListItemIcon
        sx={{
          color: isActive ? 'white' : 'var(--text-secondary)',
          minWidth: 40,
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: '0.875rem',
          fontWeight: isActive ? 600 : 500,
        }}
      />
    </ListItemButton>
  </ListItem>
);

// ---- Sidebar component ----
interface SideNavbarProps {
  sideNavActive: boolean;
  handleSideNavActive: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ sideNavActive, handleSideNavActive }) => {
  const location = useLocation();
  const [active, setActive] = useState<string>(location.pathname);

  const handleActive = (value: string) => {
    setActive(value);
    if (window.innerWidth <= 1280) handleSideNavActive();
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('token');
    window.location.href = '/login';
    toast.success('Logged out successfully');
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      to: '/dashboard',
      key: 'dashboard',
    },
    {
      label: 'Issue Books',
      icon: <LibraryAddIcon />,
      to: '/dashboard/issue-book',
      key: 'issue-book',
    },
    {
      label: 'Return Books',
      icon: <LibraryBooksIcon />,
      to: '/dashboard/return-book',
      key: 'return-book',
    },
    {
      label: 'Manage Books',
      icon: <BookIcon />,
      to: '/dashboard/manage-book',
      key: 'manage-books',
    },
    {
      label: 'Manage Members',
      icon: <PersonAddIcon />,
      to: '/dashboard/manage-member',
      key: 'manage-members',
    },
    {
      label: 'View Loans',
      icon: <AssignmentIcon />,
      to: '/dashboard/view-loan',
      key: 'view-loans',
    },
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
          backgroundColor: 'var(--background-paper)',
          borderRight: '1px solid var(--divider)',
          boxShadow: 'var(--shadow-sm)',
        },
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid var(--divider)',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'var(--primary-color)',
            mr: 2,
            width: 40,
            height: 40,
          }}
        >
          <BookIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Library
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Management System
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ overflow: 'auto', flexGrow: 1, p: 1 }}>
        <List>
          {navigationItems.map((item) => (
            <NavItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              to={item.to}
              isActive={active === item.to}
              onClick={() => handleActive(item.to)}
            />
          ))}
        </List>
      </Box>

      <Divider />

      {/* Logout Section */}
      <Box sx={{ p: 2 }}>
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          fullWidth
          variant="outlined"
          color="error"
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            borderRadius: 'var(--border-radius-md)',
            py: 1.5,
            '&:hover': {
              backgroundColor: 'var(--error-color)',
              color: 'white',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default SideNavbar;