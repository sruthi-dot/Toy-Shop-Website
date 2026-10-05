import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Package, Ruler, Compass } from 'lucide-react';
import { ToyProduct, ProductVariant } from '../data/toys';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: ToyProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: ToyProduct,
    variant: ProductVariant,
    quantity: number,
    giftWrap: boolean,
    giftNote?: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [giftWrap, setGiftWrap] = useState<boolean>(false);
  const [giftNote, setGiftNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'included'>('overview');
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const unitPrice = product.price + selectedVariant.priceDelta;
  const giftWrapFee = giftWrap ? 6 : 0;
  const totalPrice = unitPrice * quantity + giftWrapFee;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity, giftWrap, giftNote.trim() || undefined);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#F9FAF8] border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-white transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Sticky Gallery & Craftsmanship Proof */}
        <div className="lg:w-1/2 bg-[#F1F3EF] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80">
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-white border border-slate-200/60">
            <ResilientImage
              src={product.image}
              alt={product.name}
              fallbackType={product.fallbackType}
              title={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <p className="text-slate-400 font-medium">Origin Workshop</p>
              <p className="text-slate-800 font-semibold mt-0.5">{product.origin}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Safety Certification</p>
              <p className="text-slate-800 font-semibold mt-0.5">{product.safetyStandard}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-400 font-medium">Developmental Focus</p>
              <p className="text-slate-700 mt-0.5">
                {product.playSkills.join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.ageLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">SKU {product.sku}</span>
              <span aria-hidden="true">·</span>
              <span className={product.stockStatus === 'Limited Batch' ? 'text-amber-800 font-semibold' : 'text-emerald-800 font-semibold'}>
                {product.stockStatus} ({product.stockCount} available)
              </span>
            </div>

            {/* Product Title & Price */}
            <div className="mt-2 flex items-baseline justify-between gap-4">
              <h2
                id="pdp-modal-title"
                className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {product.name}
              </h2>
              <span className="text-2xl font-semibold text-slate-900 font-mono-tabular shrink-0">
                ${unitPrice.toFixed(2)}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-slate-600">
              {product.subtitle}
            </p>

            {/* Segmented Content Tabs */}
            <div className="mt-6 flex items-center gap-1 p-1 bg-[#F1F3EF] rounded-lg border border-slate-200/70">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Atelier Notes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap ${
                  activeTab === 'specs'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Materials & Dimensions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('included')}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap ${
                  activeTab === 'included'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In the Box ({product.includedItems.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="mt-4 min-h-[124px] text-sm text-slate-700 leading-relaxed">
              {activeTab === 'overview' && (
                <p>{product.description}</p>
              )}
              {activeTab === 'specs' && (
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-200/70 gap-4">
                    <dt className="text-slate-500 shrink-0">Raw Materials</dt>
                    <dd className="text-slate-800 text-right font-medium">{product.materials}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/70 gap-4">
                    <dt className="text-slate-500 shrink-0">Dimensions</dt>
                    <dd className="text-slate-800 text-right font-mono-tabular">{product.dimensions}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/70 gap-4">
                    <dt className="text-slate-500 shrink-0">Net Weight</dt>
                    <dd className="text-slate-800 text-right font-mono-tabular">{product.weight}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 gap-4">
                    <dt className="text-slate-500 shrink-0">Care & Longevity</dt>
                    <dd className="text-slate-800 text-right">{product.careInstructions}</dd>
                  </div>
                </dl>
              )}
              {activeTab === 'included' && (
                <ul className="space-y-2 text-xs text-slate-700">
                  {product.includedItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 py-1 border-b border-slate-200/60 last:border-b-0">
                      <span className="font-mono-tabular text-slate-400">0{idx + 1}.</span>
                      <span className="font-medium text-slate-800">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Variant Selection */}
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Edition / Timber Finish
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`text-left p-3 rounded-xl border transition-colors duration-150 ${
                        isSelected
                          ? 'border-[#1D4ED8] bg-[#1D4ED8]/5 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate">{variant.name}</span>
                        <span className="text-xs font-mono-tabular text-slate-600 shrink-0">
                          {variant.priceDelta === 0
                            ? 'Included'
                            : variant.priceDelta > 0
                            ? `+$${variant.priceDelta}`
                            : `-$${Math.abs(variant.priceDelta)}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{variant.finishNote}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Heirloom Linen Gift Wrap Option */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#F1F3EF] border border-slate-200/80">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      Add Furoshiki Organic Linen Gift Wrap & Wax-Sealed Note
                    </span>
                    <span className="font-mono-tabular font-semibold text-slate-700">+$6.00</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Reusable botanical-dyed wrapping cloth with handwritten calligraphy card.
                  </p>
                </div>
              </label>

              {giftWrap && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write your gift message (e.g., Happy 4th Birthday, Leo!)..."
                    maxLength={120}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Primary Purchase Action Row */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-300 rounded-xl bg-white h-11">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-slate-950 font-mono-tabular"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold font-mono-tabular text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                aria-label="Increase quantity"
                className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-slate-950 font-mono-tabular"
              >
                +
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 h-11 px-6 rounded-xl text-sm font-semibold text-white transition-all duration-150 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                justAdded
                  ? 'bg-emerald-700'
                  : 'bg-[#1D4ED8] hover:bg-[#1E40AF]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Atelier Bag · ${totalPrice.toFixed(2)}</span>
                </>
              ) : (
                <span>Add to Atelier Bag · ${totalPrice.toFixed(2)}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
