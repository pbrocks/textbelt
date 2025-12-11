export default function ConfigHelper() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Email Configuration Required
      </h3>
      <div className="text-sm text-blue-800 space-y-2">
        <p>
          TextBelt sends SMS messages by emailing carrier-specific gateways. You need to configure your email transport before sending messages.
        </p>
        <div className="bg-white rounded p-4 mt-3">
          <p className="font-semibold mb-2">To configure email settings:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Edit <code className="bg-gray-100 px-1 rounded">lib/config.js</code> in the project root</li>
            <li>
              Choose a transport:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>SMTP:</strong> Configure with your email provider (Gmail, SendGrid, etc.)</li>
                <li><strong>Sendmail:</strong> Use local sendmail installation</li>
              </ul>
            </li>
            <li>Set the <code className="bg-gray-100 px-1 rounded">from</code> address in <code className="bg-gray-100 px-1 rounded">mailOptions</code></li>
            <li>Restart the server after making changes</li>
          </ol>
        </div>
        <div className="mt-3">
          <a
            href="https://nodemailer.com/smtp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View Nodemailer SMTP Documentation →
          </a>
        </div>
      </div>
    </div>
  );
}
