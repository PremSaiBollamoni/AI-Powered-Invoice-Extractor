import React, { useState } from 'react';
import { Key, X, AlertCircle, ExternalLink } from 'lucide-react';

function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }

    if (!apiKey.startsWith('AIza')) {
      setError('Invalid API key format. Gemini API keys start with "AIza"');
      return;
    }

    onSave(apiKey.trim());
    setApiKey('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setApiKey('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-effect rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">API Key Required</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            To use the AI invoice extraction feature, you need to provide your own Google Gemini API key.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">How to get your API key:</p>
                <ol className="text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Visit Google AI Studio</li>
                  <li>Sign in with your Google account</li>
                  <li>Create a new API key</li>
                  <li>Copy and paste it below</li>
                </ol>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium mt-2"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-xs">
              <strong>Privacy:</strong> Your API key is stored locally in your browser and sent directly to Google's servers. It's never stored on our servers.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;