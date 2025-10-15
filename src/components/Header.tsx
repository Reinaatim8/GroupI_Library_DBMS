import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuthStore } from './AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#1976d2',
        boxShadow: 2,
        height: '90px',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '90px',
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Library Management System
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Welcome, {user?.name || 'User'}!
          </Typography>
          <Typography
            variant="button"
            onClick={logout}
            sx={{
              cursor: 'pointer',
              color: 'white',
              textTransform: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Logout
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
