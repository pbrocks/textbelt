import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '' : 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Helper to convert object to URL-encoded form data
const toFormData = (obj) => {
  const params = new URLSearchParams();
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      params.append(key, obj[key]);
    }
  });
  return params;
};

export const sendSMS = async (number, message, region = 'us', carrier = null) => {
  try {
    const endpoint = region === 'canada' ? '/canada' : region === 'intl' ? '/intl' : '/text';
    const data = toFormData({
      number,
      message,
      ...(carrier && { carrier }),
    });

    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to send SMS'
    );
  }
};

export const getCarriers = async () => {
  try {
    const data = toFormData({ getcarriers: '1' });
    const response = await api.post('/text', data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch carriers'
    );
  }
};

export const getProviders = async (region) => {
  try {
    const response = await api.get(`/providers/${region}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch providers'
    );
  }
};

export default {
  sendSMS,
  getCarriers,
  getProviders,
};
