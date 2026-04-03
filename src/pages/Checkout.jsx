import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance'; // 1. Import our secure API instance
import {
    ChevronLeft, MapPin, CreditCard, ShieldCheck,
    Lock, ArrowRight, AlertCircle, Loader2
} from 'lucide-react';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ROUTE PROTECTION
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // States
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null); // 2. Added error state

    // Form States
    const [coupon, setCoupon] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [shippingDetails, setShippingDetails] = useState({
        firstName: user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || user?.fullName?.split(' ')[1] || '',
        address: '',
        city: '',
        pincode: '',
        phone: user?.phone || ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    // Calculations
    const subtotal = getCartTotal();
    const discountAmount = (subtotal * appliedDiscount) / 100;
    const shipping = subtotal > 999 ? 0 : 150;
    const tax = (subtotal - discountAmount) * 0.18;
    const total = subtotal - discountAmount + shipping + tax;

    // Handlers
    const handleInputChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const applyCoupon = () => {
        if (coupon.toUpperCase() === "ALDAY10") {
            setAppliedDiscount(10); // 10% Off
            setCheckoutError(null);
        } else {
            setCheckoutError("Invalid Coupon Code. Try ALDAY10");
        }
    };

    // 3. REAL API INTEGRATION FOR FINAL ORDER
    const handleFinalOrder = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setCheckoutError(null);

        try {
            // Format the address into a single string if your backend prefers it, 
            // or pass it as an object based on your specific backend schema.
            const fullAddress = `${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pincode}`;

            const orderPayload = {
                shippingAddress: fullAddress,
                phone: shippingDetails.phone,
                paymentMethod: paymentMethod,
                totalAmount: total,
                // Note: The backend usually pulls the items directly from the user's active Cart in the DB.
                // If your backend specifically requires the items array in the order payload, uncomment below:
                // items: cartItems.map(item => ({ product: item._id, quantity: item.quantity }))
            };

            // Call the Order API Endpoint (Adjust '/orders' if your Swagger doc uses '/order/create' etc.)
            await API.post('/orders', orderPayload);

            // Once the order is successfully created on the server, clear the cart
            if (typeof clearCart === 'function') {
                await clearCart(); // Ensure this awaits the API.delete('/cart/clear') we set up earlier
            }
            
            // Redirect to success page
            navigate('/order-success'); 

        } catch (error) {
            console.error("Order Creation Error:", error);
            setCheckoutError(
                error.response?.data?.message || 
                "There was an issue processing your order. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // If cart is empty, show empty state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest text-black">Your cart is empty</h2>
                <Link to="/view-all" className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all rounded-sm">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#FBFBFB] min-h-screen font-sans text-gray-900 pb-20">
            <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-40">
                <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold tracking-widest text-black">
                        ALDAY<span className="font-light">HEALTH</span>
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        <Lock size={12} className="text-green-600" /> Secure SSL Checkout
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                <div className="flex-1 space-y-8">
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-6 mb-12">
                        <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 1 ? 'border-black bg-black text-white' : 'border-gray-200'}`}>01</span>
                            Shipping
                        </div>
                        <div className="h-[1px] flex-1 bg-gray-200 max-w-[100px]"></div>
                        <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 2 ? 'border-black bg-black text-white' : 'border-gray-200'}`}>02</span>
                            Payment
                        </div>
                    </div>

                    {/* Global Error Display */}
                    {checkoutError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-sm text-sm font-medium flex items-center gap-3 animate-fade-in">
                            <AlertCircle size={18} />
                            {checkoutError}
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="animate-fade-in-up">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                                <MapPin size={22} className="text-[#C5A059]" /> Delivery Information
                            </h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">First Name</label>
                                    <input type="text" name="firstName" value={shippingDetails.firstName} onChange={handleInputChange} className="w-full border border-gray-200 p-3.5 rounded-sm text-sm focus:border-black outline-none transition-colors" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Last Name</label>
                                    <input type="text" name="lastName" value={shippingDetails.lastName} onChange={handleInputChange} className="w-full border border-gray-200 p-3.5 rounded-sm text-sm focus:border-black outline-none transition-colors" required />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Street Address</label>
                                    <input type="text" name="address" placeholder="House No, Street, Landmark" value={shippingDetails.address} onChange={handleInputChange} className="w-full border border-gray-200 p-3.5 rounded-sm text-sm focus:border-black outline-none transition-colors" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">City</label>
                                    <input type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full border border-gray-200 p-3.5 rounded-sm text-sm focus:border-black outline-none transition-colors" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Pincode</label>
                                    <input type="text" name="pincode" value={shippingDetails.pincode} maxLength="6" onChange={handleInputChange} className="w-full border border-gray-200 p-3.5 rounded-sm text-sm focus:border-black outline-none transition-colors" required />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Mobile Number</label>
                                    <input type="tel" name="phone" value={shippingDetails.phone} onChange={handleInputChange} className="w-full border border-gray-200 p-3.5 rounded-sm text-sm focus:border-black outline-none transition-colors" required />
                                </div>

                                <button type="submit" className="md:col-span-2 bg-black text-white py-4 font-bold uppercase tracking-[0.2em] text-xs mt-6 hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10">
                                    Proceed to Payment <ArrowRight size={16} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mb-6 text-gray-400 hover:text-black transition-colors">
                                <ChevronLeft size={14} /> Back to Shipping
                            </button>
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                                <CreditCard size={22} className="text-[#C5A059]" /> Choose Payment Method
                            </h2>

                            <div className="space-y-4">
                                {['card', 'upi', 'cod'].map((method) => (
                                    <label key={method} className={`flex items-center justify-between p-5 border rounded-sm cursor-pointer transition-all ${paymentMethod === method ? 'border-black bg-white ring-1 ring-black' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === method ? 'border-black' : 'border-gray-300'}`}>
                                                {paymentMethod === method && <div className="w-2 h-2 bg-black rounded-full"></div>}
                                            </div>
                                            <input type="radio" name="pay" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                {method === 'card' && 'Credit / Debit Card'}
                                                {method === 'upi' && 'UPI Instant Payment'}
                                                {method === 'cod' && 'Cash on Delivery (+₹49 Fee)'}
                                            </span>
                                        </div>
                                    </label>
                                ))}

                                {paymentMethod === 'card' && (
                                    <div className="p-6 bg-gray-50 border border-gray-100 space-y-4 animate-fade-in-up mt-2">
                                        <input type="text" placeholder="Card Number" className="w-full border border-gray-200 p-3.5 rounded-sm text-sm outline-none focus:border-black bg-white" />
                                        <div className="flex gap-4">
                                            <input type="text" placeholder="MM/YY" className="w-1/2 border border-gray-200 p-3.5 rounded-sm text-sm outline-none focus:border-black bg-white" />
                                            <input type="password" placeholder="CVV" className="w-1/2 border border-gray-200 p-3.5 rounded-sm text-sm outline-none focus:border-black bg-white" />
                                        </div>
                                    </div>
                                )}

                                <button
                                    disabled={isProcessing}
                                    onClick={handleFinalOrder}
                                    className="w-full bg-[#12221A] text-white py-5 font-bold uppercase tracking-[0.2em] text-xs mt-10 hover:bg-black transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? (
                                        <><Loader2 className="animate-spin" size={18} /> Processing...</>
                                    ) : (
                                        `Pay & Confirm Order • ₹${total.toLocaleString()}`
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Order Summary */}
                <div className="w-full lg:w-[420px]">
                    <div className="bg-white border border-gray-100 p-8 rounded-sm sticky top-28 shadow-sm">
                        <h3 className="font-bold uppercase tracking-[0.2em] text-xs mb-8 border-b border-gray-50 pb-4">Order Summary ({cartItems.length})</h3>

                        <div className="max-h-[300px] overflow-y-auto pr-3 mb-8 space-y-5 custom-scrollbar">
                            {cartItems.map((item, index) => {
                                // Fallback for ID and Image mapping depending on how the backend returns items
                                const itemId = item._id || item.id || index;
                                const itemImg = item.image || item.productId?.image;
                                const itemName = item.name || item.productId?.name;
                                const itemPrice = item.price || item.productId?.price || 0;

                                return (
                                <div key={itemId} className="flex gap-4 group">
                                    <div className="w-16 h-20 bg-[#F9F9F9] flex-shrink-0 p-2 rounded-sm">
                                        <img src={itemImg} alt={itemName} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold text-black uppercase leading-tight line-clamp-2">{itemName}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-medium mt-1 tracking-widest">Qty: {item.quantity}</p>
                                        <p className="text-xs font-bold mt-2 text-black tracking-tight">₹{(itemPrice * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            )})}
                        </div>

                        <div className="flex gap-2 mb-8 bg-gray-50 p-2 rounded-sm">
                            <input
                                type="text"
                                placeholder="ALDAY10"
                                className="flex-1 text-[11px] font-bold bg-white border border-gray-100 px-4 py-2.5 uppercase outline-none focus:border-black"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                            />
                            <button
                                onClick={applyCoupon}
                                className="bg-black text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="space-y-4 text-xs font-medium border-b border-gray-50 pb-6">
                            <div className="flex justify-between text-gray-500">
                                <span className="uppercase tracking-widest">Subtotal</span>
                                <span className="text-black">₹{subtotal.toLocaleString()}</span>
                            </div>
                            {appliedDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span className="uppercase tracking-widest">Discount (10%)</span>
                                    <span>-₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-500">
                                <span className="uppercase tracking-widest">Shipping</span>
                                <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-black'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span className="uppercase tracking-widest">Estimated GST (18%)</span>
                                <span className="text-black">₹{tax.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-black text-xl pt-6 text-black">
                            <span className="uppercase tracking-tighter">Total</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>

                        <div className="mt-10 flex items-start gap-4 text-green-700 bg-green-50 p-4 rounded-sm border border-green-100/50">
                            <ShieldCheck size={24} className="flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Clinical standard protection. All data is encrypted with 256-bit security.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;