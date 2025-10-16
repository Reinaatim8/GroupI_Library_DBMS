import React, { useState, useEffect } from 'react';
import {
  Box, Card, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, TextField, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Chip, styled, keyframes
} from '@mui/material';
import { Search, Add, Close, Save, ArrowBack, Email, Phone, LocationOn, CalendarToday, Person } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const StyledCard = styled(Card)({
  background: '#fff',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  animation: `${fadeIn} 0.6s ease-out`,
  transition: 'box-shadow 0.3s ease',
  '&:hover': { boxShadow: '0 8px 28px rgba(0,0,0,0.1)' },
});

type Member = {
  id: number;
  memberId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
};

export default function ManageMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: '', confirm_password: ''
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }
    fetchMembers();
  }, [token, navigate]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('https://Roy256.pythonanywhere.com/api/members/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const membersData: Member[] = response.data.results.map((m: any) => ({
        id: m.membership_id,
        memberId: m.membership_id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        address: m.address,
        membershipDate: m.membership_date,
      }));

      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search)
  );

  const handleOpenForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '', password: '', confirm_password: '' });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', address: '', password: '', confirm_password: '' });
  };

  const handleSaveMember = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'https://Roy256.pythonanywhere.com/api/members/',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Member added successfully!');
      fetchMembers();
      handleCloseForm();
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    }
  };

  const handleViewDetails = async (member: Member) => {
    try {
      const response = await axios.get(
        `https://Roy256.pythonanywhere.com/api/members/${member.memberId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const m = response.data;
      setSelectedMember({
        id: m.membership_id,
        memberId: m.membership_id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        address: m.address,
        membershipDate: m.membership_date,
      });
    } catch (error) {
      console.error('Error fetching member details:', error);
      toast.error('Failed to fetch member details');
    }
  };

  const handleBackToList = () => setSelectedMember(null);

  // Member detail view
  if (selectedMember) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', background: '#fafafa', minHeight: '100vh' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToList}
          sx={{
            mb: 4,
            textTransform: 'none',
            fontWeight: 600,
            color: '#2563eb',
          }}
        >
          Back to Members
        </Button>

        <StyledCard sx={{ animation: `${scaleIn} 0.5s ease-out` }}>
          <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box
              sx={{
                width: { xs: '100%', md: 200 },
                height: 200,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Person sx={{ fontSize: 100, color: 'white' }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111', mb: 3 }}>
                {selectedMember.name}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: '#2563eb', fontSize: 24 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Email</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedMember.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: '#10b981', fontSize: 24 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Phone</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedMember.phone}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: '#ef4444', fontSize: 24 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedMember.address}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarToday sx={{ color: '#8b5cf6', fontSize: 24 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Member Since</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedMember.membershipDate}</Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`ID: ${selectedMember.memberId}`}
                    sx={{ background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </StyledCard>
      </Box>
    );
  }

  // Members list view
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto', background: '#fafafa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#111', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Manage Members
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
            {members.length} total members
          </Typography>
        </Box>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={handleOpenForm}
          sx={{
            background: '#2563eb',
            px: 3,
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { background: '#1d4ed8' },
          }}
        >
          Add Member
        </Button>
      </Box>

      <StyledCard sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />,
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </StyledCard>

      <TableContainer component={StyledCard}>
        <Table>
          <TableHead sx={{ background: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Member ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Member Since</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Person sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                  <Typography color="text.secondary">No members found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Chip
                      label={member.memberId}
                      size="small"
                      sx={{ background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetails(member)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#2563eb',
                        '&:hover': { background: '#eff6ff' },
                      }}
                    >
                      {member.name}
                    </Button>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.membershipDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Add New Member</Typography>
            <IconButton onClick={handleCloseForm}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
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
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            />
            <Box sx={{ background: '#eff6ff', p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 20, color: '#2563eb' }} />
              <Typography variant="body2" sx={{ color: '#1e40af' }}>
                Membership starts today: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseForm} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveMember}
            startIcon={<Save />}
            variant="contained"
            sx={{
              background: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { background: '#1d4ed8' },
            }}
          >
            Save Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}