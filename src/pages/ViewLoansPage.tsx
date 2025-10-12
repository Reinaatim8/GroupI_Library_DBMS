import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  // Assume you store token and role in localStorage after login
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role'); // 'librarian' or 'member'
  const memberId = localStorage.getItem('membership_id'); // if applicable

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get('https://Roy256.pythonanywhere.com/api/loans/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let fetchedLoans = response.data.results;

        // If user is a member → filter only their loans
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
        {role === 'member' ? 'My Book Loans' : 'All Book Loans'}
      </Typography>

      {/* Statistics */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        <Card sx={{ p: 3, flex: 1, minWidth: 250 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <BookOpen color="#1976d2" size={28} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Total Loans
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {loans.length}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 3, flex: 1, minWidth: 250 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Calendar color="#16a34a" size={28} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                On Time
              </Typography>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {onTimeCount}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 3, flex: 1, minWidth: 250 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <AlertTriangle color="#dc2626" size={28} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Overdue
              </Typography>
              <Typography variant="h5" color="error.main" fontWeight="bold">
                {overdueCount}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Search & Filter */}
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

      {/* Table */}
      <Card>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Book Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Loan Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No loans found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>
                      <Typography fontWeight="bold">
                        {loan.member_details.name}
                      </Typography>
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

