import React, { useState, useEffect } from 'react';
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
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


// Type for members
type Member = {
  id: number;
  memberId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
  currentBooks: any[]; // can define proper Book type later
  borrowingHistory: any[];
};

export default function ManageMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');
    useEffect(() => {
      if (!token) {
        toast.error('Session time Expired! Please Login Again to continue');
        navigate('/login');
      }
    }, [token, navigate]);
  // Fetch members from API
  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/members/', {
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
        currentBooks: Array(m.active_loans_count).fill({}), // placeholder
        borrowingHistory: [], // populate if API provides
      }));

      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members by search
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search)
  );

  // Add / Edit member form handlers
  const handleOpenForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '', password: "", confirm_password: "" });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', address: '', password: "", confirm_password: "" });
  };

  const handleSaveMember = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(
        '/api/members/',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Member added successfully!');
      setMembers((prev) => [
        ...prev,
        {
          id: response.data.membership_id,
          memberId: response.data.membership_id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          membershipDate: response.data.membership_date,
          currentBooks: [],
          borrowingHistory: [],
        },
      ]);

      handleCloseForm();
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    }
  };

  // View member details
  const handleViewDetails = async (member: Member) => {
    try {
      const response = await axios.get(
        `/api/members/${member.memberId}/`,
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
        currentBooks: [], // populate from API if available
        borrowingHistory: [], // populate from API if available
      });
    } catch (error) {
      console.error('Error fetching member details:', error);
      toast.error('Failed to fetch member details');
    }
  };

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
      <Box p={2} >
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={handleBackToList}
          sx={{ mb: 4 }}
          
        >
          Back to Members
        </Button>

        {/* Member Info Card */}
        <Card sx={{ p: 3, mb: 4 , boxShadow: 8}}>
          <Box display="flex" gap={3} flexWrap="wrap" borderRadius={20} >
            <Box
              p={0}
              bgcolor="primary.light"
              borderRadius="35"
              display="flex"
              alignItems="center"
              marginLeft={10}
              justifyContent="center"
              width={250}
            >
              <User size={110} color="white" />
            </Box>
            <Box mt={1} display="flex"  flex={1} flexDirection="column">
              <Typography variant="h4" fontWeight="bold" gap={1} fontSize={40} sx={{ textDecoration: 'underline' }}>
                {selectedMember.name.toUpperCase()}
              </Typography><br/>
              <Box mt={1} display="flex" alignItems="center" gap={3} flexDirection="column">
                <Box display="flex" alignItems="center" gap={3} minWidth={600} >
                  <Mail size={30} color='blue' />
                  <Typography fontFamily='monospace' fontSize={25}>{selectedMember.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={3} minWidth={600} >
                  <Phone size={30} color='green'/>
                  <Typography fontFamily='monospace' fontSize={25}>{selectedMember.phone}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={3} minWidth={600}>
                  <MapPin size={30} color='red' />
                  <Typography fontFamily='monospace' fontSize={25}>{selectedMember.address}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={3} minWidth={600}>
                  <Calendar size={30} />
                  <Typography fontFamily='monospace' fontSize={25}>Member since {selectedMember.membershipDate}</Typography>
                </Box>
              </Box>
              <Box mt={2}>
                <Chip label={selectedMember.memberId} color="primary" />
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  }

  // Members list view
  return (
    <Box p={0} width="100%" marginLeft={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap">
        <Typography variant="h4" fontWeight="bold">
        MANAGE LIBRARY MEMBERSHIP HOLDERS
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
      {/* Total Members Card */}
      <Card sx={{ p: 2, mb: 2 , minwidth: 100}}>
        <Typography variant="h6" fontWeight="bold" color='green' fontSize={30}>
          TOTAL MEMBERS: {members.length}
          
        </Typography>
      </Card>

      {/* Search Bar */}
      <Card sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search size={25} style={{ marginRight: 8 }} />,
          }}
        />
      </Card>

      {/* Members Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight='bold' color='black'>MEMBER ID</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>MEMBER NAME</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>EMAIL</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>TELEPHONE NUMBER</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>MEMBERSHIP START-DATE</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box textAlign="center" py={4}>
                      <User size={48} color="#cbd5e1" />
                      <Typography color="text.secondary">No members found</Typography>
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
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              fullWidth
              margin="normal"
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
