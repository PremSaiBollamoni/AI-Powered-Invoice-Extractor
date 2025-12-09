import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2, AlertCircle, Brain, Zap, Target } from 'lucide-react';

function FileUpload({ onExtractSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('invoice', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${apiUrl}/api/invoice/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        onExtractSuccess(response.data.data, file.name);
      }, 500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process invoice');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`
          glass-effect rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 transform
          ${isDragging ? 'scale-105 border-blue-500 bg-blue-50/50' : 'hover:scale-102'}
          ${isProcessing ? 'cursor-not-allowed opacity-75' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {!isProcessing ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Invoice PDF
            </h3>
            <p className="text-gray-600 mb-6">
              Drag and drop your invoice here, or click to browse
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>PDF only</span>
              </div>
              <span>•</span>
              <span>Max 10MB</span>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-blue-600 animate-spin" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Invoice...
            </h3>
            <p className="text-gray-600 mb-6">
              AI is extracting data from your invoice
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress}% Complete</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 glass-effect rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">AI Powered</h4>
          <p className="text-sm text-gray-600">Google Gemini extraction</p>
        </div>
        
        <div className="text-center p-6 glass-effect rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Fast</h4>
          <p className="text-sm text-gray-600">Results in seconds</p>
        </div>
        
        <div className="text-center p-6 glass-effect rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Accurate</h4>
          <p className="text-sm text-gray-600">High precision data</p>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
