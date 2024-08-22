//patrickJane@gmail.com

import React, { useState, ChangeEvent, FormEvent } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Administrator } from '../types/Administrator';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errEmail, setErrEmail] = useState<string>("");
  const [errPassword, setErrPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!email) {
      setErrEmail("Enter your email");
      return;
    }

    if (!password) {
      setErrPassword("Enter your password");
      return;
    }

    try {
      const response = await axios.get<{ status: string, message?: string, data?: Administrator }>(`${apiUrl}/getAdmin`, {
        params: { email, password }
      });

      const { status, message, data } = response.data;

      if (status === "success" && data) {
        localStorage.setItem("valid", "true");
        localStorage.setItem("adminId", data.Administrator_ID.toString()); // Ensure ID is a string
        localStorage.setItem("adminName", data.Administrator_fullname); 
        navigate('/dashboard');
      } else {
        setErrPassword(message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrPassword("Invalid email or password");
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        <h2>Login Page</h2>
        <form onSubmit={handleSignIn}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name='email'
              autoComplete='off'
              placeholder='Enter Email'
              value={email}
              onChange={handleEmail}
              className='form-control rounded-0'
            />
            {errEmail && <div className='text-danger'>{errEmail}</div>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password:</strong></label>
            <input
              type="password"
              name='password'
              placeholder='Enter Password'
              value={password}
              onChange={handlePassword}
              className='form-control rounded-0'
            />
            {errPassword && <div className='text-danger'>{errPassword}</div>}
          </div>
          <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
