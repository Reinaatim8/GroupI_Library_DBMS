import React, { useState, useEffect } from 'react';
import {
  Box, Card, Typography, TextField, InputAdornment, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Modal, MenuItem,Autocomplete
} from '@mui/material';
import { Search, Add, Edit, Delete, Book, Close, Save } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Example authors and genres (optional, can be dynamic from API)
const authors = ['Harper Lee', 'George Orwell', 'Jane Austen', 'F. Scott Fitzgerald', 'Herman Melville', 'Chimamanda Ngozi Adichie', 'Toni Morrison', 'Haruki Murakami'];
const genres = ['Fiction', 'Science Fiction', 'Romance', 'Adventure', 'Fantasy', 'Dystopian', 'Historical Fiction', 'Political Satire', 'Contemporary Fiction', 'Literary Fiction', 'Magical Realism'];

export default function ManageBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [authorsList, setAuthorsList] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: '',
    genre: '',
    copies: ''
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
      useEffect(() => {
        if (!token) {
          toast.error('Session time Expired! Please Login Again to continue');
          navigate('/login');
        }
      }, [token, navigate]);
      

  useEffect(() => {
      const fetchAuthors = async () => {
          try {
            const response = await axios.get('/api/authors/', {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            const results = response.data.results || response.data;
      
            const mappedAuthors = results.map((a: any) => ({
              id: a.id,
              name: a.name || a.author_name,
            }));
      
            setAuthorsList(mappedAuthors);
          } catch (error) {
            console.error('Error fetching authors:', error);
          }
        };
      
        fetchAuthors();
      }, [token]);


  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const mappedBooks = response.data.results.map((b: any) => ({
          id: b.book_id,
          title: b.title,
          author: b.author_name || 'Unknown',
          genre: b.genre || 'Unknown',
          year: b.published_year || 'N/A',
          copies: b.copies_available || 0,
          isAvailable: b.is_available
        }));

        setBooks(mappedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [token]);

  // Filtered books based on search
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase())
  );

  // Open modal for add/edit
  const handleOpenForm = (book: any = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        year: book.year.toString(),
        genre: book.genre,
        copies: book.copies.toString()
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', year: '', genre: '', copies: '' });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({ title: '', author: '', isbn: '', year: '', genre: '', copies: '' });
  };

  // Save book (add or edit) via API
  const handleSaveBook = async () => {
    if (!formData.title || !formData.author || !formData.genre || !formData.copies) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (editingBook) {
        // Update book
        await axios.put(
          `/api/books/${editingBook.id}/`,
          {
            title: formData.title,
            author_name: formData.author,
            genre: formData.genre,
            published_year: formData.year || null,
            copies_available: parseInt(formData.copies),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create book
        await axios.post(
          `/api/books/`,
          {
            title: formData.title,
            author_name: formData.author,
            genre: formData.genre,
            published_year: formData.year || null,
            copies_available: parseInt(formData.copies),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh book list
      const response = await axios.get('/api/books/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const mappedBooks = response.data.results.map((b: any) => ({
        id: b.book_id,
        title: b.title,
        author: b.author_name || 'Unknown',
        genre: b.genre || 'Unknown',
        year: b.published_year || 'N/A',
        copies: b.copies_available || 0,
        isAvailable: b.is_available
      }));

      setBooks(mappedBooks);
      handleCloseForm();
    } catch (error: any) {
      console.error('Error saving book:', error);
      alert('Failed to save book. Check console for details.');
    }
  };

  // Delete book via API
  const handleDeleteBook = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`/api/books/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBooks(books.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 2, bgcolor: '#f5f5f5' , minWidth:'100%', marginLeft:2}}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap">
          <Typography variant="h4" fontWeight={700} mb={{ xs: 2, sm: 0 }}>
            ADD AND MANAGE LIBRARY BOOK RECORDS 
          </Typography>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenForm()}>
            Add New Book
          </Button>
        </Box>

        {/* Search Bar */}
        <Box mb={4}>
          <TextField
            fullWidth
            placeholder="Search by title, author, or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
        </Box>

        {/* Books Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight='bold' color='black'>BOOK TITLE</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>AUTHOR NAME</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>GENRE</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>PUBLICATION YEAR</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>COPIES AVAILABLE</Typography></TableCell>
                <TableCell><Typography fontWeight='bold' color='black'>ACTIONS</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Book sx={{ fontSize: 48, color: '#c0c0c0', mb: 1 }} />
                    <Typography>No books found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Chip label={book.genre} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{book.year}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${book.copies} available`}
                        size="small"
                        color={book.copies > 5 ? 'success' : book.copies > 2 ? 'warning' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button onClick={() => handleOpenForm(book)} color="info"><Edit /></Button>
                        <Button onClick={() => handleDeleteBook(book.id)} color="error"><Delete /></Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Form Modal */}
        <Modal open={showForm} onClose={handleCloseForm}>
          <Box
            sx={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2, p: 4,
              width: { xs: '90%', sm: 600 }, maxHeight: '90vh', overflowY: 'auto'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">{editingBook ? 'Edit Book' : 'Add New Book'}</Typography>
              <Button onClick={handleCloseForm}><Close /></Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label="Book Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} fullWidth />
              <Autocomplete
                  freeSolo
                  options={authorsList}
                  value={formData.author}
                  onChange={(_event: any, newValue: string | null) => {
                    setFormData({ ...formData, author: newValue || '' });
                  }}
                  onInputChange={(_event: any, newInputValue: string) => {
                    setFormData({ ...formData, author: newInputValue });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Author Name" fullWidth />
                  )}
                />

              <TextField label="Genre" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} fullWidth select>
                {genres.map((genre) => <MenuItem key={genre} value={genre}>{genre}</MenuItem>)}
              </TextField>
              <TextField label="Published Year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} fullWidth />
              <TextField label="Number of Copies" type="number" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: e.target.value })} fullWidth />
            </Box>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button variant="outlined" onClick={handleCloseForm}>Cancel</Button>
              <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSaveBook}>
                {editingBook ? 'Update Book' : 'Save Book'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
