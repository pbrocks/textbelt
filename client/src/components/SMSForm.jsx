import { useForm } from 'react-hook-form';
import { useTextBelt } from '../hooks/useTextBelt';
import RegionSelector from './RegionSelector';
import CarrierSelector from './CarrierSelector';
import StatusMessage from './StatusMessage';
import { useState } from 'react';

export default function SMSForm({ carriers, onSuccess }) {
  const [region, setRegion] = useState('us');
  const [carrier, setCarrier] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { sendMessage, loading } = useTextBelt();

  const onSubmit = async (data) => {
    try {
      setStatusMessage({ type: '', message: '' });
      const result = await sendMessage(data.number, data.message, region, carrier);

      if (result.success) {
        setStatusMessage({
          type: 'success',
          message: 'Message sent successfully!',
        });

        // Add to history
        if (onSuccess) {
          onSuccess({
            phone: data.number,
            message: data.message,
            region,
            carrier,
            status: 'success',
            timestamp: new Date().toISOString(),
          });
        }

        // Reset form
        reset();
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: error.message || 'Failed to send message. Please check your configuration.',
      });

      // Add error to history
      if (onSuccess) {
        onSuccess({
          phone: data.number,
          message: data.message,
          region,
          carrier,
          status: 'error',
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  const getPhoneValidation = () => {
    if (region === 'us') {
      return {
        pattern: {
          value: /^\d{9,10}$/,
          message: 'US phone numbers must be 9-10 digits',
        },
      };
    }
    return {
      pattern: {
        value: /^\d+$/,
        message: 'Phone number must contain only digits',
      },
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Send SMS</h2>

      <StatusMessage
        type={statusMessage.type}
        message={statusMessage.message}
        onClose={() => setStatusMessage({ type: '', message: '' })}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <RegionSelector selectedRegion={region} onChange={setRegion} />

        <div className="mb-4">
          <label htmlFor="number" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            id="number"
            type="tel"
            {...register('number', {
              required: 'Phone number is required',
              ...getPhoneValidation(),
            })}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.number ? 'border-red-500' : ''
            }`}
            placeholder={region === 'us' ? '5551234567' : 'Enter phone number'}
          />
          {errors.number && (
            <p className="text-red-500 text-xs italic mt-1">{errors.number.message}</p>
          )}
        </div>

        <CarrierSelector
          carriers={carriers}
          selectedCarrier={carrier}
          onChange={setCarrier}
        />

        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            id="message"
            {...register('message', {
              required: 'Message is required',
              maxLength: {
                value: 500,
                message: 'Message must be 500 characters or less',
              },
            })}
            rows="4"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : ''
            }`}
            placeholder="Enter your message here..."
          />
          {errors.message && (
            <p className="text-red-500 text-xs italic mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sending...' : 'Send SMS'}
        </button>
      </form>
    </div>
  );
}
