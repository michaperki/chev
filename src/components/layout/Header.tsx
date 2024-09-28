// components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../services/auth';

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="flex items-center justify-between py-4 px-4 bg-gray-900 shadow-md">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Chev
        </Link>
      </div>
      <div className="flex items-center">
        {user ? (
          <button
            className="text-white hover:text-gray-200 px-4 py-2 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-white hover:text-gray-200 px-4 py-2 rounded-md">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
