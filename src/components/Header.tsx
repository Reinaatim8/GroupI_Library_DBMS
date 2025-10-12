import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Button,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Define props interface for Header (if any props are needed later)
interface HeaderProps {
  onMenuClick?: () => void; // Optional prop for menu toggle
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <AppBar
      //position="fixed"
      sx={{
        backgroundColor: '#e0e0e0', // Light gray background matching the image
        boxShadow: 'none', // Remove default shadow for a flat look
        borderBottom: '1px solid #ccc', // Subtle border for definition
        height: '90px',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '64px', // Standard AppBar height
          px: 2, // Padding on sides
        }}
      >
        {/* Left Section: Dashboard */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 1, color: '#6B46C1' }} // Purple color for icon
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: '#6B46C1', // Purple color for text
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* Center Section: Welcome */}
        <Typography
          variant="h5"
          noWrap
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%,)',
            color: 'black', 
            fontWeight: 700,
            textAlign: 'center',
            
          }}
        >
          LIBRARY MANAGEMENT SYSTEM, WELCOME BACK!
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;