import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        username,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        toast.success('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4" style={{fontFamily: 'Oswald, sans-serif'}}>
            VELOCITY
          </h1>
          <p className="text-lg text-gray-600">Premium Athletic Gear</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8" data-testid="login-form">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-3">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b-2 border-black bg-transparent px-0 py-3 text-xl font-semibold focus:outline-none focus:border-[#D0FF00] transition-colors"
              placeholder="Enter username"
              data-testid="login-username-input"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-black bg-transparent px-0 py-3 text-xl font-semibold focus:outline-none focus:border-[#D0FF00] transition-colors"
                placeholder="Enter password"
                data-testid="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-gray-500 hover:text-black"
                data-testid="password-toggle-btn"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white uppercase font-bold px-8 py-4 tracking-widest hover:bg-zinc-800 transition-colors"
            data-testid="login-submit-btn"
          >
            Login
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 border border-gray-200">
          <p className="text-xs font-bold uppercase mb-2">Test Credentials:</p>
          <p className="text-sm text-gray-600">user1 / user@1</p>
          <p className="text-sm text-gray-600">user2 / user@2</p>
          <p className="text-sm text-gray-600">user3 / user@3</p>
        </div>
      </div>
    </div>
  );
}