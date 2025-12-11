import { useState, useEffect } from 'react';
import { getCarriers } from './services/api';
import SMSForm from './components/SMSForm';
import ResponseHistory from './components/ResponseHistory';
import ConfigHelper from './components/ConfigHelper';

const HISTORY_STORAGE_KEY = 'textbelt_history';

function App() {
  const [carriers, setCarriers] = useState([]);
  const [history, setHistory] = useState([]);
  const [carriersError, setCarriersError] = useState(null);

  // Load carriers on mount
  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const result = await getCarriers();
        if (result.success && result.carriers) {
          setCarriers(result.carriers);
        }
      } catch (error) {
        console.error('Failed to load carriers:', error);
        setCarriersError(error.message);
      }
    };

    fetchCarriers();
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  const handleMessageSent = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 20)); // Keep last 20 entries
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the message history?')) {
      setHistory([]);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TextBelt SMS Service
          </h1>
          <p className="text-gray-600">
            Send free SMS messages via carrier email gateways
          </p>
        </div>

        {/* Config Helper */}
        <ConfigHelper />

        {/* Carrier Loading Error */}
        {carriersError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Note:</strong> Unable to load carrier list: {carriersError}
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* SMS Form */}
          <div>
            <SMSForm carriers={carriers} onSuccess={handleMessageSent} />
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                How It Works
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  TextBelt converts SMS messages to emails sent to carrier-specific gateways (e.g., <code className="bg-gray-100 px-1 rounded">number@txt.att.net</code>).
                </p>
                <p>
                  <strong>Automatic mode:</strong> Broadcasts to all carriers in the selected region, increasing delivery chances.
                </p>
                <p>
                  <strong>Carrier mode:</strong> Targets a specific carrier's gateway if you know the recipient's carrier.
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Success means the email was sent to gateways, not guaranteed SMS delivery.
                </p>
              </div>
            </div>

            {/* Supported Regions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Supported Regions
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>United States:</strong> AT&T, Verizon, T-Mobile, Sprint, and 10+ more carriers
                </li>
                <li>
                  <strong>Canada:</strong> Rogers, Bell, Telus, Fido, and 50+ carriers
                </li>
                <li>
                  <strong>International:</strong> 100+ carriers worldwide (coverage varies)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Response History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Message History</h2>
          <ResponseHistory history={history} onClear={handleClearHistory} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Open source TextBelt •{' '}
            <a
              href="https://github.com/typpo/textbelt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              GitHub
            </a>
            {' • '}
            <a
              href="https://docs.textbelt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
