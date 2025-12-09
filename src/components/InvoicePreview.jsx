import React, { useState } from 'react';
import axios from 'axios';
import { Download, FileSpreadsheet, FileText, Edit2, Check, X, ArrowLeft, IndianRupee, Euro, DollarSign, Coins } from 'lucide-react';

function InvoicePreview({ data, fileName, onReset }) {
  const [editableData, setEditableData] = useState(data);
  const [editingCell, setEditingCell] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Get currency symbol based on currency code
  const getCurrencySymbol = (currency) => {
    const symbols = {
      'INR': '₹',
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'JPY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      'CHF': 'CHF',
      'CNY': '¥',
      'SEK': 'kr',
      'NZD': 'NZ$'
    };
    return symbols[currency?.toUpperCase()] || currency || '₹';
  };

  // Get currency icon component
  const CurrencyIcon = () => {
    const currency = editableData.currency?.toUpperCase();
    if (currency === 'INR') return <IndianRupee className="w-6 h-6" />;
    if (currency === 'EUR') return <Euro className="w-6 h-6" />;
    if (currency === 'USD' || currency === 'GBP') return <DollarSign className="w-6 h-6" />;
    return <Coins className="w-6 h-6" />;
  };

  const handleCellEdit = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleLineItemEdit = (index, field, value) => {
    const newLineItems = [...editableData.lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };
    
    // Recalculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const qty = field === 'quantity' ? parseFloat(value) : newLineItems[index].quantity;
      const rate = field === 'rate' ? parseFloat(value) : newLineItems[index].rate;
      newLineItems[index].amount = qty * rate;
    }
    
    setEditableData(prev => ({ ...prev, lineItems: newLineItems }));
  };

  const exportFile = async (format) => {
    setIsExporting(true);
    try {
      const response = await axios.post(
        `/api/invoice/export/${format}`,
        { data: editableData, fileName: fileName.replace('.pdf', '') },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName.replace('.pdf', '')}.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export file');
    } finally {
      setIsExporting(false);
    }
  };

  const EditableCell = ({ value, onSave, type = 'text' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    if (!isEditing) {
      return (
        <div className="group flex items-center gap-2">
          <span>{value || 'N/A'}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="w-3 h-3 text-gray-400 hover:text-blue-600" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          autoFocus
        />
        <button
          onClick={() => {
            onSave(tempValue);
            setIsEditing(false);
          }}
          className="text-green-600 hover:text-green-700"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setTempValue(value);
            setIsEditing(false);
          }}
          className="text-red-600 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Upload New Invoice</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => exportFile('csv')}
            disabled={isExporting}
            className="btn-secondary flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => exportFile('excel')}
            disabled={isExporting}
            className="btn-primary flex items-center gap-2"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-effect p-6 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
          <p className="text-2xl font-bold text-gray-900">{editableData.invoiceNumber}</p>
        </div>
        <div className="glass-effect p-6 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Date</p>
          <p className="text-2xl font-bold text-gray-900">{editableData.invoiceDate}</p>
        </div>
        <div className="glass-effect p-6 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Vendor</p>
          <p className="text-lg font-bold text-gray-900 truncate">{editableData.vendorName}</p>
        </div>
        <div className="glass-effect p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
            <CurrencyIcon />
            {editableData.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="glass-effect rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Vendor Name</label>
            <EditableCell
              value={editableData.vendorName}
              onSave={(val) => handleCellEdit('vendorName', val)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Invoice Number</label>
            <EditableCell
              value={editableData.invoiceNumber}
              onSave={(val) => handleCellEdit('invoiceNumber', val)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Invoice Date</label>
            <EditableCell
              value={editableData.invoiceDate}
              onSave={(val) => handleCellEdit('invoiceDate', val)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">GSTIN</label>
            <EditableCell
              value={editableData.vendorGSTIN}
              onSave={(val) => handleCellEdit('vendorGSTIN', val)}
            />
          </div>
          
          {editableData.vendorAddress && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 block mb-2">Vendor Address</label>
              <p className="text-gray-900">{editableData.vendorAddress}</p>
            </div>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="glass-effect rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Line Items</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {editableData.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <EditableCell
                      value={item.description}
                      onSave={(val) => handleLineItemEdit(index, 'description', val)}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <EditableCell
                      value={item.quantity}
                      onSave={(val) => handleLineItemEdit(index, 'quantity', val)}
                      type="number"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <EditableCell
                      value={item.rate}
                      onSave={(val) => handleLineItemEdit(index, 'rate', val)}
                      type="number"
                    />
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {getCurrencySymbol(editableData.currency)}{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="glass-effect rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Summary</h2>
        
        <div className="space-y-3 max-w-md ml-auto">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{getCurrencySymbol(editableData.currency)}{editableData.subtotal.toLocaleString()}</span>
          </div>
          
          {editableData.cgst > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">CGST</span>
              <span className="font-semibold">{getCurrencySymbol(editableData.currency)}{editableData.cgst.toLocaleString()}</span>
            </div>
          )}
          
          {editableData.sgst > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">SGST</span>
              <span className="font-semibold">{getCurrencySymbol(editableData.currency)}{editableData.sgst.toLocaleString()}</span>
            </div>
          )}
          
          {editableData.igst > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">IGST</span>
              <span className="font-semibold">{getCurrencySymbol(editableData.currency)}{editableData.igst.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between py-3 border-t-2 border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total Amount</span>
            <span className="text-lg font-bold text-blue-600">
              {getCurrencySymbol(editableData.currency)}{editableData.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;
