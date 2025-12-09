import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

function ActivityLog({ onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/invoice/logs');
      setLogs(response.data.logs.reverse());
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-effect rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(log.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {log.action}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      
                      {log.fileName && (
                        <p className="text-sm text-gray-600 mb-1">
                          File: <span className="font-medium">{log.fileName}</span>
                        </p>
                      )}
                      
                      {log.format && (
                        <p className="text-sm text-gray-600 mb-1">
                          Format: <span className="font-medium uppercase">{log.format}</span>
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`
                          text-xs px-2 py-1 rounded-full font-medium
                          ${log.status === 'success' ? 'bg-green-100 text-green-700' : ''}
                          ${log.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
                          ${log.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : ''}
                        `}>
                          {log.status}
                        </span>
                      </div>
                      
                      {log.error && (
                        <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                          {log.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
