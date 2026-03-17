// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle, ShoppingBag, Truck, CreditCard, Banknote } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { createOrder } from '@/lib/actions';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, etc.' },
  { id: 'jazzcash', label: 'JazzCash', icon: CreditCard, desc: 'Mobile wallet' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: CreditCard, desc: 'Mobile wallet' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [address, setAddress] = useState({
    name: user?.name || '',
    street: '', city: '', state: '', country: 'Pakistan', zip: '', phone: '',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress(a => ({ ...a, [key]: e.target.value }));

  const total = totalPrice();
  const shipping = total >= 5000 ? 0 : 250;
  const grandTotal = total + shipping;

  const handlePlaceOrder = async () => {
    if (!user) { router.push('/auth/login'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    if (!address.street || !address.city || !address.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setPlacing(true);
    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price || 0,
      }));

      const order = await createOrder(orderItems, address, paymentMethod);
      clearCart();
      setOrderId(order.id);
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Order placement failed');
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-3">Order Placed!</h2>
          <p className="text-gray-500 mb-2">Your order has been received and confirmed.</p>
          <p className="font-mono text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-xl inline-block mb-8">
            Order #{orderId.slice(0, 8).toUpperCase()}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="btn-primary flex items-center justify-center gap-2 rounded-2xl py-3.5">
              <ShoppingBag className="w-5 h-5" /> Track Your Order
            </Link>
            <Link href="/products" className="btn-secondary flex items-center justify-center gap-2 rounded-2xl py-3.5">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">Cart is empty</h3>
          <Link href="/products" className="btn-primary inline-flex rounded-2xl px-6 py-3 mt-4 text-sm">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4 flex items-center gap-4">
          <Link href="/cart" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-2xl text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-display font-bold text-xl text-gray-900">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input type="text" value={address.name} onChange={set('name')} placeholder="Ahmed Khan" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" value={address.phone} onChange={set('phone')} placeholder="+92 300 1234567" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input type="text" value={address.city} onChange={set('city')} placeholder="Karachi" className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                  <input type="text" value={address.street} onChange={set('street')} placeholder="House #123, Street 45, Block A" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Province/State</label>
                  <input type="text" value={address.state} onChange={set('state')} placeholder="Sindh" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                  <input type="text" value={address.zip} onChange={set('zip')} placeholder="75000" className="input-field" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="font-display font-bold text-xl text-gray-900">Payment Method</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all',
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200'
                    )}
                  >
                    <method.icon className={cn('w-5 h-5 shrink-0', paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400')} />
                    <div>
                      <p className={cn('text-sm font-bold', paymentMethod === method.id ? 'text-blue-900' : 'text-gray-900')}>
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-20">
              <h2 className="font-display font-bold text-xl text-gray-900 mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={item.products?.images?.[0] || ''}
                        alt={item.products?.name || ''}
                        fill className="object-cover" sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.products?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 shrink-0">
                      {formatPrice((item.products?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-xl shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                ) : (
                  <><CheckCircle className="w-5 h-5" /> Place Order ({formatPrice(grandTotal)})</>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                By placing your order, you agree to our Terms & Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
