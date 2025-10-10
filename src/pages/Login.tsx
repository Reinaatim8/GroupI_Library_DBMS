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
import { Google as GoogleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulated login delay
    setTimeout(() => {
      if (email === 'admin@library.com' && password === 'Admin123!') {
        if (remember) {
          localStorage.setItem('remember_me', 'true');
        }
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try admin@library.com / Admin123!');
      }
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setError('Google Sign-In is not available yet. Please use email and password.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        padding: 2,
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
              fontWeight: 700,
              mb: 1,
              color: '#1a1a1a',
            }}
          >
            WELCOME BACK
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 4,
              color: '#666',
            }}
          >
            Welcome back! Please enter your details.
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 500, color: '#333' }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              type="email"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 500, color: '#333' }}
            >
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
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    size="small"
                    disabled={loading}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  color: '#666',
                  '&:hover': { color: '#FF3B3B' },
                }}
              >
                Forgot password
              </Link>
            </Box>

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
                '&:disabled': {
                  background: '#ccc',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
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
              Sign in with Google
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 3, color: '#666' }}
            >
              Don't have an account?{' '}
              <Link
                href="#"
                underline="none"
                sx={{
                  color: '#FF3B3B',
                  fontWeight: 600,
                  '&:hover': { color: '#E63535' },
                }}
              >
                Sign up for free!
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
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
