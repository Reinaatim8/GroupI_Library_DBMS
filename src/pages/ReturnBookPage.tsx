import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';
import { Search, ArrowBack } from '@mui/icons-material';
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
      const res = await axios.get('https://Roy256.pythonanywhere.com/api/loans/', {
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
        `https://Roy256.pythonanywhere.com/api/loans/${book.id}/return_book/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReturnedBook(res.data);
      setReturnedBookIds((prev) => [...prev, book.id]);
      localStorage.setItem('lastReturnedBook', JSON.stringify(res.data));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Refresh loan list
      fetchLoans();
    } catch (err: any) {
      console.error('Error returning book:', err);
      alert(err.response?.data?.non_field_errors?.[0] || 'Error returning book');
    }
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        backgroundColor: '#f5f5f5',
        minWidth: '100%',
        mx: 25,
      }}
    >
      <Box sx={{ width: 900, mx: 'auto', px: 4 ,marginLeft:10}}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        RETURN A BOOK
      </Typography>

      {/* ✅ Success Popup */}
      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 300 }}
      >
        <Fade in={showSuccess}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 3,
              p: 4,
              width: 400,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom color="success.main">
              ✅ Book Returned Successfully!
            </Typography>
            <Typography variant="body1">
              "{returnedBook?.book_details?.title}" was returned by{' '}
              <strong>{returnedBook?.member_details?.name}</strong>
            </Typography>
            {returnedBook?.is_overdue && (
              <Typography variant="body2" color="warning.main" mt={2}>
                ⚠ This book was {calculateDaysOverdue(returnedBook?.due_date)} days overdue.
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>

      <Card sx={{ p: 4, borderRadius: 3, backgroundColor: '#fff' }}>
        {/* Search Box */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Search color="primary" />
            <Typography variant="h6">Search Member or Book</Typography>
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
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          {showResults && search && filteredMembers.length > 0 && (
            <Card sx={{ mt: 1, maxHeight: 300, overflowY: 'auto' }}>
              {filteredMembers.map((member: any) => (
                <Box
                  key={member.id}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f0f7ff' },
                  }}
                  onClick={() => handleSelectMember(member)}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box sx={{ minWidth: 0, flex: 1, mr: 2 }}>
                      <Typography fontWeight={600} noWrap>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {member.email}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${member.borrowedBooks.length} ${
                        member.borrowedBooks.length === 1 ? 'book' : 'books'
                      }`}
                      color="primary"
                      size="small"
                      sx={{ flexShrink: 0 }}
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
            <Card sx={{ p: 3, mb: 4, backgroundColor: '#e3f2fd' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Selected Member
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedMember.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMember.email}
                  </Typography>
                </Box>
                <Button
                  startIcon={<ArrowBack />}
                  color="primary"
                  onClick={() => {
                    setSelectedMember(null);
                    setSearch('');
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Card>

            {selectedMember.borrowedBooks.map((book: any) => {
              const daysOverdue = calculateDaysOverdue(book.dueDate);
              const isReturned = returnedBookIds.includes(book.id);

              return (
                <Card
                  key={book.id}
                  sx={{
                    p: 3,
                    mb: 2,
                    border: 1,
                    borderColor: book.isOverdue ? 'error.light' : 'grey.200',
                    backgroundColor: book.isOverdue ? '#fdecea' : 'white',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {book.author}
                      </Typography>
                      <Typography variant="body2">
                        Due: <strong>{book.dueDate}</strong>
                      </Typography>
                      {book.isOverdue && (
                        <Typography variant="body2" color="error" mt={1}>
                          ⚠ Overdue by {daysOverdue} days
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={isReturned}
                      onClick={() => handleReturnBook(book)}
                    >
                      {isReturned ? 'Returned' : 'Return'}
                    </Button>
                  </Box>
                </Card>
              );
            })}
          </>
        )}
      </Card>

      {/* ✅ Last Returned Book Section */}
      {returnedBook && (
        <Card
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            backgroundColor: '#e8f5e9',
          }}
        >
          <Typography variant="h6" color="success.main">
            📘 Last Book Returned
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {returnedBook.book_details?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            by {returnedBook.member_details?.name} on {returnedBook.return_date}
          </Typography>
        </Card>
      )}
    </Box>
    </Box>
  );
}

