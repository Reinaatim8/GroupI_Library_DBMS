// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Paper,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

// Remove this interface ❌
// interface LoginPageProps {
//   onForgotPassword: () => void;
// }

// Change this from: export default function LoginPage({ onForgotPassword }: LoginPageProps)
// To this:
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, remember });
    // Add your login logic here
    // After successful login, navigate to dashboard:
    // navigate('/dashboard');
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    // Add Google sign in logic here
  };

  const handleForgotPassword = () => {
    navigate('/PasswordResetPage');
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
          width: '1300px',
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
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link
                component="button"
                type="button"
                onClick={handleForgotPassword}
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
              }}
            >
              Sign in
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
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
            alt="Athlete"
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