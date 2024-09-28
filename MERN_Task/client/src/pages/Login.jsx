import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
 // Create this CSS file for custom styling

export default function Login() {
  const user = useSelector((state) => state.Auth);
  console.log(user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const request = await post('/api/auth/login', { email, password });
      const response = request.data;

      if (request.status === 200) {
        toast.success(response.message); // Show success message
        dispatch(SetUser(response.user));

        // Redirect based on user role
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else if (response.user.role === 'user') {
          navigate('/');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Invalid credentials!'); // Show error message
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='login-btn'>Login</button>
          <p className='register-link'>
            Not registered? <Link to={'/register'}>Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
