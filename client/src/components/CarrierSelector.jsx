import { useState } from 'react';

export default function CarrierSelector({ carriers, selectedCarrier, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCarriers = carriers.filter(carrier =>
    carrier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label htmlFor="carrier" className="block text-gray-700 text-sm font-bold mb-2">
        Carrier (Optional)
      </label>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search carriers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        id="carrier"
        value={selectedCarrier || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Automatic (broadcast to all carriers)</option>
        {filteredCarriers.map((carrier) => (
          <option key={carrier} value={carrier}>
            {carrier}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-600 mt-1">
        Leave as "Automatic" to send via all carrier gateways, or select a specific carrier
      </p>
    </div>
  );
}
