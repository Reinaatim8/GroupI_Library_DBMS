import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, ArrowBack } from '@mui/icons-material';

interface FormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface ShowPasswords {
  old: boolean;
  new: boolean;
  confirm: boolean;
}

type PasswordField = keyof ShowPasswords;
type FormField = keyof FormData;

function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    old: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (field: FormField) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    setError('');
    setSuccess(false);
  };

  const togglePasswordVisibility = (field: PasswordField) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation
    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      setError('All fields are required');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('New password and confirm password do not match');
      return;
    }

    if (formData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (formData.old_password === formData.new_password) {
      setError('New password must be different from old password');
      return;
    }

    // If validation passes
    console.log('Password reset data:', formData);
    setSuccess(true);
    setError('');

    // Reset form and redirect after successful submission
    setTimeout(() => {
      setFormData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setSuccess(false);
      navigate('/login');
    }, 3000);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToLogin}
            sx={{
              mb: 2,
              color: '#666',
              textTransform: 'none',
              '&:hover': { color: '#FF3B3B' },
            }}
          >
            Back to Login
          </Button>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Lock sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your current password and choose a new one
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password successfully updated! Redirecting to login...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Old Password"
              type={showPasswords.old ? 'text' : 'password'}
              value={formData.old_password}
              onChange={handleChange('old_password')}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility('old')} edge="end">
                      {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.new_password}
              onChange={handleChange('new_password')}
              margin="normal"
              required
              helperText="Must be at least 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility('new')} edge="end">
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={handleChange('confirm_password')}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility('confirm')} edge="end">
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF3B3B 100%)',
                boxShadow: '0 4px 12px rgba(255, 59, 59, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF5252 0%, #E63535 100%)',
                  boxShadow: '0 6px 16px rgba(255, 59, 59, 0.4)',
                },
              }}
            >
              Reset Password
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ResetPassword;