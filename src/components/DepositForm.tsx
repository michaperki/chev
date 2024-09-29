
// src/components/DepositForm.tsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { depositIntoSession, createParticipant } from '../services/session';
import { updateParticipant } from '../slices/participant'; // Import the participant action

const DepositForm: React.FC = () => {
  const user = useSelector((state: RootState) => state.user); // Get user data from Redux
  const session = useSelector((state: RootState) => state.session); // Get session data from Redux
  const [depositAmount, setDepositAmount] = useState<string>(''); // Track deposit amount
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleDeposit = async () => {
    try {
      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        setError('Please enter a valid deposit amount');
        return;
      }

      // Step 1: Deposit into session
      const depositResponse = await depositIntoSession(user.playerId, user.walletAddress, session.sessionId, depositAmount);
      
      // Step 2: Create or fetch participant after deposit
      const participantResponse = await createParticipant(user.userId, user.playerId, session.sessionId, depositAmount);

      // Dispatch the correct _id (MongoDB identifier) to Redux
      dispatch(updateParticipant({
        participantId: participantResponse.participant._id, // Store the _id
        balance: participantResponse.participant.balance,   // Store balance
      }));

      setSuccessMessage('Deposit and participant creation successful!');
      setError(null);
    } catch (error) {
      setError('Failed to deposit into session or create participant');
      console.error('Error:', error);
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

