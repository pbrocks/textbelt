export default function RegionSelector({ selectedRegion, onChange }) {
  const regions = [
    { value: 'us', label: 'United States', description: '9-10 digit numbers' },
    { value: 'canada', label: 'Canada', description: 'Canadian numbers' },
    { value: 'intl', label: 'International', description: 'International numbers' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Select Region
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {regions.map((region) => (
          <button
            key={region.value}
            type="button"
            onClick={() => onChange(region.value)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedRegion === region.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
            }`}
          >
            <div className="font-semibold">{region.label}</div>
            <div className="text-xs mt-1 opacity-75">{region.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
