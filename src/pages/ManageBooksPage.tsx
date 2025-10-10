import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  MenuItem,
} from '@mui/material';
import { Search, Add, Edit, Delete, Book, Close, Save } from '@mui/icons-material';

// Dummy data
const initialBooks = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', year: 1960, genre: 'Fiction', copies: 5 },
  { id: 2, title: '1984', author: 'George Orwell', isbn: '978-0451524935', year: 1949, genre: 'Science Fiction', copies: 4 },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', year: 1813, genre: 'Romance', copies: 6 },
  { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', year: 1925, genre: 'Fiction', copies: 3 },
  { id: 5, title: 'Moby Dick', author: 'Herman Melville', isbn: '978-1503280786', year: 1851, genre: 'Adventure', copies: 2 },
];

const authors = ['Harper Lee', 'George Orwell', 'Jane Austen', 'F. Scott Fitzgerald', 'Herman Melville'];
const genres = ['Fiction', 'Science Fiction', 'Romance', 'Adventure', 'Fantasy'];

export default function ManageBooksPage() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: '',
    genre: '',
    copies: '',
  });

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenForm = (book: any = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        year: book.year.toString(),
        genre: book.genre,
        copies: book.copies.toString(),
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        year: '',
        genre: '',
        copies: '',
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({ title: '', author: '', isbn: '', year: '', genre: '', copies: '' });
  };

  const handleSaveBook = () => {
    if (!formData.title || !formData.author || !formData.isbn || !formData.year || !formData.genre || !formData.copies) {
      alert('Please fill in all fields');
      return;
    }

    if (editingBook) {
      setBooks(
        books.map((book) =>
          book.id === editingBook.id
            ? { ...book, ...formData, year: parseInt(formData.year), copies: parseInt(formData.copies) }
            : book
        )
      );
    } else {
      const newBook = {
        id: Math.max(...books.map((b) => b.id)) + 1,
        ...formData,
        year: parseInt(formData.year),
        copies: parseInt(formData.copies),
      };
      setBooks([...books, newBook]);
    }
    handleCloseForm();
  };

  const handleDeleteBook = (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 4, bgcolor: '#f5f5f5' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap">
          <Typography variant="h4" fontWeight={700} mb={{ xs: 2, sm: 0 }}>
            Manage Books
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenForm()}
          >
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Books Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Title</TableCell>
                <TableCell>Author Name</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Copies</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Book sx={{ fontSize: 48, color: '#c0c0c0', mb: 1 }} />
                    <Typography>No books found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.year}</TableCell>
                    <TableCell>
                      <Chip label={book.genre} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${book.copies} available`}
                        size="small"
                        color={book.copies > 5 ? 'success' : book.copies > 2 ? 'warning' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button onClick={() => handleOpenForm(book)} color="info">
                          <Edit />
                        </Button>
                        <Button onClick={() => handleDeleteBook(book.id)} color="error">
                          <Delete />
                        </Button>
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
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
              width: { xs: '90%', sm: 600 },
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">{editingBook ? 'Edit Book' : 'Add New Book'}</Typography>
              <Button onClick={handleCloseForm}>
                <Close />
              </Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Book Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
              />
              <TextField
                label="Author Name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                fullWidth
                select
              >
                {authors.map((author) => (
                  <MenuItem key={author} value={author}>
                    {author}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="ISBN"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                fullWidth
              />
              <TextField
                label="Published Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                fullWidth
              />
              <TextField
                label="Genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                fullWidth
                select
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Number of Copies"
                type="number"
                value={formData.copies}
                onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
                fullWidth
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button variant="outlined" onClick={handleCloseForm}>
                Cancel
              </Button>
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
