import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    try {
      const token = localStorage.getItem('access_token'); // get JWT token
      useEffect(() => {
        if (!token) {
          toast.error('Session time Expired! Please Login Again to continue');
          navigate('/login');
        }
      }, [token, navigate]);
      const response = await fetch('https://Roy256.pythonanywhere.com/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccess(true);
      setError('');

      setTimeout(() => {
        setFormData({
          old_password: '',
          new_password: '',
          confirm_password: '',
        });
        setSuccess(false);
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '30%',
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
  );
}

export default ResetPassword;
