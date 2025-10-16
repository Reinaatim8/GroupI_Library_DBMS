import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Autocomplete,
  Alert,
  Grid,
  Snackbar,
} from '@mui/material';
import {
  PersonOutline,
  MenuBook,
  CalendarToday,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Member {
  id: number;
  name: string;
  email: string;
  membership_id: string;
}

interface Book {
  book_id: number;
  title: string;
  author_name?: string;
  copies_available: number;
  total_copies: number;
}

interface LoanResponse {
  loan_id: number;
  book_details: Book;
  member_details: Member;
  loan_date: string;
  due_date: string;
}

const API_BASE_URL = '/api';

export default function IssueBookPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [lastIssued, setLastIssued] = useState<LoanResponse | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
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
  console.log("🔐 Token:", token);
   
  useEffect(() => {
    fetchMembers();
    fetchBooks();

    // ✅ Load last issued book from localStorage
  const storedLastIssued = localStorage.getItem('lastIssuedBook');
  if (storedLastIssued) {
    setLastIssued(JSON.parse(storedLastIssued));}
  }, []);

  // ✅ Fetch Members
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/members/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔹 Members API Response:", res.data);

      // Handles both paginated and direct lists
      const memberData = res.data.results || res.data || [];
      setMembers(memberData);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to fetch members.');
    }
  };

  // ✅ Fetch Books
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/books/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔹 Books API Response:", res.data);

      // Use paginated results
      const bookData = res.data.results || [];
      setBooks(bookData);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books.');
    }
  };

  // ✅ Issue Book
  const handleIssueBook = async () => {
    if (!selectedMember || !selectedBook) {
      setError('Please select both a member and a book.');
      setSnackbarMessage('Please select both a member and a book.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setError('');
    setMessage('');

    try {
      const res = await axios.post(
        `${API_BASE_URL}/loans/borrow/`,
        {
          book_id: selectedBook.book_id,
          membership_id: selectedMember.membership_id,
          loan_period_days: 14,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLastIssued(res.data);
      setMessage('Book successfully issued!');
      setSnackbarMessage('Book issued successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Save to localStorage
      localStorage.setItem('lastIssuedBook', JSON.stringify(res.data));
      // Clear selections
      setSelectedMember(null);
      setSelectedBook(null);
    } catch (err: any) {
      console.error('Error issuing book:', err);
      const errorMsg = err.response?.data?.detail || 'An error occurred while issuing the book.';
      setError(errorMsg);
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--background-default)', p: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
          Issue Book
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--text-secondary)',
            mb: 4,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Select a member and book to create a new loan
        </Typography>

        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'var(--background-paper)',
                border: '1px solid var(--divider)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Error/Success Messages */}
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }} icon={<ErrorIcon />}>
                    {error}
                  </Alert>
                )}
                {message && (
                  <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircleIcon />}>
                    {message}
                  </Alert>
                )}

                {/* Member Selection */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonOutline sx={{ mr: 1.5, color: 'var(--primary-color)', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      Select Member
                    </Typography>
                  </Box>

                  <Autocomplete
                    options={members}
                    getOptionLabel={(option) => `${option.name} (${option.membership_id})`}
                    value={selectedMember}
                    onChange={(event, newValue) => setSelectedMember(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search member by name or ID"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            minHeight: 56,
                            fontSize: '1rem',
                          },
                        }}
                      />
                    )}
                    sx={{ mb: 2 }}
                  />

                  {selectedMember && (
                    <Card
                      sx={{
                        bgcolor: 'var(--background-elevated)',
                        border: '1px solid var(--divider)',
                        borderRadius: 'var(--border-radius-md)',
                      }}
                    >
                      <CardContent sx={{ py: 2, px: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'var(--primary-color)', fontWeight: 600, mb: 1 }}>
                          Selected Member
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {selectedMember.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                          ID: {selectedMember.membership_id} • {selectedMember.email}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Book Selection */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MenuBook sx={{ mr: 1.5, color: 'var(--primary-color)', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      Select Book
                    </Typography>
                  </Box>

                  <Autocomplete
                    options={books}
                    getOptionLabel={(option) => `${option.title} by ${option.author_name || 'Unknown'}`}
                    value={selectedBook}
                    onChange={(event, newValue) => setSelectedBook(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search book by title or author"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            minHeight: 56,
                            fontSize: '1rem',
                          },
                        }}
                      />
                    )}
                    sx={{ mb: 2 }}
                  />

                  {selectedBook && (
                    <Card
                      sx={{
                        bgcolor: 'var(--background-elevated)',
                        border: '1px solid var(--divider)',
                        borderRadius: 'var(--border-radius-md)',
                      }}
                    >
                      <CardContent sx={{ py: 2, px: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'var(--secondary-color)', fontWeight: 600, mb: 1 }}>
                          Selected Book
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {selectedBook.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                          by {selectedBook.author_name || 'Unknown'}
                        </Typography>
                        <Chip
                          label={`${selectedBook.copies_available} copies available`}
                          size="small"
                          color={selectedBook.copies_available > 0 ? 'success' : 'error'}
                          sx={{ fontWeight: 600 }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </Box>

                {/* Issue Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleIssueBook}
                  disabled={!selectedMember || !selectedBook}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--primary-color)',
                    minHeight: 56,
                    borderRadius: 'var(--border-radius-md)',
                    '&:hover': {
                      backgroundColor: 'var(--primary-hover)',
                      transform: 'translateY(-1px)',
                      boxShadow: 'var(--shadow-lg)',
                    },
                    '&:disabled': {
                      backgroundColor: 'var(--text-disabled)',
                      color: 'var(--background-paper)',
                    },
                  }}
                >
                  Issue Book
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Last Issued Book Sidebar */}
          <Grid item xs={12} md={4}>
            {lastIssued && (
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
                      Last Issued
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Member
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {lastIssued.member_details.name}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Book
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {lastIssued.book_details.title}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Loan Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(lastIssued.loan_date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Due Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {new Date(lastIssued.due_date).toLocaleDateString()}
                    </Typography>
                  </Box>
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




