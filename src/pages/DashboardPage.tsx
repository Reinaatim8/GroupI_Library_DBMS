import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  CheckCircle as CheckCircleIcon,
  LocalLibrary as LocalLibraryIcon,
  People as PeopleIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Book as BookIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
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
      const baseUrl = '/api/books/';
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
          axios.get('/api/loans/', config),
          axios.get('/api/members/', config),
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
    {
      title: 'Total Book Titles',
      value: stats.totalBooks,
      icon: MenuBookIcon,
      color: 'var(--primary-color)',
      bgColor: 'var(--background-paper)',
      trend: '+12%',
      trendColor: 'var(--success-color)',
    },
    {
      title: 'Available Copies',
      value: stats.availableCopies,
      icon: CheckCircleIcon,
      color: 'var(--success-color)',
      bgColor: 'var(--background-paper)',
      trend: `${((stats.availableCopies / stats.totalBooks) * 100).toFixed(1)}%`,
      trendColor: 'var(--info-color)',
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans,
      icon: LocalLibraryIcon,
      color: 'var(--warning-color)',
      bgColor: 'var(--background-paper)',
      trend: `${stats.activeLoans} active`,
      trendColor: 'var(--warning-color)',
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: PeopleIcon,
      color: 'var(--info-color)',
      bgColor: 'var(--background-paper)',
      trend: '+5%',
      trendColor: 'var(--success-color)',
    },
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
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: 'var(--text-primary)',
            fontWeight: 700,
            mb: 2,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Library Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--text-secondary)',
            mb: 3,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Overview of your library's key statistics and quick actions
        </Typography>

        {/* Quick Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<BookIcon />}
            onClick={() => navigate('/dashboard/issue-book')}
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:hover': { backgroundColor: 'var(--primary-hover)' },
              minHeight: 48,
            }}
          >
            Issue Book
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/dashboard/manage-member')}
            sx={{
              borderColor: 'var(--primary-color)',
              color: 'var(--primary-color)',
              '&:hover': {
                borderColor: 'var(--primary-hover)',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
              minHeight: 48,
            }}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: card.bgColor,
                  border: '1px solid var(--divider)',
                  transition: 'var(--transition-normal)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-lg)',
                  },
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 2, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: card.color,
                        mr: 1.5,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--text-secondary)',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {Number(card.value).toLocaleString()}
                  </Typography>
                  <Chip
                    label={card.trend}
                    size="small"
                    sx={{
                      backgroundColor: card.trendColor,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--background-paper)',
              border: '1px solid var(--divider)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                textAlign: 'center',
                color: 'var(--text-primary)',
              }}
            >
              Book Availability Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? 'var(--success-color)' : 'var(--warning-color)'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString(), 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--background-paper)',
              border: '1px solid var(--divider)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                textAlign: 'center',
                color: 'var(--text-primary)',
              }}
            >
              Library Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString(), 'Count']}
                />
                <Bar
                  dataKey="value"
                  fill="var(--primary-color)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;





