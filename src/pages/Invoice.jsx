import React, { useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const order = location.state?.orderData;

  useEffect(() => {
    // If someone tries to visit /invoice directly without an order, send them back
    if (!order) {
      navigate('/account');
    }
  }, [order, navigate]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const customerName = order.user?.fullName || order.user?.name || order.shippingAddress?.fullName || 'Customer';
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const invoiceDate = order.deliveredAt 
    ? new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const taxableAmount = (order.subtotal || 0) - (order.discountAmount || 0);
  const taxPercentage = taxableAmount > 0 ? Math.round(((order.taxAmount || 0) / taxableAmount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 print:bg-white print:py-0 print:m-0">
      
      {/* 🔥 CSS explicitly designed to hide the Navbar/Footer when printing */}
      <style>{`
        @media print {
          nav, footer, .sticky { display: none !important; }
          body { background-color: white !important; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Floating Action Bar (Hidden when printing via Tailwind's print:hidden) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link to="/account" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={16} /> Back to Account
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint} 
            className="flex items-center justify-center min-w-[180px] gap-2 text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-lg bg-black hover:bg-[#C5A059]"
          >
            <Printer size={16} /> Print Invoice
          </button>
        </div>
      </div>

      {/* The Actual Invoice Document */}
      <div 
        ref={invoiceRef} 
        className="max-w-4xl mx-auto bg-white p-8 sm:p-12 border border-gray-200 shadow-sm print:shadow-none print:border-none print:p-0"
      >
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-black mb-1">
              ALDAY<span className="font-light">HEALTH</span>
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">100% Natural Clinical Nutrition</p>
          </div>
          <div className="mt-6 sm:mt-0 text-left sm:text-right">
            <h2 className="text-2xl font-serif text-gray-900 mb-1 uppercase tracking-widest">Tax Invoice</h2>
            <p className="text-sm text-gray-600 font-bold"># {order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* ADDRESSES & DATES */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Billed To</h3>
            <p className="text-sm font-bold text-gray-900 mb-1">{customerName}</p>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              {order.shippingAddress?.line1}<br />
              {order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress?.state}` : ''} {order.shippingAddress?.pincode}<br />
              {order.shippingAddress?.country || 'India'}<br />
              Phone: {order.user?.phone || order.shippingAddress?.phone || 'N/A'}
            </p>
          </div>
          
          <div className="text-right">
            <div className="mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Order Date</h3>
              <p className="text-sm font-medium text-gray-900">{orderDate}</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Invoice Date</h3>
              <p className="text-sm font-medium text-gray-900">{invoiceDate}</p>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="mb-10">
          <table className="w-full text-left">
            <thead className="bg-[#FBFBFB] border-y border-gray-200">
              <tr>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Item Description</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">Qty</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Price</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td className="p-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="p-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                  <td className="p-4 text-sm text-gray-600 text-right">₹{(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-sm font-bold text-gray-900 text-right">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="flex justify-end border-t border-gray-200 pt-6">
          <div className="w-full sm:w-1/2 lg:w-1/3">
            
            {/* Subtotal */}
            <div className="flex justify-between mb-3 text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>₹{(order.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            
            {/* Discount */}
            {order.discountAmount > 0 && (
              <div className="flex justify-between mb-3 text-sm text-green-600 font-medium">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                <span>- ₹{(order.discountAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {/* Taxes */}
            {order.taxAmount > 0 && (
              <div className="flex justify-between mb-3 text-sm text-gray-600">
                <span>Estimated Tax {taxPercentage > 0 ? `(${taxPercentage}%)` : ''}:</span>
                <span>₹{(order.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            
            {/* Shipping */}
            <div className="flex justify-between mb-3 text-sm text-gray-600">
              <span>Shipping:</span>
              <span>{order.shippingCharge > 0 ? `₹${(order.shippingCharge).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Free'}</span>
            </div>
            
            {/* Grand Total */}
            <div className="flex justify-between py-4 mt-2 border-t border-black text-lg font-black text-gray-900">
              <span>Grand Total:</span>
              <span>₹{(order.totalAmount || order.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 font-light mb-1">Thank you for choosing Alday Health.</p>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">If you have any questions, please contact support@aldayhealth.com</p>
        </div>

      </div>
    </div>
  );
};

export default Invoice;