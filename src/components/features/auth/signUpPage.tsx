import React from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useForm } from 'react-hook-form';

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  userName?: string;
};

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const onSubmit = (data: SignUpFormValues) => {
    console.log('Sign Up Form Data:', { ...data, role: 'user' });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Name"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 30, message: 'Maximum 30 characters' },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
              maxLength: { value: 30, message: 'Maximum 30 characters' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />

          <TextField
            label="Phone"
            {...register('phone', {
              minLength: { value: 10, message: 'Minimum 10 digits' },
              maxLength: { value: 15, message: 'Maximum 15 digits' },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            fullWidth
          />

          <TextField
            label="Address"
            {...register('address', {
              minLength: { value: 10, message: 'Minimum 10 characters' },
              maxLength: { value: 30, message: 'Maximum 30 characters' },
            })}
            error={!!errors.address}
            helperText={errors.address?.message}
            fullWidth
          />

          <TextField
            label="Username"
            {...register('userName', {
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 30, message: 'Maximum 30 characters' },
            })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
