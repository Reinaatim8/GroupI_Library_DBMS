// src/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, styled, keyframes } from '@mui/material';
import { MenuBook, CheckCircle, LocalLibrary, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const StatCard = styled(Box)(({ theme }) => ({
  background: '#fff',
  borderRadius: 16,
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeIn} 0.6s ease-out`,
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-4px)',
  },
}));

const IconWrapper = styled(Box)(({ color }: { color: string }) => ({
  width: 56,
  height: 56,
  borderRadius: 14,
  background: `${color}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${pulse} 3s ease-in-out infinite`,
  '& svg': {
    fontSize: 28,
    color: color,
  },
}));

const ChartCard = styled(Box)({
  background: '#fff',
  borderRadius: 20,
  padding: '32px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  animation: `${fadeIn} 0.8s ease-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
  },
});

interface Stats {
  totalBooks: number;
  availableCopies: number;
  activeLoans: number;
  totalMembers: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    availableCopies: 0,
    activeLoans: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const baseUrl = 'https://Roy256.pythonanywhere.com/api';

    const fetchData = async () => {
      try {
        const [booksRes, loansRes, membersRes] = await Promise.all([
          axios.get(`${baseUrl}/books/`, config),
          axios.get(`${baseUrl}/loans/`, config),
          axios.get(`${baseUrl}/members/`, config),
        ]);

        const books = booksRes.data.results || [];
        const availableCopies = books.reduce((sum: number, b: any) => 
          sum + Number(b.copies_available ?? b.copies ?? 0), 0
        );

        setStats({
          totalBooks: booksRes.data.count ?? books.length,
          availableCopies,
          activeLoans: loansRes.data.count ?? loansRes.data.results?.length ?? 0,
          totalMembers: membersRes.data.count ?? membersRes.data.results?.length ?? 0,
        });
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress sx={{ color: '#2563eb' }} />
      </Box>
    );
  }

  const cards = [
    { title: 'Book Titles', value: stats.totalBooks, icon: MenuBook, color: '#2563eb' },
    { title: 'Available Copies', value: stats.availableCopies, icon: CheckCircle, color: '#10b981' },
    { title: 'Active Loans', value: stats.activeLoans, icon: LocalLibrary, color: '#f59e0b' },
    { title: 'Members', value: stats.totalMembers, icon: People, color: '#8b5cf6' },
  ];

  const pieData = [
    { name: 'Available', value: stats.availableCopies, color: '#10b981' },
    { name: 'On Loan', value: stats.activeLoans, color: '#f59e0b' },
  ];

  const barData = [
    { name: 'Titles', value: stats.totalBooks },
    { name: 'Copies', value: stats.availableCopies },
    { name: 'Loans', value: stats.activeLoans },
    { name: 'Members', value: stats.totalMembers },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto', background: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 5, animation: `${fadeIn} 0.5s ease-out` }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#111', mb: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
          Library Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', fontSize: '0.95rem' }}>
          Overview of your library statistics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 5 
      }}>
        {cards.map((card, i) => (
          <StatCard key={i} sx={{ animationDelay: `${i * 0.1}s` }}>
            <IconWrapper color={card.color}>
              <card.icon />
            </IconWrapper>
            <Box>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem', mb: 0.5 }}>
                {card.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111' }}>
                {card.value.toLocaleString()}
              </Typography>
            </Box>
          </StatCard>
        ))}
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 4 }}>
        <ChartCard sx={{ animationDelay: '0.4s' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mb: 3 }}>
            Inventory Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard sx={{ animationDelay: '0.5s' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mb: 3 }}>
            Statistics Overview
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#999" style={{ fontSize: '0.85rem' }} />
              <YAxis stroke="#999" style={{ fontSize: '0.85rem' }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 8, 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }} 
              />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Box>
  );
};

export default DashboardPage;