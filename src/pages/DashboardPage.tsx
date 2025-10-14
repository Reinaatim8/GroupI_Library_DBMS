// src/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  Label
} from 'recharts';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableCopies: 0,
    activeLoans: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Session time Expired! Please Login Again to continue');
      navigate('/login');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAllBooks = async () => {
      const baseUrl = 'https://Roy256.pythonanywhere.com/api/books/';
      let allResults: any[] = [];
      try {
        let res = await axios.get(baseUrl, config);
        allResults = allResults.concat(res.data.results || []);
        let next = res.data.next;
        while (next) {
          res = await axios.get(next, config);
          allResults = allResults.concat(res.data.results || []);
          next = res.data.next;
        }
        return { count: res.data.count ?? allResults.length, results: allResults };
      } catch (err) { throw err; }
    };

    const fetchAllStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [booksData, loansRes, membersRes] = await Promise.all([
          fetchAllBooks(),
          axios.get('https://Roy256.pythonanywhere.com/api/loans/', config),
          axios.get('https://Roy256.pythonanywhere.com/api/members/', config),
        ]);

        const totalBooks = booksData.count ?? booksData.results.length;
        const availableCopies = (booksData.results || []).reduce((sum, b: any) => {
          const copies = Number(b.copies_available ?? b.copies ?? 0);
          const isAvailable = (typeof b.is_available !== 'undefined') ? Boolean(b.is_available) : copies > 0;
          return sum + (isAvailable ? copies : 0);
        }, 0);

        const activeLoans = loansRes.data.count ?? (loansRes.data.results?.length ?? 0);
        const totalMembers = membersRes.data.count ?? (membersRes.data.results?.length ?? 0);

        setStats({ totalBooks, availableCopies, activeLoans, totalMembers });
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err.response?.data ?? err.message ?? err);
        setError('Failed to load dashboard stats');
      } finally { setLoading(false); }
    };

    fetchAllStats();
  }, [navigate]);

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
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Typography variant="body2" color="text.secondary">
          Check console for details and ensure your token and endpoints are correct.
        </Typography>
      </Box>
    );
  }

  const dashboardCards = [
    { title: 'Total Book Titles', value: stats.totalBooks, icon: MenuBookIcon, color: '#234B88', bgGradient: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)' },
    { title: 'Total Available Copies', value: stats.availableCopies, icon: CheckCircleIcon, color: '#28a745', bgGradient: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)' },
    { title: 'Total Active Loans', value: stats.activeLoans, icon: LocalLibraryIcon, color: '#ffc107', bgGradient: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)' },
    { title: 'Total Members', value: stats.totalMembers, icon: PeopleIcon, color: '#17a2b8', bgGradient: 'linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%)' },
  ];

  const pieData = [
    { name: 'Available Copies', value: stats.availableCopies },
    { name: 'Active Loans', value: stats.activeLoans },
    
  ];

  const barData = [
    { name: 'Total Book-Copies', value: stats.availableCopies },
    { name: 'Total Members', value: stats.totalMembers },
    { name: 'Active Book Loans', value: stats.activeLoans },
    { name: 'Total Book Titles', value: stats.totalBooks },
  ];

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1a1a1a', fontWeight: 700, mb: 3 ,textDecoration: 'underline' }}>
        LIBRARY STATISTICS - BOOKS AND MEMBERS
      </Typography>

      {/* Dashboard Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
          width: '80%',
          mx: 'auto',
          maxWidth: 750,
        }}
      >
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={index}
              sx={{
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 4,
                boxShadow: '12px 8px 12px 8px rgba(0.08,0.08,0.08,0.08)',
                position: 'relative',
                overflow: 'hidden',
                ":hover": { boxShadow: '16px 12px 16px 12px rgba(0.12,0.12,0.12,0.12)' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '35%',
                  height: '35%',
                  background: card.bgGradient,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <IconComponent sx={{ fontSize: '1.8rem', color: card.color, opacity: 0.9 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 500, mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ color: card.color, fontWeight: 700 }}>
                  {Number(card.value).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Charts Section */}
      <Box sx={{ mt: 6, width: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Pie Chart */}
        <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' ,textDecoration: 'underline' }}>
            AVAILABLE COPIES VS. ACTIVE BOOK LOANS PIE-CHART COMPARISON
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label> 
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#28a745' : '#ffc107'} />
                ))}
              </Pie>
              <Label
              value="Available Copies vs Book Loans"  // your word
              position="outside"
              fill="#1a1a1a"
              fontSize={14}
              fontWeight="bold"
            />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' , textDecoration: 'underline' }}>
            STATISTICAL LIBRARY BAR-GRAPH OVERVIEW
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#234B88" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;





