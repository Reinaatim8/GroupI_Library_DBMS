import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Modal,
} from '@mui/material';
import { PlusCircle } from 'lucide-react'; // changed icon for Add Book
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

interface Book {
  book_id: number;
  title: string;
  author_name?: string;
  genre: string;
  published_year: number;
  copies_available: number;
  is_available: boolean;
  isbn?: string;
}

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author_name: '',
    genre: '',
    published_year: '',
    copies_available: '',
    isbn: '',
  });

  const token = localStorage.getItem('access_token');

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://Roy256.pythonanywhere.com/api/books/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawBooks = response.data.results || response.data;

      const formattedBooks = rawBooks.map((book: any) => ({
        book_id: book.book_id,
        title: book.title,
        author_name: book.author_name || 'Unknown',
        genre: book.genre,
        published_year: book.published_year,
        copies_available: book.copies_available,
        is_available: book.is_available,
        isbn: book.isbn || '',
      }));

      setBooks(formattedBooks);
    } catch (error: any) {
      console.error('Error fetching books:', error.response?.data || error.message);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [token]);

  // === Filter Books ===
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.author_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase())
  );

  // === 📊 Prepare data for chart ===
  const genreData = Object.values(
    filteredBooks.reduce((acc: any, book) => {
      if (!acc[book.genre]) {
        acc[book.genre] = { genre: book.genre, available: 0 };
      }
      acc[book.genre].available += book.copies_available;
      return acc;
    }, {})
  );

  const COLORS = ['#1976d2', '#16a34a', '#dc2626', '#f59e0b', '#9333ea', '#0ea5e9'];

  // === Handle Add Book ===
  const handleAddBook = async () => {
    if (
      !newBook.title ||
      !newBook.author_name ||
      !newBook.genre ||
      !newBook.published_year ||
      !newBook.copies_available
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(
        'https://Roy256.pythonanywhere.com/api/books/',
        {
          title: newBook.title,
          author_name: newBook.author_name,
          genre: newBook.genre,
          published_year: parseInt(newBook.published_year),
          copies_available: parseInt(newBook.copies_available),
          isbn: newBook.isbn || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Book added successfully!');
      setOpenAddModal(false);
      setNewBook({
        title: '',
        author_name: '',
        genre: '',
        published_year: '',
        copies_available: '',
        isbn: '',
      });
      fetchBooks();
    } catch (error: any) {
      console.error('Error adding book:', error.response?.data || error.message);
      toast.error('Failed to add book');
    }
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Typography>Loading books...</Typography>
      </Box>
    );
  }

  return (
    <Box p={7} bgcolor="grey.50" minHeight="100vh" width="110vh" pl={7} ml={10}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        MANAGE LIBRARY BOOKS
      </Typography>

      {/* === Top Actions === */}
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          label="Search by title, author, or genre"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 3, minWidth: 250 }}
        />
        <Button
          variant="contained"
          startIcon={<PlusCircle />}
          onClick={() => setOpenAddModal(true)}
        >
          Add Book
        </Button>
      </Box>

      {/* === Bar Chart === */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          Copies Available per Book Genre
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={genreData}>
            <XAxis dataKey="genre" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="available" fill="#1976d2">
              {genreData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* === Books Table === */}
      <Card>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight="bold">TITLE</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">AUTHOR</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">GENRE</Typography></TableCell>
                {/* <TableCell><Typography fontWeight="bold">ISBN</Typography></TableCell> */}
                <TableCell><Typography fontWeight="bold">AVAILABLE COPIES</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">STATUS</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No books found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book.book_id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author_name}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    {/* <TableCell>{book.isbn}</TableCell> */}
                    <TableCell>{book.copies_available}</TableCell>
                    <TableCell>
                      <Typography
                        color={book.is_available ? 'green' : 'red'}
                        fontWeight="bold"
                      >
                        {book.is_available ? 'Available' : 'Unavailable'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* === Add Book Modal === */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: '90%',
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" mb={3} fontWeight="bold" color='Black'>
            ADD A NEW BOOK
          </Typography>

          <TextField
            fullWidth
            label="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Author"
            value={newBook.author_name}
            onChange={(e) => setNewBook({ ...newBook, author_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Published Year"
            type="number"
            value={newBook.published_year}
            onChange={(e) => setNewBook({ ...newBook, published_year: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Available Copies"
            type="number"
            value={newBook.copies_available}
            onChange={(e) => setNewBook({ ...newBook, copies_available: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="ISBN (optional)"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            sx={{ mb: 3 }}
          />

          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setOpenAddModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleAddBook}>
              Save Book
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
