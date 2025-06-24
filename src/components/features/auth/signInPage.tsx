import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import {  useSelector } from 'react-redux';
import { useLogin } from '../../../hooks/auth/useLogin';


type SignInFormValues = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>();

//hooks
const {login} = useLogin();

//subscribing to states
const {loading:isLoading, errorr} = useSelector((state: any) => state.auth);


const onSubmit = async(data: SignInFormValues) => {
  console.log('Form Data:', data);
  await login(data);
};

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
