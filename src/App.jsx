import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import InvoicePreview from './components/InvoicePreview';
import Header from './components/Header';
import ActivityLog from './components/ActivityLog';
import { FileText } from 'lucide-react';

function App() {
  const [extractedData, setExtractedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  const handleExtractSuccess = (data, name) => {
    setExtractedData(data);
    setFileName(name);
  };

  const handleReset = () => {
    setExtractedData(null);
    setFileName('');
  };

  return (
    <div className="min-h-screen">
      <Header onShowLogs={() => setShowLogs(!showLogs)} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        {!extractedData && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              AI Invoice Extractor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your Indian invoice PDF and let AI extract structured data instantly.
              Powered by Google Gemini.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="animate-slide-up">
          {!extractedData ? (
            <FileUpload onExtractSuccess={handleExtractSuccess} />
          ) : (
            <InvoicePreview 
              data={extractedData} 
              fileName={fileName}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Activity Log Modal */}
        {showLogs && (
          <ActivityLog onClose={() => setShowLogs(false)} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p className="mb-2">Built with React, Node.js & Google Gemini AI</p>
        <p className="text-sm">Developed by <span className="font-semibold text-gray-800">Prem Sai Bollamoni</span></p>
      </footer>
    </div>
  );
}

export default App;
