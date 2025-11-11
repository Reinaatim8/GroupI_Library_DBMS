// src/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, styled, keyframes, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { MenuBook, CheckCircle, LocalLibrary, People, Warning, SupervisorAccount, Person } from '@mui/icons-material';
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
  overdueLoans: number;
  totalLibrarians: number;
  totalAuthors: number;
}

interface RecentLoan {
  id: number;
  book_title: string;
  member_name: string;
  borrow_date: string;
  due_date: string;
  status: string;
}

interface TopBook {
  id: number;
  title: string;
  author: string;
  borrow_count: number;
}

interface RecentMember {
  id: number;
  name: string;
  email: string;
  join_date: string;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    availableCopies: 0,
    activeLoans: 0,
    totalMembers: 0,
    overdueLoans: 0,
    totalLibrarians: 0,
    totalAuthors: 0,
  });
  const [recentLoans, setRecentLoans] = useState<RecentLoan[]>([]);
  const [topBooks, setTopBooks] = useState<TopBook[]>([]);
  const [recentMembers, setRecentMembers] = useState<RecentMember[]>([]);
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
        const [booksRes, loansRes, membersRes, overdueRes, librariansRes, authorsRes, recentLoansRes, topBooksRes, recentMembersRes] = await Promise.all([
          axios.get(`${baseUrl}/books/`, config),
          axios.get(`${baseUrl}/loans/`, config),
          axios.get(`${baseUrl}/members/`, config),
          axios.get(`${baseUrl}/loans/overdue/`, config).catch(() => ({ data: { results: [] } })),
          axios.get(`${baseUrl}/librarians/`, config).catch(() => ({ data: { results: [] } })),
          axios.get(`${baseUrl}/authors/`, config).catch(() => ({ data: { results: [] } })),
          axios.get(`${baseUrl}/loans/?limit=5`, config).catch(() => ({ data: { results: [] } })),
          axios.get(`${baseUrl}/books/?ordering=-borrow_count&limit=5`, config).catch(() => ({ data: { results: [] } })),
          axios.get(`${baseUrl}/members/?ordering=-join_date&limit=5`, config).catch(() => ({ data: { results: [] } })),
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
          overdueLoans: overdueRes.data.count ?? overdueRes.data.results?.length ?? 0,
          totalLibrarians: librariansRes.data.count ?? librariansRes.data.results?.length ?? 0,
          totalAuthors: authorsRes.data.count ?? authorsRes.data.results?.length ?? 0,
        });

        setRecentLoans(recentLoansRes.data.results?.slice(0, 5) || []);
        setTopBooks(topBooksRes.data.results?.slice(0, 5) || []);
        setRecentMembers(recentMembersRes.data.results?.slice(0, 5) || []);
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
    // { title: 'Overdue Loans', value: stats.overdueLoans, icon: Warning, color: stats.overdueLoans > 0 ? '#ef4444' : '#6b7280' },
    { title: 'Librarians', value: stats.totalLibrarians, icon: SupervisorAccount, color: '#06b6d4' },
    { title: 'Authors', value: stats.totalAuthors, icon: Person, color: '#84cc16' },
  ];

  const pieData = [
    { name: 'Available', value: stats.availableCopies, color: '#10b981' },
    { name: 'Active Loans', value: stats.activeLoans, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdueLoans, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Titles', value: stats.totalBooks },
    { name: 'Copies', value: stats.availableCopies },
    { name: 'Loans', value: stats.activeLoans },
    { name: 'Members', value: stats.totalMembers },
    { name: 'Overdue', value: stats.overdueLoans },
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
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(7, 1fr)' },
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 4, mb: 5 }}>
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
      <ChartCard>
  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>SHORT REPORT PREVIEW</Typography>

  <Typography variant="subtitle2" sx={{ mb: 1 }}>Library Stats</Typography>
  <Typography sx={{ fontWeight: 600, mb: 3 }}>Total Books: {stats.totalBooks} Books</Typography>
  <Typography sx={{ fontWeight: 600, mb: 3 }}>Available Copies: {stats.availableCopies} Books</Typography>
  <Typography sx={{ fontWeight: 600, mb: 3 }}>Active Loans: {stats.activeLoans} Books</Typography>
  {/* <Typography>Overdue Loans: {stats.overdueLoans}</Typography> */}

  {/* <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Recent Loans</Typography> */}
 </ChartCard>


      Tables Section
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
        {/* Recent Loans */}
        <ChartCard sx={{ animationDelay: '0.6s' }}>
          {/* <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mb: 3 }}>
            Recent Loans
          </Typography> */}
          <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
            <Table size="small">
              {/* <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Book</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Member</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Status</TableCell>
                </TableRow>
              </TableHead> */}
              <TableBody>
                {recentLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>{loan.book_title}</TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>{loan.member_name}</TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                      <Chip
                        label={loan.status}
                        size="small"
                        sx={{
                          backgroundColor: loan.status === 'overdue' ? '#fee2e2' : '#dbeafe',
                          color: loan.status === 'overdue' ? '#dc2626' : '#2563eb',
                          fontSize: '0.7rem'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ChartCard>

        {/* Top Borrowed Books */}
        <ChartCard sx={{ animationDelay: '0.7s' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mb: 3 }}>
            Top Borrowed Books
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Borrows</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>{book.title}</TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>{book.author}</TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 1, fontWeight: 600 }}>{book.borrow_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ChartCard>

        {/* Recent Members */}
        <ChartCard sx={{ animationDelay: '0.8s' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mb: 3 }}>
            Recent Members
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
            <Table size="small">
              {/* <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666', borderBottom: 'none' }}>Joined</TableCell>
                </TableRow>
              </TableHead> */}
              <TableBody>
                {recentMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>{member.name}</TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>{member.email}</TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 1 }}>{new Date(member.join_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ChartCard>
      </Box>
    </Box>
  );
};

export default DashboardPage;