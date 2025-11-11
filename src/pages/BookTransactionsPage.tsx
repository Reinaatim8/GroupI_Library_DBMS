import React, { useState, useEffect } from 'react';
import {
  Box, Card, Typography, TextField, InputAdornment, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Modal, Fade, Backdrop, Tabs, Tab, Autocomplete, Alert,
  keyframes, Checkbox
} from '@mui/material';
import {
  Search, PersonOutline, MenuBook, CheckCircle, ArrowBack,
  LibraryBooks, TrendingUp, Warning, CheckBox
} from '@mui/icons-material';
import Grid from '@mui/material/Grid';
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
  return_date?: string;
  is_overdue?: boolean;
}

interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  dueDate: string;
  loanDate: string;
  isOverdue: boolean;
}

interface MemberWithBooks {
  id: string;
  name: string;
  email: string;
  borrowedBooks: BorrowedBook[];
}

const API_BASE_URL = 'https://Roy256.pythonanywhere.com/api';

export default function BookTransactionsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [lastIssued, setLastIssued] = useState<LoanResponse | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [selectedMemberReturn, setSelectedMemberReturn] = useState<MemberWithBooks | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [returnedBook, setReturnedBook] = useState<LoanResponse | null>(null);
  const [returnedBookIds, setReturnedBookIds] = useState<number[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<LoanResponse[]>([]);
  const [stats, setStats] = useState({ activeLoans: 0, overdueBooks: 0 });
  const [bulkReturn, setBulkReturn] = useState<number[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
      try {
        const [membersRes, booksRes, loansRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/members/`, config),
          axios.get(`${API_BASE_URL}/books/`, config),
          axios.get(`${API_BASE_URL}/loans/`, config),
        ]);

        setMembers(membersRes.data.results || membersRes.data || []);
        setBooks(booksRes.data.results || []);
        const allLoans = loansRes.data.results || [];
        setLoans(allLoans);

        // Calculate stats
        const activeLoans = allLoans.filter((loan: LoanResponse) => !loan.return_date);
        const overdueBooks = activeLoans.filter((loan: LoanResponse) => loan.is_overdue);
        setStats({ activeLoans: activeLoans.length, overdueBooks: overdueBooks.length });

        // Recent transactions (last 5 issued or returned)
        const sortedTransactions = allLoans
          .sort((a: LoanResponse, b: LoanResponse) => new Date(b.loan_date).getTime() - new Date(a.loan_date).getTime())
          .slice(0, 5);
        setRecentTransactions(sortedTransactions);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      }
    };

    fetchData();
    const storedIssued = localStorage.getItem('lastIssued');
    if (storedIssued) {
      setLastIssued(JSON.parse(storedIssued))
    };

    // Load last returned book from localStorage
    const storedReturned = localStorage.getItem('lastReturnedBook');
    if (storedReturned) {
      setReturnedBook(JSON.parse(storedReturned));
    }
  }, [token, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
      localStorage.setItem('LastIssued', JSON.stringify(res.data));
      setMessage('Book successfully issued!');
      setShowSuccessModal(true); // ✅ Show success modal
      setSelectedMember(null);
      setSelectedBook(null);
     

      // Refresh data
      const loansRes = await axios.get(`${API_BASE_URL}/loans/`, { headers: { Authorization: `Bearer ${token}` } });
      const allLoans = loansRes.data.results || [];
      setLoans(allLoans);
      const activeLoans = allLoans.filter((loan: LoanResponse) => !loan.return_date);
      const overdueBooks = activeLoans.filter((loan: LoanResponse) => loan.is_overdue);
      setStats({ activeLoans: activeLoans.length, overdueBooks: overdueBooks.length });
      setRecentTransactions(allLoans.sort((a: LoanResponse, b: LoanResponse) => new Date(b.loan_date).getTime() - new Date(a.loan_date).getTime()).slice(0, 5));
    } catch (err: any) {
      console.error('Error issuing book:', err);
    
      // Extract backend error message
      let msg = 'Failed to issue book';
      if (err.response?.data) {
        const data = err.response.data;
        // Take first error message from any field
        const firstKey = Object.keys(data)[0];
        msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : String(data[firstKey]);
      }
    
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
    
  };

  // Group loans by member for return tab
  const membersWithBooks: MemberWithBooks[] = Object.values(
    loans.filter((loan) => !loan.return_date).reduce((acc: any, loan: LoanResponse) => {
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
        author: loan.book_details.author_name || 'Unknown',
        dueDate: loan.due_date,
        loanDate: loan.loan_date,
        isOverdue: loan.is_overdue || false,
      });
      return acc;
    }, {})
  );

  // Filter members by search
  const filteredMembers = membersWithBooks.filter((member: MemberWithBooks) => {
    const nameMatch = member.name.toLowerCase().includes(search.toLowerCase());
    const bookMatch = member.borrowedBooks.some((book: BorrowedBook) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
    return nameMatch || bookMatch;
  });

  const handleSelectMember = (member: MemberWithBooks) => {
    setSelectedMemberReturn(member);
    setSearch(member.name);
    setShowResults(false);
  };

  const handleReturnBook = async (book: BorrowedBook) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/loans/${book.id}/return_book/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReturnedBook(res.data);
      setReturnedBookIds((prev) => [...prev, book.id]);
      localStorage.setItem('lastReturnedBook', JSON.stringify(res.data));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Refresh data
      const loansRes = await axios.get(`${API_BASE_URL}/loans/`, { headers: { Authorization: `Bearer ${token}` } });
      const allLoans = loansRes.data.results || [];
      setLoans(allLoans);
      const activeLoans = allLoans.filter((loan: LoanResponse) => !loan.return_date);
      const overdueBooks = activeLoans.filter((loan: LoanResponse) => loan.is_overdue);
      setStats({ activeLoans: activeLoans.length, overdueBooks: overdueBooks.length });
      setRecentTransactions(allLoans.sort((a: LoanResponse, b: LoanResponse) => new Date(b.loan_date).getTime() - new Date(a.loan_date).getTime()).slice(0, 5));
    } catch (err: any) {
      console.error('Error returning book:', err);
      alert(err.response?.data?.non_field_errors?.[0] || 'Error returning book');
    }
  };

  const handleBulkReturn = async () => {
    if (bulkReturn.length === 0) return;

    try {
      await Promise.all(
        bulkReturn.map((id) =>
          axios.post(`${API_BASE_URL}/loans/${id}/return_book/`, {}, { headers: { Authorization: `Bearer ${token}` } })
        )
      );

      toast.success(`${bulkReturn.length} books returned successfully!`);
      setBulkReturn([]);

      // Refresh data
      const loansRes = await axios.get(`${API_BASE_URL}/loans/`, { headers: { Authorization: `Bearer ${token}` } });
      const allLoans = loansRes.data.results || [];
      setLoans(allLoans);
      const activeLoans = allLoans.filter((loan: LoanResponse) => !loan.return_date);
      const overdueBooks = activeLoans.filter((loan: LoanResponse) => loan.is_overdue);
      setStats({ activeLoans: activeLoans.length, overdueBooks: overdueBooks.length });
      setRecentTransactions(allLoans.sort((a: LoanResponse, b: LoanResponse) => new Date(b.loan_date).getTime() - new Date(a.loan_date).getTime()).slice(0, 5));
    } catch (err: any) {
      console.error('Error bulk returning books:', err);
      toast.error('Failed to return some books');
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
    <Box sx={{ minHeight: '100vh', p: 2, bgcolor: '#f5f5f5', minWidth: '100%', marginLeft: 2 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} mb={4} sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
          Book Transactions
        </Typography>
        {/* ✅ Issue Success Modal */}
          <Modal
            open={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 300 }}
          >
            <Fade in={showSuccessModal}>
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
                  ✅ Book Issued Successfully!
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  "{lastIssued?.book_details?.title}" was issued to{' '}
                  <strong>{lastIssued?.member_details?.name}</strong>.
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Due on: {lastIssued?.due_date}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3, borderRadius: 2 }}
                  onClick={() => setShowSuccessModal(false)}
                >
                  Close
                </Button>
              </Box>
            </Fade>
          </Modal>
          {/* ❌ Issue Error Modal */}
            <Modal
              open={showErrorModal}
              onClose={() => setShowErrorModal(false)}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{ timeout: 300 }}
            >
              <Fade in={showErrorModal}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 3,
                    p: 4,
                    width: 400,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
                    Borrowing Failed
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {errorMessage || "Unable to issue book. Please try again."}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowErrorModal(false)}
                  >
                    Close
                  </Button>
                </Box>
              </Fade>
            </Modal>



        {/* Quick Stats */}
        // @ts-ignore
        <Grid container spacing={2} mb={4}>
        // @ts-ignore
        <div style={{
                flex: '1 1 25%', // md=3 equivalent
                minWidth: '200px', // ensures responsiveness
                boxSizing: 'border-box',
                padding: '8px' // optional spacing between items
              }}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, animation: `${slideIn} 0.4s ease-out` }}>
              <LibraryBooks color="primary" />
              <Box>
                <Typography variant="h6">{stats.activeLoans}</Typography>
                <Typography variant="body2" color="text.secondary">Active Loans</Typography>
              </Box>
            </Card>
          </div>
          <div style={{
                flex: '1 1 25%', // md=3 equivalent
                minWidth: '200px', // ensures responsiveness
                boxSizing: 'border-box',
                padding: '8px' // optional spacing between items
              }}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, animation: `${slideIn} 0.4s ease-out 0.1s both` }}>
              <Warning color="error" />
              <Box>
                <Typography variant="h6">{stats.overdueBooks}</Typography>
                <Typography variant="body2" color="text.secondary">Overdue Books</Typography>
              </Box>
            </Card>
          </div>

          
          <div style={{
              flex: '1 1 25%', // md=3 equivalent
              minWidth: '200px', // ensures responsiveness
              boxSizing: 'border-box',
              padding: '8px' // optional spacing between items
            }}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, animation: `${slideIn} 0.4s ease-out 0.2s both` }}>
              <TrendingUp color="success" />
              <Box>
                <Typography variant="h6">{recentTransactions.length}</Typography>
                <Typography variant="body2" color="text.secondary">Recent Transactions</Typography>
              </Box>
            </Card>
          </div>
          
          <div style={{
                flex: '1 1 25%', // md=3 equivalent
                minWidth: '200px', // ensures responsiveness
                boxSizing: 'border-box',
                padding: '8px' // optional spacing between items
              }}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, animation: `${slideIn} 0.4s ease-out 0.3s both` }}>
              <CheckCircle color="info" />
              <Box>
                <Typography variant="h6">{returnedBookIds.length}</Typography>
                <Typography variant="body2" color="text.secondary">Books Returned Today</Typography>
              </Box>
            </Card>
          </div>
        </Grid>

        <Card sx={{ borderRadius: 2, animation: `${fadeIn} 0.6s ease-out` }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Issue Book" icon={<MenuBook />} iconPosition="start" />
            <Tab label="Return Book" icon={<ArrowBack />} iconPosition="start" />
          </Tabs>

          {/* Issue Book Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} mb={3}>Issue a Book</Typography>

              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
              {message && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{message}</Alert>}

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
                  <Box sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: 2, p: 2, mt: 2, animation: `${slideIn} 0.4s ease-out` }}>
                    <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                      Selected Member
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#111', mt: 0.5 }}>
                      {selectedMember.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                      {selectedMember.email} • ID: {selectedMember.membership_id}
                    </Typography>
                  </Box>
                )}
              </Box>

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
                  <Box sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: 2, p: 2, mt: 2, animation: `${slideIn} 0.4s ease-out` }}>
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
                  </Box>
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

              {lastIssued && (
                <Card sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', animation: `${fadeIn} 0.6s ease-out` }}>
                  <Card sx={{ mt: 4, p: 3, borderRadius: 3, backgroundColor: 'white' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CheckCircle sx={{ color: '#059669' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#065f46' }}>
                        Last Issued Book
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary">Member</Typography>
                    <Typography variant="body1" fontWeight={600}>{lastIssued.member_details.name}</Typography>

                    <Typography variant="subtitle2" color="text.secondary" mt={1}>Book</Typography>
                    <Typography variant="body1" fontWeight={600}>{lastIssued.book_details.title}</Typography>

                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Loan Date: {lastIssued.loan_date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due Date: {lastIssued.due_date}
                    </Typography>
                  </Card>

                  <Grid container spacing={2}>
                  
                    <div style={{
                            flex: '1 1 25%', // md=3 equivalent
                            minWidth: '200px', // ensures responsiveness
                            boxSizing: 'border-box',
                            padding: '8px' // optional spacing between items
                          }}>
                      <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Member</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{lastIssued.member_details.name}</Typography>
                    </div>
                 
                    <div style={{
                          flex: '1 1 25%', // md=3 equivalent
                          minWidth: '200px', // ensures responsiveness
                          boxSizing: 'border-box',
                          padding: '8px' // optional spacing between items
                        }}>
                      <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Book</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{lastIssued.book_details.title}</Typography>
                    </div>
                    
                    <div style={{
                          flex: '1 1 25%', // md=3 equivalent
                          minWidth: '200px', // ensures responsiveness
                          boxSizing: 'border-box',
                          padding: '8px' // optional spacing between items
                        }}>
                      <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Loan Date</Typography>
                      <Typography variant="body1">{lastIssued.loan_date}</Typography>
                    </div>
                    // @ts-ignore
                    <div style={{
                          flex: '1 1 25%', // md=3 equivalent
                          minWidth: '200px', // ensures responsiveness
                          boxSizing: 'border-box',
                          padding: '8px' // optional spacing between items
                        }}>
                      <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Due Date</Typography>
                      <Typography variant="body1" sx={{ color: '#dc2626', fontWeight: 600 }}>{lastIssued.due_date}</Typography>
                    </div>
                  </Grid>
                </Card>
              )}
            </Box>
          )}

          {/* Return Book Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} mb={3}>Return a Book</Typography>

              {/* Success Modal */}
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
                        ⚠ This book was {calculateDaysOverdue(returnedBook?.due_date || '')} days overdue.
                      </Typography>
                    )}
                  </Box>
                </Fade>
              </Modal>

              {/* Search Bar */}
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
                    setSelectedMemberReturn(null);
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
                    {filteredMembers.map((member: MemberWithBooks) => (
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
                            label={`${member.borrowedBooks.length} book${member.borrowedBooks.length !== 1 ? 's' : ''}`}
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

              {/* Selected Member and Books */}
              {selectedMemberReturn && (
                <>
                  <Card sx={{ p: 3, mb: 4, backgroundColor: '#e3f2fd' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          Selected Member
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {selectedMemberReturn.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedMemberReturn.email}
                        </Typography>
                      </Box>
                      <Button
                        startIcon={<ArrowBack />}
                        color="primary"
                        onClick={() => {
                          setSelectedMemberReturn(null);
                          setSearch('');
                        }}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Card>

                  {/* Bulk Return Button */}
                  {bulkReturn.length > 0 && (
                    <Box mb={2}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleBulkReturn}
                        startIcon={<CheckBox />}
                      >
                        Return Selected ({bulkReturn.length})
                      </Button>
                    </Box>
                  )}

                  {/* Books Table */}
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={bulkReturn.length > 0 && bulkReturn.length < selectedMemberReturn.borrowedBooks.length}
                              checked={bulkReturn.length === selectedMemberReturn.borrowedBooks.length && selectedMemberReturn.borrowedBooks.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBulkReturn(selectedMemberReturn.borrowedBooks.map(b => b.id));
                                } else {
                                  setBulkReturn([]);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell><Typography fontWeight='bold' color='black'>Book Title</Typography></TableCell>
                          <TableCell><Typography fontWeight='bold' color='black'>Author</Typography></TableCell>
                          <TableCell><Typography fontWeight='bold' color='black'>Due Date</Typography></TableCell>
                          <TableCell><Typography fontWeight='bold' color='black'>Status</Typography></TableCell>
                          <TableCell><Typography fontWeight='bold' color='black'>Actions</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedMemberReturn.borrowedBooks.map((book: BorrowedBook) => {
                          const daysOverdue = calculateDaysOverdue(book.dueDate);
                          const isReturned = returnedBookIds.includes(book.id);
                          const isSelected = bulkReturn.includes(book.id);

                          return (
                            <TableRow key={book.id}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setBulkReturn(prev => [...prev, book.id]);
                                    } else {
                                      setBulkReturn(prev => prev.filter(id => id !== book.id));
                                    }
                                  }}
                                  disabled={isReturned}
                                />
                              </TableCell>
                              <TableCell>{book.title}</TableCell>
                              <TableCell>{book.author}</TableCell>
                              <TableCell>
                                <Typography sx={{ color: book.isOverdue ? '#dc2626' : 'inherit', fontWeight: book.isOverdue ? 600 : 'normal' }}>
                                  {book.dueDate}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={isReturned ? 'Returned' : book.isOverdue ? `Overdue (${daysOverdue} days)` : 'Active'}
                                  size="small"
                                  color={isReturned ? 'success' : book.isOverdue ? 'error' : 'primary'}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="success"
                                  disabled={isReturned}
                                  onClick={() => handleReturnBook(book)}
                                  size="small"
                                >
                                  {isReturned ? 'Returned' : 'Return'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

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
          )}
        </Card>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card sx={{ mt: 4, p: 3, borderRadius: 2, animation: `${fadeIn} 0.6s ease-out` }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Recent Transactions</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Book</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction: LoanResponse) => (
                    <TableRow key={transaction.loan_id}>
                      <TableCell>{transaction.member_details.name}</TableCell>
                      <TableCell>{transaction.book_details.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.return_date ? 'Returned' : 'Issued'}
                          size="small"
                          color={transaction.return_date ? 'success' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>{transaction.return_date || transaction.loan_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Box>
    </Box>
  );
}
