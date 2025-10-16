import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

// Define props interface for Header
interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = 'Library Management System' }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'var(--background-paper)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-sm)',
        borderBottom: '1px solid var(--divider)',
        height: '64px',
      }}
      elevation={0}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '64px',
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Left Section: Menu and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open navigation menu"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              color: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '1.25rem',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Center Section: Welcome Message */}
        <Typography
          variant="body1"
          sx={{
            color: 'var(--text-secondary)',
            fontWeight: 500,
            textAlign: 'center',
            flexGrow: 1,
            display: { xs: 'none', md: 'block' },
          }}
        >
          Welcome back to your Library Management System
        </Typography>

        {/* Right Section: Notifications and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="notifications"
            sx={{
              mr: 1,
              color: 'var(--text-secondary)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              color: 'var(--text-secondary)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'var(--primary-color)',
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 20 }} />
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          id="primary-search-account-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;