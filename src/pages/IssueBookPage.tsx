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
} from '@mui/material';
import { PersonOutline, MenuBook, CalendarToday } from '@mui/icons-material';
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

const API_BASE_URL = 'https://Roy256.pythonanywhere.com/api';

export default function IssueBookPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [lastIssued, setLastIssued] = useState<LoanResponse | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
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

      // Save to localStorage
      localStorage.setItem('lastIssuedBook', JSON.stringify(res.data));
      //  Clear selections
      setSelectedMember(null);
      setSelectedBook(null);
    } catch (err: any) {
      console.error('Error issuing book:', err);
      if (err.response?.data) setError(JSON.stringify(err.response.data));
      else setError('An error occurred while issuing the book.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ width: 900, mx: 'auto', px: 4 ,marginLeft:25}}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          ISSUE A BOOK FOR A MEMBER / BOOK LOANING
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          {/* 👤 Member Selection */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonOutline sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Select Member</Typography>
            </Box>

            <Autocomplete
              options={members}
              getOptionLabel={(option) => `${option.name} (${option.membership_id})`}
              value={selectedMember}
              onChange={(event, newValue) => setSelectedMember(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Search member by name" fullWidth />
              )}
            />

            {selectedMember && (
              <Card sx={{ mt: 2, bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="primary">Selected Member</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedMember.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {selectedMember.membership_id} • {selectedMember.email}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 📚 Book Selection */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MenuBook sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Select Book</Typography>
            </Box>

            <Autocomplete
              options={books}
              getOptionLabel={(option) => `${option.title} by ${option.author_name || 'Unknown'}`}
              value={selectedBook}
              onChange={(event, newValue) => setSelectedBook(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Search book by title" fullWidth />
              )}
            />

            {selectedBook && (
              <Card sx={{ mt: 2, bgcolor: '#f3e5f5' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="secondary">Selected Book</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedBook.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {selectedBook.author_name || 'Unknown'}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`${selectedBook.copies_available} copies available`}
                      size="small"
                      color={selectedBook.copies_available > 0 ? 'success' : 'error'}
                    />
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* 🚀 Issue Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleIssueBook}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              },
            }}
          >
            Issue Book
          </Button>
        </Paper>

        {/* 📅 Last Issued Book */}
        {lastIssued && (
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" color="success.dark">Last Issued Book</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Member</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {lastIssued.member_details.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Book</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {lastIssued.book_details.title}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Loan Date</Typography>
                <Typography variant="body1">{lastIssued.loan_date}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Due Date</Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'error.main', fontWeight: 600 }}
                >
                  {lastIssued.due_date}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}




