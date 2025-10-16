import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Modal,
  Fade,
  Backdrop,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ReturnBookPage() {
  const [search, setSearch] = useState('');
  const [loans, setLoans] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [returnedBook, setReturnedBook] = useState<any>(null);
  const [returnedBookIds, setReturnedBookIds] = useState<number[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
    useEffect(() => {
      if (!token) {
        toast.error('Session time Expired! Please Login Again to continue');
        navigate('/login');
      }
    }, [token, navigate]);

  // ✅ Fetch all active loans
  const fetchLoans = async () => {
    try {
      const res = await axios.get('/api/loans/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeLoans = res.data.results.filter((loan: any) => !loan.return_date);
      setLoans(activeLoans);
    } catch (err) {
      console.error('Error fetching loans:', err);
    }
  };

  useEffect(() => {
    fetchLoans();

    // ✅ Load last returned book from localStorage
    const storedReturned = localStorage.getItem('lastReturnedBook');
    if (storedReturned) {
      setReturnedBook(JSON.parse(storedReturned));
    }
  }, []);

  // ✅ Group loans by member
  const membersWithBooks = Object.values(
    loans.reduce((acc: any, loan: any) => {
      const member = loan.member_details;
      if (!acc[member.membership_id]) {
        acc[member.membership_id] = {
          id: member.membership_id,
          name: member.name,
          email: member.email,
          borrowedBooks: [],
        };
      }
      acc[member.membership_id].borrowedBooks.push({
        id: loan.loan_id,
        title: loan.book_details.title,
        author: loan.book_details.author_name,
        dueDate: loan.due_date,
        loanDate: loan.loan_date,
        isOverdue: loan.is_overdue,
      });
      return acc;
    }, {})
  );

  // ✅ Filter members by search
  const filteredMembers = membersWithBooks.filter((member: any) => {
    const nameMatch = member.name.toLowerCase().includes(search.toLowerCase());
    const bookMatch = member.borrowedBooks.some((book: any) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
    return nameMatch || bookMatch;
  });

  const handleSelectMember = (member: any) => {
    setSelectedMember(member);
    setSearch(member.name);
    setShowResults(false);
  };

  // ✅ Return book API call
  const handleReturnBook = async (book: any) => {
    try {
      const res = await axios.post(
        `/api/loans/${book.id}/return_book/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReturnedBook(res.data);
      setReturnedBookIds((prev) => [...prev, book.id]);
      localStorage.setItem('lastReturnedBook', JSON.stringify(res.data));

      setSnackbarMessage('Book returned successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Refresh loan list
      fetchLoans();
    } catch (err: any) {
      console.error('Error returning book:', err);
      const errorMsg = err.response?.data?.non_field_errors?.[0] || 'Error returning book';
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--background-default)', p: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            color: 'var(--text-primary)',
            fontWeight: 700,
            mb: 1,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Return Book
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--text-secondary)',
            mb: 4,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Search for a member and return their borrowed books
        </Typography>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>

            <Card
              sx={{
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'var(--background-paper)',
                border: '1px solid var(--divider)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Search Box */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <SearchIcon sx={{ color: 'var(--primary-color)', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      Search Member or Book
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Type member name or book title..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowResults(true);
                      setSelectedMember(null);
                    }}
                    onFocus={() => setShowResults(true)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'var(--text-secondary)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        minHeight: 56,
                        fontSize: '1rem',
                        borderRadius: 'var(--border-radius-md)',
                      },
                    }}
                  />
                  {showResults && search && filteredMembers.length > 0 && (
                    <Card
                      sx={{
                        mt: 1,
                        maxHeight: 300,
                        overflowY: 'auto',
                        borderRadius: 'var(--border-radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    >
                      {filteredMembers.map((member: any) => (
                        <Box
                          key={member.id}
                          sx={{
                            p: 2,
                            borderBottom: '1px solid var(--divider)',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                            '&:hover': { backgroundColor: 'var(--background-elevated)' },
                          }}
                          onClick={() => handleSelectMember(member)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ minWidth: 0, flex: 1, mr: 2 }}>
                              <Typography sx={{ fontWeight: 600, color: 'var(--text-primary)' }} noWrap>
                                {member.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }} noWrap>
                                {member.email}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${member.borrowedBooks.length} ${member.borrowedBooks.length === 1 ? 'book' : 'books'}`}
                              color="primary"
                              size="small"
                              sx={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Card>
                  )}
                </Box>

                {/* Member and Books */}
                {selectedMember && (
                  <>
                    <Card
                      sx={{
                        mb: 4,
                        backgroundColor: 'var(--background-elevated)',
                        border: '1px solid var(--divider)',
                        borderRadius: 'var(--border-radius-md)',
                      }}
                    >
                      <CardContent sx={{ py: 2, px: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'var(--primary-color)', fontWeight: 600, mb: 1 }}>
                              Selected Member
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {selectedMember.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                              {selectedMember.email}
                            </Typography>
                          </Box>
                          <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => {
                              setSelectedMember(null);
                              setSearch('');
                            }}
                            sx={{
                              color: 'var(--primary-color)',
                              borderColor: 'var(--primary-color)',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                borderColor: 'var(--primary-hover)',
                              },
                            }}
                            variant="outlined"
                          >
                            Clear
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 3 }}>
                        Borrowed Books
                      </Typography>

                      {selectedMember.borrowedBooks.map((book: any) => {
                        const daysOverdue = calculateDaysOverdue(book.dueDate);
                        const isReturned = returnedBookIds.includes(book.id);

                        return (
                          <Card
                            key={book.id}
                            sx={{
                              mb: 2,
                              border: '1px solid var(--divider)',
                              borderRadius: 'var(--border-radius-md)',
                              backgroundColor: book.isOverdue ? 'var(--error-bg)' : 'var(--background-paper)',
                              transition: 'var(--transition-fast)',
                              '&:hover': {
                                boxShadow: 'var(--shadow-md)',
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: 1, minWidth: 200 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 1 }}>
                                    {book.title}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                                    by {book.author}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                      Due: <strong style={{ color: 'var(--text-primary)' }}>{new Date(book.dueDate).toLocaleDateString()}</strong>
                                    </Typography>
                                    {book.isOverdue && (
                                      <Chip
                                        icon={<WarningIcon />}
                                        label={`${daysOverdue} days overdue`}
                                        size="small"
                                        sx={{
                                          backgroundColor: 'var(--error-color)',
                                          color: 'white',
                                          fontWeight: 600,
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                                <Button
                                  variant="contained"
                                  disabled={isReturned}
                                  onClick={() => handleReturnBook(book)}
                                  sx={{
                                    minWidth: 120,
                                    minHeight: 48,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    backgroundColor: isReturned ? 'var(--text-disabled)' : 'var(--success-color)',
                                    '&:hover': {
                                      backgroundColor: isReturned ? 'var(--text-disabled)' : 'var(--success-hover)',
                                    },
                                    '&:disabled': {
                                      backgroundColor: 'var(--text-disabled)',
                                      color: 'var(--background-paper)',
                                    },
                                  }}
                                >
                                  {isReturned ? 'Returned' : 'Return Book'}
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Last Returned Book Sidebar */}
          <Grid item xs={12} lg={4}>
            {returnedBook && (
              <Card
                sx={{
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: 'var(--success-color)',
                  color: 'white',
                  border: '1px solid var(--divider)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 1, fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Last Returned
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Member
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {returnedBook.member_details?.name}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Book
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {returnedBook.book_details?.title}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Return Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(returnedBook.return_date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {returnedBook.is_overdue && (
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                        Overdue
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {calculateDaysOverdue(returnedBook.due_date)} days
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
            icon={snackbarSeverity === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

