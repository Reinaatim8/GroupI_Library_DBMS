import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { Search, Book, WarningAmber, ArrowBack } from '@mui/icons-material';

// Dummy data - members with borrowed books
const membersWithBooks = [
  {
    id: 1,
    name: 'John Smith',
    memberId: 'MEM001',
    email: 'john@example.com',
    borrowedBooks: [
      {
        id: 1,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0061120084',
        loanDate: '2024-09-15',
        dueDate: '2024-09-29',
        isOverdue: true,
      },
      {
        id: 2,
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        loanDate: '2024-09-25',
        dueDate: '2024-10-09',
        isOverdue: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    memberId: 'MEM002',
    email: 'sarah@example.com',
    borrowedBooks: [
      {
        id: 3,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0141439518',
        loanDate: '2024-09-20',
        dueDate: '2024-10-04',
        isOverdue: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Michael Brown',
    memberId: 'MEM003',
    email: 'michael@example.com',
    borrowedBooks: [
      {
        id: 4,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0743273565',
        loanDate: '2024-09-28',
        dueDate: '2024-10-12',
        isOverdue: false,
      },
      {
        id: 5,
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '978-0316769174',
        loanDate: '2024-09-18',
        dueDate: '2024-10-02',
        isOverdue: true,
      },
    ],
  },
];

export default function ReturnBookPage() {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [returnedBook, setReturnedBook] = useState<any>(null);

  // Filter members
  const filteredMembers = membersWithBooks.filter((member) => {
    const nameMatch = member.name.toLowerCase().includes(search.toLowerCase());
    const bookMatch = member.borrowedBooks.some((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
    return nameMatch || bookMatch;
  });

  const handleSelectMember = (member: any) => {
    setSelectedMember(member);
    setSearch(member.name);
    setShowResults(false);
  };

  const handleReturnBook = (book: any) => {
    const returnDate = new Date().toLocaleDateString();
    setReturnedBook({ ...book, returnDate, member: selectedMember });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 4, backgroundColor: '#f5f5f5', overflow: 'hidden' ,maxWidth: 900,mr:34}}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', overflow: 'hidden' }}>
        <Typography variant="h4" fontWeight={700} mb={4}>
          Return Book
        </Typography>

        {/* Success Alert */}
        <Snackbar open={showSuccess} autoHideDuration={5000} onClose={() => setShowSuccess(false)}>
          <Alert
            severity="success"
            sx={{ width: '100%' }}
            onClose={() => setShowSuccess(false)}
          >
            "{returnedBook?.title}" returned by {returnedBook?.member.name} on {returnedBook?.returnDate}
            {returnedBook?.isOverdue && (
              <Typography variant="body2" color="warning.main">
                ⚠ This book was {calculateDaysOverdue(returnedBook.dueDate)} days overdue
              </Typography>
            )}
          </Alert>
        </Snackbar>

        <Card sx={{ p: 4, borderRadius: 3, backgroundColor: '#fff', overflow: 'hidden' }}>
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
                {filteredMembers.map((member) => (
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
                        <Typography fontWeight={600} noWrap>{member.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {member.memberId} • {member.email}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${member.borrowedBooks.length} ${member.borrowedBooks.length === 1 ? 'book' : 'books'}`}
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

          {/* Selected Member */}
          {selectedMember && (
            <>
              <Card sx={{ p: 3, mb: 4, backgroundColor: '#e3f2fd' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box sx={{ minWidth: 100, flex: 1, mr: 4 }}>
                    <Typography variant="subtitle2" color="primary" mb={1}>
                      Selected Member
                    </Typography>
                    <Typography variant="h6" fontWeight={600} noWrap>{selectedMember.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      ID: {selectedMember.memberId} • {selectedMember.email}
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<ArrowBack />}
                    color="primary"
                    sx={{ flexShrink: 0 }}
                    onClick={() => { setSelectedMember(null); setSearch(''); }}
                  >
                    Clear
                  </Button>
                </Box>
              </Card>

              {/* Borrowed Books */}
              <Box display="flex" flexDirection="column" gap={2}>
                {selectedMember.borrowedBooks.length === 0 ? (
                  <Card sx={{ py: 6, textAlign: 'center', backgroundColor: '#f0f0f0' }}>
                    <Book sx={{ fontSize: 48, color: '#c0c0c0' }} />
                    <Typography>No books currently borrowed</Typography>
                    <Typography variant="body2" color="text.secondary">
                      This member has returned all books
                    </Typography>
                  </Card>
                ) : (
                  selectedMember.borrowedBooks.map((book: any) => {
                    const daysOverdue = calculateDaysOverdue(book.dueDate);
                    return (
                      <Card
                        key={book.id}
                        sx={{
                          p: 3,
                          border: 1,
                          borderColor: book.isOverdue ? 'error.light' : 'grey.200',
                          backgroundColor: book.isOverdue ? 'error.lighter' : 'white',
                          overflow: 'hidden',
                        }}
                      >
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} sx={{ minWidth: 0 }}>
                          <Box flex={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0 }}>
                                {book.title}
                              </Typography>
                              {book.isOverdue && (
                                <Chip
                                  icon={<WarningAmber />}
                                  label="OVERDUE"
                                  color="error"
                                  size="small"
                                  sx={{ flexShrink: 0 }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={2} noWrap>
                              by {book.author} • ISBN: {book.isbn}
                            </Typography>

                            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={2} fontSize={14}>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography color="text.secondary" variant="body2">Loan Date</Typography>
                                <Typography variant="body2">{book.loanDate}</Typography>
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography color="text.secondary" variant="body2">Due Date</Typography>
                                <Typography variant="body2" color={book.isOverdue ? 'error.main' : 'text.primary'}>
                                  {book.dueDate}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography color="text.secondary" variant="body2">Status</Typography>
                                {book.isOverdue ? (
                                  <Typography variant="body2" color="error.main" fontWeight={600} noWrap>
                                    {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" color="success.main" fontWeight={600}>
                                    On time
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Button
                            variant="contained"
                            color="success"
                            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, flexShrink: 0, whiteSpace: 'nowrap' }}
                            onClick={() => handleReturnBook(book)}
                          >
                            Return
                          </Button>
                        </Box>
                      </Card>
                    );
                  })
                )}
              </Box>
            </>
          )}

          {/* No Selection */}
          {!selectedMember && !search && (
            <Card sx={{ py: 12, textAlign: 'center', backgroundColor: '#f0f0f0' }}>
              <Search sx={{ fontSize: 64, color: '#c0c0c0', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Search for a member to view borrowed books
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type a member name or book title in the search box above
              </Typography>
            </Card>
          )}
        </Card>
      </Box>
    </Box>
  );
}