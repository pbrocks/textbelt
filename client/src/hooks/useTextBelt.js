import { useState } from 'react';
import { sendSMS } from '../services/api';

export const useTextBelt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = async (number, message, region, carrier) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await sendSMS(number, message, region, carrier);

      if (result.success) {
        setSuccess(true);
        return result;
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    sendMessage,
    loading,
    error,
    success,
    resetState,
  };
};
