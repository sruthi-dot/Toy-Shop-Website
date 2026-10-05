import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import { CartItem, OrderReceipt } from '../data/toys';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 120;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Card Checkout' | 'Cash on Delivery (COD)'>('Card Checkout');
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price + item.variant.priceDelta) * item.quantity,
    0
  );
  const giftWrapTotal = items.reduce(
    (sum, item) => sum + (item.giftWrap ? 6 * item.quantity : 0),
    0
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12;
  const total = subtotal + giftWrapTotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('Please complete all recipient and delivery fields to verify your dispatch.');
      return;
    }
    setFormError('');

    const generatedOrderNum = `KK-${Math.floor(1040 + Math.random() * 8900)}`;
    const newReceipt: OrderReceipt = {
      orderNumber: generatedOrderNum,
      placedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      items: [...items],
      subtotal,
      shipping,
      giftWrapTotal,
      total,
    };

    setReceipt(newReceipt);
    setStep('confirmed');
    onClearCart();
  };

  const resetAndClose = () => {
    setStep('cart');
    setFormError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
      onClick={resetAndClose}
    >
      <div
        className="relative w-full max-w-md bg-[#F9FAF8] h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200/90 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {step === 'cart' && 'Atelier Dispatch Bag'}
              {step === 'checkout' && 'Delivery & Verification'}
              {step === 'confirmed' && 'Dispatch Confirmed'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 'cart' &&
                (amountToFreeShipping > 0
                  ? `Add $${amountToFreeShipping.toFixed(2)} more for complimentary courier delivery`
                  : 'Complimentary insured courier shipping unlocked')}
              {step === 'checkout' && 'Insured wooden crate & carbon-neutral parcel delivery'}
              {step === 'confirmed' && `Reference ${receipt?.orderNumber} · Preparing in workshop`}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close bag drawer"
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {step === 'cart' && items.length > 0 && (
          <div className="px-6 py-2.5 bg-[#F1F3EF] border-b border-slate-200/80">
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1D4ED8] transition-all duration-200"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-[#F1F3EF] flex items-center justify-center text-slate-500 mb-4">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Your Atelier Bag is Empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                    Explore our small-batch beechwood trains, architectural block sets, and kinetic kits crafted for enduring play.
                  </p>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="mt-6 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors"
                  >
                    Browse Featured Collection
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item, idx) => {
                    const itemUnit = item.product.price + item.variant.priceDelta;
                    return (
                      <li
                        key={`${item.product.id}-${item.variant.id}-${idx}`}
                        className="p-4 rounded-xl bg-white border border-slate-200/80 flex gap-4"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F1F3EF] shrink-0 border border-slate-200/60">
                          <ResilientImage
                            src={item.product.image}
                            alt={item.product.name}
                            fallbackType={item.product.fallbackType}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                              {item.product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(idx)}
                              aria-label={`Remove ${item.product.name}`}
                              className="text-slate-400 hover:text-rose-700 transition-colors p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {item.variant.name} · {item.product.ageLabel}
                          </p>
                          {item.giftWrap && (
                            <p className="text-[11px] text-amber-800 font-medium mt-1">
                              + Furoshiki Linen Wrap ($6.00/ea)
                              {item.giftNote ? ` — "${item.giftNote}"` : ''}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-[#F9FAF8]">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(idx, -1)}
                                aria-label="Decrease quantity"
                                className="w-7 h-7 flex items-center justify-center text-xs text-slate-600 hover:text-slate-950 font-mono-tabular"
                              >
                                −
                              </button>
                              <span className="w-7 text-center text-xs font-semibold font-mono-tabular text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(idx, 1)}
                                aria-label="Increase quantity"
                                className="w-7 h-7 flex items-center justify-center text-xs text-slate-600 hover:text-slate-950 font-mono-tabular"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 font-mono-tabular">
                              ${((itemUnit + (item.giftWrap ? 6 : 0)) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="atelier-checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Clara Lindqvist"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Courier Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-mono-tabular focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address & Apartment
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Evergreen Terrace, Suite 3B"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10012"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-mono-tabular focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Card Checkout', 'Cash on Delivery (COD)'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors ${
                        paymentMethod === method
                          ? 'border-[#1D4ED8] bg-[#1D4ED8]/5 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  All shipments include a 30-day heirloom inspection guarantee and lifetime spare wooden parts support.
                </p>
              </div>
            </form>
          )}

          {step === 'confirmed' && receipt && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <p className="font-semibold text-sm">
                    Order #{receipt.orderNumber} Confirmed — Preparing Shipment
                  </p>
                  <p className="mt-1 text-emerald-800">
                    Dispatched to {receipt.customerName} at {receipt.address} ({receipt.postalCode}).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3 text-xs">
                <div className="flex justify-between text-slate-500 border-b border-slate-100 pb-2">
                  <span>Order Date</span>
                  <span className="font-mono-tabular text-slate-800">{receipt.placedAt}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-b border-slate-100 pb-2">
                  <span>Payment Terms</span>
                  <span className="font-semibold text-slate-800">{receipt.paymentMethod}</span>
                </div>
                <div className="space-y-2 pt-1">
                  <p className="font-semibold text-slate-700">Itemized Manifest</p>
                  {receipt.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-slate-700">
                      <span className="truncate pr-2">
                        {item.quantity}× {item.product.name} ({item.variant.name})
                      </span>
                      <span className="font-mono-tabular shrink-0">
                        ${((item.product.price + item.variant.priceDelta) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-semibold text-slate-900">
                  <span>Total Settled</span>
                  <span className="font-mono-tabular">${receipt.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Drawer Footer Summary & Actions */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-200/90 space-y-4">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono-tabular font-medium text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              {giftWrapTotal > 0 && (
                <div className="flex justify-between">
                  <span>Furoshiki Linen Gift Wrapping</span>
                  <span className="font-mono-tabular font-medium text-slate-900">${giftWrapTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Courier Shipping</span>
                <span className="font-mono-tabular font-medium text-slate-900">
                  {shipping === 0 ? 'Complimentary ($0.00)' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-semibold text-slate-900">
                <span>Total Due</span>
                <span className="font-mono-tabular">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Proceed to Delivery Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="atelier-checkout-form"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Confirm Dispatch · ${total.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 bg-white border-t border-slate-200/90">
            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Return to Kith & Kin Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
