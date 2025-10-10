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
            transform: 'translateX(-50%)',
            color: '#6B46C1', // Purple color
            fontFamily: "'Dancing Script', cursive", // Stylized font (add this font via Google Fonts)
            fontWeight: 700,
            textAlign: 'center',
            fontSize: '1.5rem',
          }}
        >
          Welcome
        </Typography>

        {/* Right Section: Admin, View Members, Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            sx={{
              color: '#6B46C1', // Purple color
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(107, 70, 193, 0.1)' }, // Subtle hover effect
            }}
          >
            Admin
          </Button>
          <Button
            color="inherit"
            sx={{
              color: '#6B46C1', // Purple color
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(107, 70, 193, 0.1)' }, // Subtle hover effect
            }}
          >
            View Members
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 4,
              padding: '2px 8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <InputBase
              placeholder="Search..."
              sx={{ ml: 1, flex: 1, color: '#6B46C1' }}
            />
            <IconButton
              type="button"
              sx={{ p: '10px', color: '#6B46C1' }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;