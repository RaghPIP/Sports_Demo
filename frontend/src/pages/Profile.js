import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
    setNewUsername(storedUsername || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter cursor-pointer" 
            style={{fontFamily: 'Oswald, sans-serif'}}
            onClick={() => navigate('/home')}
            data-testid="logo"
          >
            VELOCITY
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 mb-8 hover:underline"
          data-testid="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h2 className="text-4xl md:text-5xl font-black uppercase mb-8" style={{fontFamily: 'Oswald, sans-serif'}} data-testid="profile-title">
          My Profile
        </h2>

        <div className="border border-gray-200 p-8 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block font-bold uppercase text-sm mb-3">Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                data-testid="profile-username-input"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-sm mb-3">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full border-b-2 border-black bg-transparent px-0 py-2 focus:outline-none focus:border-[#D0FF00]"
                data-testid="profile-email-input"
              />
            </div>
          </div>

          <button
            className="mt-8 bg-black text-white uppercase font-bold px-8 py-3 tracking-widest hover:bg-zinc-800 cursor-not-allowed opacity-50"
            data-testid="save-changes-btn"
          >
            Save Changes
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold uppercase"
          data-testid="logout-btn"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}