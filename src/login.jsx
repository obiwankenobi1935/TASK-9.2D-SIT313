import React, { useState } from 'react';
import './login.css'
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
      navigate('/');  // Redirect to home page on success
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
      <p>New here? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default Login;
