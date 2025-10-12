// src/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleIcon from '@mui/icons-material/People';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,        // number of distinct titles
    availableCopies: 0,   // sum of copies_available for available books
    activeLoans: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // make sure this key matches your login storage
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Helper: Fetch all pages of the books endpoint and return a flat array of results
    const fetchAllBooks = async () => {
      const baseUrl = 'https://Roy256.pythonanywhere.com/api/books/';
      let allResults: any[] = [];
      try {
        // first request
        let res = await axios.get(baseUrl, config);
        allResults = allResults.concat(res.data.results || []);
        // if paginated, follow `next` links until null
        let next = res.data.next;
        while (next) {
          res = await axios.get(next, config);
          allResults = allResults.concat(res.data.results || []);
          next = res.data.next;
        }
        return { count: res.data.count ?? allResults.length, results: allResults };
      } catch (err) {
        throw err;
      }
    };

    const fetchAllStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch books (all pages), loans and members in parallel (loans/members are counted directly)
        const [booksData, loansRes, membersRes] = await Promise.all([
          fetchAllBooks(),
          axios.get('https://Roy256.pythonanywhere.com/api/loans/', config),
          axios.get('https://Roy256.pythonanywhere.com/api/members/', config),
        ]);

        // total distinct titles (booksData.count or length of results)
        const totalBooks = booksData.count ?? booksData.results.length;

        // availableCopies: sum copies_available for books where is_available === true
        const availableCopies = (booksData.results || []).reduce((sum, b: any) => {
          // Defensive checks in case fields are named slightly differently
          const copies = Number(b.copies_available ?? b.copies ?? 0);
          const isAvailable = (typeof b.is_available !== 'undefined') ? Boolean(b.is_available) : copies > 0;
          return sum + (isAvailable ? copies : 0);
        }, 0);

        // loans and members counts (Django paginate responses have .data.count)
        const activeLoans = loansRes.data.count ?? (loansRes.data.results?.length ?? 0);
        const totalMembers = membersRes.data.count ?? (membersRes.data.results?.length ?? 0);

        setStats({
          totalBooks,
          availableCopies,
          activeLoans,
          totalMembers,
        });
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err.response?.data ?? err.message ?? err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check console for details and ensure your token and endpoints are correct.
        </Typography>
      </Box>
    );
  }

  const dashboardCards = [
    {
      title: 'Total Book Titles',
      value: stats.totalBooks,
      icon: MenuBookIcon,
      color: '#234B88',
      bgGradient: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
    },
    {
      title: 'Total Available Copies of All Books',
      value: stats.availableCopies,
      icon: CheckCircleIcon,
      color: '#28a745',
      bgGradient: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
    },
    {
      title: 'Total Active Loans',
      value: stats.activeLoans,
      icon: LocalLibraryIcon,
      color: '#ffc107',
      bgGradient: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: PeopleIcon,
      color: '#17a2b8',
      bgGradient: 'linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%)',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'center', width: '100%', p: 3,  }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1a1a1a', fontWeight: 700, mb: 4 }}>
        
      </Typography>
      
    
      {/* 2 columns on md and up -> will produce 2 cards per row (2x2). 1 column on xs */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
          },
          gap: 3,
          width: '70%',
          height: '100%',
          mx: 'auto',
          maxWidth: 800,
        }}
      >
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={index}
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 5,
                boxShadow: '18px 10px 18px 10px rgba(0.08,0.08,0.08,0.08)',
                position: 'relative',
                overflow: 'hidden',
                ":hover": { boxShadow: '20px 20px 20px 20px rgba(0.12,0.12,0.12,0.12)' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '40%',
                  height: '40%',
                  background: card.bgGradient,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <IconComponent sx={{ fontSize: '2.25rem', color: card.color, opacity: 0.9 }} />
                </Box>

                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 500, mb: 1 }}>
                  {card.title}
                </Typography>

                <Typography variant="h4" sx={{ color: card.color, fontWeight: 700 }}>
                  {Number(card.value).toLocaleString()}
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


