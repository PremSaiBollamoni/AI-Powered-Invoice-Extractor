import React from 'react';
import { FileText, Activity } from 'lucide-react';

function Header({ onShowLogs }) {
  return (
    <header className="glass-effect sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invoice Extractor</h1>
            <p className="text-xs text-gray-500">AI Powered</p>
          </div>
        </div>
        
        <button
          onClick={onShowLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Activity className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Activity Log</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
