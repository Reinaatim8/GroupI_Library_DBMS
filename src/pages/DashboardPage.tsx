// src/DashboardPage.tsx
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleIcon from '@mui/icons-material/People';

const DashboardPage: React.FC = () => {
  // Static sample data
  const [stats] = useState({
    totalBooks: 1200,
    availableBooks: 950,
    activeLoans: 180,
    totalMembers: 340,
  });

  const dashboardCards = [
    { 
      title: 'Total Books', 
      value: stats.totalBooks,
      icon: MenuBookIcon,
      color: '#234B88',
      bgGradient: 'linear-gradient(135deg, #234B88 0%, #2d5fa8 100%)',
    },
    { 
      title: 'Available Books', 
      value: stats.availableBooks,
      icon: CheckCircleIcon,
      color: '#28a745',
      bgGradient: 'linear-gradient(135deg, #28a745 0%, #34c759 100%)',
    },
    { 
      title: 'Active Loans', 
      value: stats.activeLoans,
      icon: LocalLibraryIcon,
      color: '#ffc107',
      bgGradient: 'linear-gradient(135deg, #ffc107 0%, #ffcd38 100%)',
    },
    { 
      title: 'Total Members', 
      value: stats.totalMembers,
      icon: PeopleIcon,
      color: '#17a2b8',
      bgGradient: 'linear-gradient(135deg, #17a2b8 0%, #20c0dd 100%)',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: '#1a1a1a',
          fontWeight: 700,
          mb: 4,
        }}
      >
        Dashboard
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          width: '100%',
        }}
      >
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={index}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: card.bgGradient,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <IconComponent
                    sx={{
                      fontSize: '2.5rem',
                      color: card.color,
                      opacity: 0.8,
                    }}
                  />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                    mb: 1,
                    fontSize: '0.9rem',
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: card.color,
                    fontWeight: 700,
                    fontSize: '1.85rem',
                  }}
                >
                  {card.value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default DashboardPage;
