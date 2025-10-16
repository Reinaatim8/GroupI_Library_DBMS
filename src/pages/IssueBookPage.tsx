import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Card, Chip, Autocomplete, Alert, styled, keyframes
} from '@mui/material';
import { PersonOutline, MenuBook, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const StyledCard = styled(Card)({
  background: '#fff',
  borderRadius: 16,
  padding: 32,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  animation: `${fadeIn} 0.6s ease-out`,
  transition: 'all 0.3s ease',
  '&:hover': { boxShadow: '0 8px 28px rgba(0,0,0,0.1)' },
});

const SelectionCard = styled(Box)({
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  borderRadius: 12,
  padding: 20,
  marginTop: 16,
  animation: `${slideIn} 0.4s ease-out`,
  border: '2px solid #e2e8f0',
});

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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
      try {
        const [membersRes, booksRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/members/`, config),
          axios.get(`${API_BASE_URL}/books/`, config),
        ]);

        setMembers(membersRes.data.results || membersRes.data || []);
        setBooks(booksRes.data.results || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleIssueBook = async () => {
    if (!selectedMember || !selectedBook) {
      setError('Please select both member and book.');
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLastIssued(res.data);
      setMessage('Book successfully issued!');
      setSelectedMember(null);
      setSelectedBook(null);
      toast.success('Book issued successfully!');
    } catch (err: any) {
      console.error('Error issuing book:', err);
      setError(err.response?.data?.message || 'Failed to issue book');
      toast.error('Failed to issue book');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto', background: '#fafafa', minHeight: '100vh' }}>
      <Box sx={{ mb: 5, animation: `${fadeIn} 0.5s ease-out` }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#111', mb: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
          Issue Book
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Assign books to library members
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{message}</Alert>}

      <StyledCard sx={{ mb: 3 }}>
        {/* Member Selection */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <PersonOutline sx={{ color: '#2563eb' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Select Member</Typography>
          </Box>

          <Autocomplete
            options={members}
            getOptionLabel={(option) => `${option.name} (${option.membership_id})`}
            value={selectedMember}
            onChange={(_, newValue) => setSelectedMember(newValue)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search by name or ID" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            )}
          />

          {selectedMember && (
            <SelectionCard>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                Selected Member
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mt: 0.5 }}>
                {selectedMember.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {selectedMember.email} • ID: {selectedMember.membership_id}
              </Typography>
            </SelectionCard>
          )}
        </Box>

        {/* Book Selection */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <MenuBook sx={{ color: '#2563eb' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Select Book</Typography>
          </Box>

          <Autocomplete
            options={books}
            getOptionLabel={(option) => `${option.title} by ${option.author_name || 'Unknown'}`}
            value={selectedBook}
            onChange={(_, newValue) => setSelectedBook(newValue)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search by title or author" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            )}
          />

          {selectedBook && (
            <SelectionCard>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                Selected Book
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mt: 0.5 }}>
                {selectedBook.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, mb: 1 }}>
                by {selectedBook.author_name || 'Unknown'}
              </Typography>
              <Chip
                label={`${selectedBook.copies_available} copies available`}
                size="small"
                sx={{
                  background: selectedBook.copies_available > 0 ? '#dcfce7' : '#fee2e2',
                  color: selectedBook.copies_available > 0 ? '#166534' : '#991b1b',
                  fontWeight: 600,
                }}
              />
            </SelectionCard>
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleIssueBook}
          disabled={!selectedMember || !selectedBook}
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: '#2563eb',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { background: '#1d4ed8' },
            '&:disabled': { background: '#e2e8f0' },
          }}
        >
          Issue Book
        </Button>
      </StyledCard>

      {lastIssued && (
        <StyledCard sx={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', animationDelay: '0.2s' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckCircle sx={{ color: '#059669' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#065f46' }}>
              Last Issued Book
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Member</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{lastIssued.member_details.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Book</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{lastIssued.book_details.title}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Loan Date</Typography>
              <Typography variant="body1">{lastIssued.loan_date}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Due Date</Typography>
              <Typography variant="body1" sx={{ color: '#dc2626', fontWeight: 600 }}>{lastIssued.due_date}</Typography>
            </Box>
          </Box>
        </StyledCard>
      )}
    </Box>
  );
}