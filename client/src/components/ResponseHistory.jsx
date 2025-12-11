export default function ResponseHistory({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <p>No messages sent yet. Send your first SMS to see history here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carrier
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {entry.region.toUpperCase()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {entry.carrier || 'Auto'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  <span className="truncate max-w-xs block">
                    {entry.message.substring(0, 50)}
                    {entry.message.length > 50 ? '...' : ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
