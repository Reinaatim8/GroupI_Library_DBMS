import React from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { PersonOutline, MenuBook, CalendarToday } from '@mui/icons-material';

// Static data just for display
const members = [
  { name: 'John Smith', memberId: 'MEM001', email: 'john@example.com' },
];

const book = {
  title: 'To Kill a Mockingbird',
  author: 'Harper Lee',
  isbn: '978-0061120084',
  available: 3,
  total: 5,
};

export default function IssueBookPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' ,}}>
      <Box sx={{ Width: 800, mx: 'auto' ,px:46,ml:-45}}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Issue Book
        </Typography>

        {/* Card container */}
        <Box display="flex" gap={3} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          {/* Member Selection */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' ,px:45}}>
              <PersonOutline sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Select Member</Typography>
            </Box>

            <TextField
              label="Search member by name"
              placeholder="Type member name..."
              variant="outlined"
              fullWidth
            />

            {/* Static Selected Member Card */}
            <Card sx={{ mt: 2, bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">
                  Selected Member
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {members[0].name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {members[0].memberId} • {members[0].email}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Book Selection */}
          <Box sx={{ mb: 4 ,px:45}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MenuBook sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Select Book</Typography>
            </Box>

            <TextField
              label="Search book by title"
              placeholder="Type book title..."
              variant="outlined"
              fullWidth
            />

            {/* Static Selected Book Card */}
            <Card sx={{ mt: 2, bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="secondary">
                  Selected Book
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  by {book.author}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`${book.available} of ${book.total} copies available`}
                    size="small"
                    color="success"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Static Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            Issue Book
          </Button>
        </Paper>

        {/* Static Issue Details */}
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: 2 ,px:45}}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarToday sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6" color="success.dark">
              Last Issued Book
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Member
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {members[0].name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Book
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {book.title}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Loan Date
              </Typography>
              <Typography variant="body1">10/05/2025</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Due Date
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'error.main', fontWeight: 600 }}
              >
                24/05/2025
              </Typography>
              
            </Box>
          </Box>
        </Paper>
        </Box>
      </Box>
    </Box>
  );
}
