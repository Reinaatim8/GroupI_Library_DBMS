import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Box,
  Card,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import { Search, AlertTriangle, BookOpen, Calendar, Filter } from 'lucide-react';

// ✅ Import Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Loan {
  loan_id: number;
  book_details: {
    title: string;
    author_name: string;
  };
  member_details: {
    membership_id: number;
    name: string;
    email: string;
  };
  librarian_details: {
    name: string;
  };
  loan_date: string;
  due_date: string;
  is_overdue: boolean;
  days_overdue: number;
}

export default function ViewLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [search, setSearch] = useState('');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');
  useEffect(() => {
    if (!token) {
      toast.error('Session Expired! Please login again.');
      navigate('/login');
    }
  }, [token, navigate]);

  const role = localStorage.getItem('role');
  const memberId = localStorage.getItem('membership_id');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get('https://Roy256.pythonanywhere.com/api/loans/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        let fetchedLoans = response.data.results;

        if (role === 'member' && memberId) {
          fetchedLoans = fetchedLoans.filter(
            (loan: Loan) => loan.member_details.membership_id === Number(memberId)
          );
        }

        setLoans(fetchedLoans);
      } catch (error: any) {
        console.error('Error fetching loans:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [token, role, memberId]);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.member_details.name.toLowerCase().includes(search.toLowerCase()) ||
      loan.book_details.title.toLowerCase().includes(search.toLowerCase()) ||
      loan.book_details.author_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterOverdue || loan.is_overdue;
    return matchesSearch && matchesFilter;
  });

  const overdueCount = loans.filter((loan) => loan.is_overdue).length;
  const onTimeCount = loans.filter((loan) => !loan.is_overdue).length;

  const chartData = [
    { name: 'On Time', value: onTimeCount },
    { name: 'Overdue', value: overdueCount },
  ];

  const COLORS = ['#16a34a', '#dc2626'];

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Typography>Loading loans...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4} bgcolor="grey.50" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {role === 'member' ? 'MY BOOK LOANS' : 'ALL LIBRARY BOOK LOANS / BORROWED BOOKS'}
      </Typography>

      {/* === Statistics === */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        <Card sx={{ p: 3, flex: 1, minWidth: 350 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <BookOpen color="#1976d2" size={35} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                TOTAL LIBRARY BOOK LOANS
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {loans.length} BOOKS
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 3, flex: 1, minWidth: 350 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Calendar color="#16a34a" size={35} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                RETURNED IN-TIME / STILL ACTIVE
              </Typography>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {onTimeCount} BOOKS
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 3, flex: 1, minWidth: 350 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <AlertTriangle color="#dc2626" size={35} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                OVERDUE / PAST RETURN DATE
              </Typography>
              <Typography variant="h5" color="error.main" fontWeight="bold">
                {overdueCount} BOOKS
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* === Charts Section === */}
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4} mb={4}>
        <Card sx={{ p: 3, flex: 1, minWidth: 350, maxWidth: 500 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Loan Status Distribution (Bar Chart)
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card sx={{ p: 3, flex: 1, minWidth: 350, maxWidth: 500 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Loan Status Ratio (Pie Chart)
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* === Search & Filter === */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
          <TextField
            placeholder="Search by member or book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
            }}
          />
          <Button
            variant={filterOverdue ? 'contained' : 'outlined'}
            color={filterOverdue ? 'error' : 'inherit'}
            startIcon={<Filter />}
            onClick={() => setFilterOverdue(!filterOverdue)}
          >
            {filterOverdue ? 'Show All' : 'Overdue Only'}
          </Button>
        </Box>
      </Card>

      {/* === Table === */}
      <Card>
        <TableContainer sx={{ maxHeight: 600, minWidth: 650 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight="bold" color="black">LOAN ID</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="black">MEMBER</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="black">BOOK TITLE</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="black">AUTHOR</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="black">LOAN DATE</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="black">DUE DATE</Typography></TableCell>
                <TableCell><Typography fontWeight="bold" color="black">BOOK-LOAN STATUS</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>No loans found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>{loan.loan_id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">{loan.member_details.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {loan.member_details.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{loan.book_details.title}</TableCell>
                    <TableCell>{loan.book_details.author_name}</TableCell>
                    <TableCell>{loan.loan_date}</TableCell>
                    <TableCell>{loan.due_date}</TableCell>
                    <TableCell>
                      {loan.is_overdue ? (
                        <Chip
                          icon={<AlertTriangle size={14} />}
                          label={`Overdue (${loan.days_overdue} days)`}
                          color="error"
                          size="small"
                        />
                      ) : (
                        <Chip label="On Time" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
