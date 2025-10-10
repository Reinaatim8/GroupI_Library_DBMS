import React, { useState } from 'react';
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

const allLoans = [
  {
    id: 1,
    memberId: 'MEM001',
    memberName: 'John Smith',
    memberEmail: 'john@example.com',
    bookTitle: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    loanDate: '2024-09-15',
    dueDate: '2024-09-29',
    isOverdue: true,
  },
  {
    id: 2,
    memberId: 'MEM001',
    memberName: 'John Smith',
    memberEmail: 'john@example.com',
    bookTitle: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    loanDate: '2024-09-25',
    dueDate: '2024-10-09',
    isOverdue: false,
  },
  // ...other loans
];

export default function ViewLoansPage() {
  const [search, setSearch] = useState('');
  const [filterOverdue, setFilterOverdue] = useState(false);

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredLoans = allLoans.filter((loan) => {
    const matchesSearch =
      loan.memberName.toLowerCase().includes(search.toLowerCase()) ||
      loan.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      loan.author.toLowerCase().includes(search.toLowerCase()) ||
      loan.memberId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterOverdue || loan.isOverdue;
    return matchesSearch && matchesFilter;
  });

  const overdueCount = allLoans.filter((loan) => loan.isOverdue).length;
  const onTimeCount = allLoans.filter((loan) => !loan.isOverdue).length;

  return (
    <Box p={4} bgcolor="grey.50" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        View Active Loans
      </Typography>

      {/* Statistics Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 250 }}>
          <Box p={2} bgcolor="primary.light" borderRadius="8px">
            <BookOpen color="#1976d2" size={28} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Active Loans
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {allLoans.length}
            </Typography>
          </Box>
        </Card>

        <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 250 }}>
          <Box p={2} bgcolor="success.light" borderRadius="8px">
            <Calendar color="#16a34a" size={28} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              On Time
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {onTimeCount}
            </Typography>
          </Box>
        </Card>

        <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 250 }}>
          <Box p={2} bgcolor="error.light" borderRadius="8px">
            <AlertTriangle color="#dc2626" size={28} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Overdue
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="error.main">
              {overdueCount}
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
          <TextField
            placeholder="Search by member name or book title..."
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
        {(search || filterOverdue) && (
          <Box mt={2} display="flex" flexWrap="wrap" gap={1} fontSize="0.875rem">
            <Typography color="text.secondary">
              Showing {filteredLoans.length} of {allLoans.length} loans
            </Typography>
            {filterOverdue && <Chip label="Overdue Filter Active" color="error" size="small" />}
            {search && <Chip label={`Search: "${search}"`} color="primary" size="small" />}
          </Box>
        )}
      </Card>

      {/* Loans Table */}
      <Card>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>Member Name</TableCell>
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
                  <TableCell colSpan={7} align="center">
                    <Box py={4} textAlign="center">
                      <BookOpen color="#cbd5e1" size={48} />
                      <Typography>No loans found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => {
                  const daysOverdue = calculateDaysOverdue(loan.dueDate);
                  return (
                    <TableRow
                      key={loan.id}
                      sx={{ bgcolor: loan.isOverdue ? 'error.lighter' : 'inherit' }}
                    >
                      <TableCell>{loan.memberId}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography fontWeight="bold">{loan.memberName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {loan.memberEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{loan.bookTitle}</TableCell>
                      <TableCell>{loan.author}</TableCell>
                      <TableCell>{loan.loanDate}</TableCell>
                      <TableCell>
                        <Typography color={loan.isOverdue ? 'error.main' : 'text.primary'}>
                          {loan.dueDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {loan.isOverdue ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              icon={<AlertTriangle size={14} />}
                              label="OVERDUE"
                              color="error"
                              size="small"
                            />
                            <Typography color="error" fontSize="0.75rem">
                              {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                            </Typography>
                          </Box>
                        ) : (
                          <Chip label="On Time" color="success" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Summary Footer */}
      {filteredLoans.length > 0 && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <Typography>
              Displaying <strong>{filteredLoans.length}</strong> loans
            </Typography>
            <Box display="flex" gap={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor="success.main" borderRadius="50%" />
                <Typography>On Time: {filteredLoans.filter((l) => !l.isOverdue).length}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor="error.main" borderRadius="50%" />
                <Typography>Overdue: {filteredLoans.filter((l) => l.isOverdue).length}</Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
}
