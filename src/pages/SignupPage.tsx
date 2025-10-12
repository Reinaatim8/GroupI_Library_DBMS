import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
//import { Google as GoogleIcon } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // --- Frontend validation ---
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!terms) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    setLoading(true);

    // --- API INTEGRATION START ---
    try {
      // Replace the URL with your backend signup endpoint
      const response = await fetch('https://your-api.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        // On successful signup, redirect to login page
        navigate('/');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.');
      console.error(err);
    }
    // --- API INTEGRATION END ---
  };

  // const handleGoogleSignUp = () => {
  //   // --- API INTEGRATION POINT FOR GOOGLE SIGN-UP ---
  //   // Here you would trigger Google OAuth flow
  //   setError('Google Sign-Up is not available yet.');
  // };

  return (
    <Box
      sx={{
        minHeight: '20vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FF3B3B',
        padding: 12,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1300px',
          borderRadius: 3,
          overflow: 'hidden',
          minHeight: 500,
        }}
      >
        {/* Left Side - Form */}
        <Box
          sx={{
            flex: 1,
            padding: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              mb: 1,
              color: '#FF3B3B',
            }}
          >
            ✔️CREATE AN ACCOUNT!
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 4,
              color: '#666',
            }}
          >
            Join our Library System For Easy Management today!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="**********"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              required
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  size="small"
                  disabled={loading}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#666' }}>
                  I agree to the terms and conditions
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF3B3B 100%)',
                boxShadow: '0 4px 12px rgba(255, 59, 59, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF5252 0%, #E63535 100%)',
                  boxShadow: '0 6px 16px rgba(255, 59, 59, 0.4)',
                },
                '&:disabled': { background: '#ccc' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign up'}
            </Button>

            {/* <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignUp}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                borderColor: '#ddd',
                color: '#333',
                '&:hover': {
                  borderColor: '#bbb',
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Sign up with Google
            </Button> */}

            <Typography variant="body2" align="center" sx={{ mt: 3, color: '#666' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                sx={{
                  color: '#FF3B3B',
                  fontWeight: 600,
                  '&:hover': { color: '#E63535' },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Image */}
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="/Images/lib.jpg"
            alt="Library"
            sx={{ width: '100%', height: '100%', objectFit: 'fit' }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
