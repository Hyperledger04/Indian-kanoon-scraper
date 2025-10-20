import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('https://n8n.n8nit.xyz/webhook/IK');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, webhookUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to scrape');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while scraping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Indian Kanoon Scraper
          </h1>
          <p className="text-lg text-gray-600">
            Extract document IDs and send to your n8n workflow
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
                Indian Kanoon Search URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://indiankanoon.org/search/?formInput=..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                required
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                📌 Paste the complete Indian Kanoon search URL
              </p>
            </div>

            {/* Webhook URL Input */}
            <div>
              <label htmlFor="webhook" className="block text-sm font-semibold text-gray-700 mb-2">
                n8n Webhook URL
              </label>
              <input
                type="url"
                id="webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                required
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                🔗 Your n8n webhook endpoint
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !url || !webhookUrl}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scraping in progress...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg> {/* <-- THIS WAS THE FIX */}
                  Start Scraping
                </span>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-green-800">
                      Success! ✨
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Doc IDs Display */}
              {result.docIds && result.docIds.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      📄 Extracted Document IDs
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {result.count} docs
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {result.docIds.map((id, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 border-gray-200 rounded-lg p-3 text-center font-mono text-sm text-gray-700 hover:border-indigo-400 transition"
                      >
                        {id}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Webhook Status:</span>{' '}
                      <span className={result.webhookStatus === 'sent' ? 'text-green-600' : 'text-red-600'}>
                        {result.webhookStatus}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Built with React, Express, and Playwright</p>
        </div>
      </div>
    </div>
  );
}

export default App;
