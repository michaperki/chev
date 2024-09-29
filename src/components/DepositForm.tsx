
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { depositIntoSession } from '../services/session';

const DepositForm: React.FC = () => {
  const user = useSelector((state: RootState) => state.user); // Get user data from Redux
  const session = useSelector((state: RootState) => state.session); // Get session data from Redux
  const [depositAmount, setDepositAmount] = useState<string>(''); // Track deposit amount
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDeposit = async () => {
    try {
      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        setError('Please enter a valid deposit amount');
        return;
      }

      console.log('Depositing into session:', session.sessionId);
      console.log('Depositing amount:', depositAmount);
      console.log('Wallet Address:', user.walletAddress);
      console.log('User: ', user);

      // Call backend to deposit into session, using walletAddress instead of playerId
      const response = await depositIntoSession(user.walletAddress, session.sessionId, depositAmount);
      setSuccessMessage('Deposit successful!');
      setError(null);
    } catch (error) {
      setError('Failed to deposit into session');
      setSuccessMessage(null);
      console.error('Error depositing into session:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        placeholder="Deposit Amount"
        className="mb-2 p-2 border text-black"
      />
      <button
        onClick={handleDeposit}
        className="bg-blue-500 text-white p-2"
      >
        Deposit
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default DepositForm;

