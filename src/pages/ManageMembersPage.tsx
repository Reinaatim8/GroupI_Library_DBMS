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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Search,
  Plus,
  User,
  X,
  Save,
  ArrowLeft,
  Book,
  History,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

// Dummy data
type Member = {
  id: number;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
  currentBooks: any[]; // you can define a proper Book type
  borrowingHistory: any[]; // you can define a proper History type
};


const initialMembers: Member[] = [];

export default function ManageMembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search)
  );

  const handleOpenForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const handleSaveMember = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all fields');
      return;
    }
    const newId = Math.max(...members.map((m) => m.id)) + 1;
    const newMember = {
      id: newId,
      memberId: `MEM${String(newId).padStart(3, '0')}`,
      ...formData,
      membershipDate: new Date().toISOString().split('T')[0],
      currentBooks: [],
      borrowingHistory: [],
    };
    setMembers([...members, newMember]);
    handleCloseForm();
  };

  const handleViewDetails = (member: any) => setSelectedMember(member);
  const handleBackToList = () => setSelectedMember(null);

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Selected member view
  if (selectedMember) {
    return (
      <Box p={0}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={handleBackToList}
          sx={{ mb: 4 }}
        >
          Back to Members
        </Button>

        {/* Member Info Card */}
        <Card sx={{ p: 3, mb: 4, }}>
          <Box display="flex" gap={3} flexWrap="wrap">
            <Box
              p={0}
              bgcolor="primary.light"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <User size={32} color="#1976d2" />
            </Box>
            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold">
                {selectedMember.name}
              </Typography>
              <Box mt={1} display="flex" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={1} minWidth={200}>
                  <Mail size={16} />
                  <Typography>{selectedMember.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} minWidth={200}>
                  <Phone size={16} />
                  <Typography>{selectedMember.phone}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} minWidth={200}>
                  <MapPin size={16} />
                  <Typography>{selectedMember.address}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} minWidth={200}>
                  <Calendar size={16} />
                  <Typography>Member since {selectedMember.membershipDate}</Typography>
                </Box>
              </Box>
              <Box mt={2}>
                <Chip label={selectedMember.memberId} color="primary" />
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Current Borrowed Books */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Book size={24} color="#6b21a8" />
            <Typography variant="h5" fontWeight="bold">
              Currently Borrowed Books
            </Typography>
          </Box>

          {selectedMember.currentBooks.length === 0 ? (
            <Box textAlign="center" p={4} bgcolor="grey.100" borderRadius={2}>
              <Book size={48} color="#cbd5e1" />
              <Typography mt={1} color="text.secondary">
                No books currently borrowed
              </Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {selectedMember.currentBooks.map((book: any) => {
                const daysOverdue = calculateDaysOverdue(book.dueDate);
                return (
                  <Card
                    key={book.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: book.isOverdue ? 'error.light' : 'grey.300',
                      bgcolor: book.isOverdue ? 'error.lighter' : 'white',
                    }}
                  >
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight="bold">{book.title}</Typography>
                        {book.isOverdue && (
                          <Chip
                            label="OVERDUE"
                            color="error"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        by {book.author}
                      </Typography>
                      <Box display="flex" gap={4} flexWrap="wrap">
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Loan Date
                          </Typography>
                          <Typography variant="body2">{book.loanDate}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Due Date
                          </Typography>
                          <Typography
                            variant="body2"
                            color={book.isOverdue ? 'error.main' : 'text.primary'}
                          >
                            {book.dueDate}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Status
                          </Typography>
                          <Typography
                            variant="body2"
                            color={book.isOverdue ? 'error.main' : 'success.main'}
                            fontWeight="bold"
                          >
                            {book.isOverdue
                              ? `${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'} overdue`
                              : 'On time'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          )}
        </Card>

        {/* Borrowing History */}
        <Card sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <History size={24} color="#16a34a" />
            <Typography variant="h5" fontWeight="bold">
              Borrowing History
            </Typography>
          </Box>

          {selectedMember.borrowingHistory.length === 0 ? (
            <Box textAlign="center" p={4} bgcolor="grey.100" borderRadius={2}>
              <History size={48} color="#cbd5e1" />
              <Typography mt={1} color="text.secondary">
                No borrowing history
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Loan Date</TableCell>
                    <TableCell>Return Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedMember.borrowingHistory.map((record: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{record.title}</TableCell>
                      <TableCell>{record.author}</TableCell>
                      <TableCell>{record.loanDate}</TableCell>
                      <TableCell>{record.returnDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={
                            record.status === 'Returned'
                              ? 'success'
                              : record.status === 'Returned Late'
                              ? 'warning'
                              : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Box>
    );
  }

  // Members list view
  return (
    <Box p={0} width='90%' marginLeft={40} >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" >
        <Typography variant="h4" fontWeight="bold">
          Manage Members
        </Typography>
        <Button
          startIcon={<Plus size={20} />}
          variant="contained"
          color="primary"
          onClick={handleOpenForm}
        >
          Add New Member
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
          }}
        />
      </Card>

      {/* Members Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>Member Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Membership Date</TableCell>
                <TableCell>Books</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box textAlign="center" py={4}>
                      <User size={48} color="#cbd5e1" />
                      <Typography color="text.secondary">No members found</Typography>
                      <Typography variant="body2" color="text.disabled">
                        Try adjusting your search
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>{member.memberId}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewDetails(member)} color="primary">
                        {member.name}
                      </Button>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.membershipDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${member.currentBooks.length} borrowed`}
                        color={
                          member.currentBooks.length === 0
                            ? 'default'
                            : member.currentBooks.some((b: any) => b.isOverdue)
                            ? 'error'
                            : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Member Form Dialog */}
      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Member
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email Address"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Box display="flex" alignItems="center" gap={1} bgcolor="primary.lighter" p={1} borderRadius={1}>
              <Calendar size={20} />
              <Typography variant="body2">
                Membership date will be set to today: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSaveMember} startIcon={<Save />} variant="contained" color="primary">
            Save Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
