/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  ArrowRight,
  Check,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  TOY_CATALOG,
  HERO_IMAGE,
  ToyProduct,
  ProductVariant,
  CartItem,
  AgeGroup,
  ToyCategory,
} from './data/toys';
import { ResilientImage } from './components/ResilientImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { GiftFinderModal } from './components/GiftFinderModal';

export default function App() {
  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<ToyCategory>('all');
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modals & Drawers State
  const [activeProduct, setActiveProduct] = useState<ToyProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isGiftFinderOpen, setIsGiftFinderOpen] = useState<boolean>(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Shopping Bag State (initialized with 1 iconic item so user can immediately inspect or modify cart)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: TOY_CATALOG[0],
      variant: TOY_CATALOG[0].variants[0],
      quantity: 1,
      giftWrap: false,
    },
  ]);

  // Craftsmanship interactive timber study selector
  const [activeMaterialStudy, setActiveMaterialStudy] = useState<'beech' | 'maple' | 'linen'>('beech');

  // Newsletter state in footer
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const totalBagCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return TOY_CATALOG.filter((toy) => {
      const matchesCat = selectedCategory === 'all' || toy.category === selectedCategory;
      const matchesAge = selectedAge === 'all' || toy.ageGroup === selectedAge;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        toy.name.toLowerCase().includes(q) ||
        toy.subtitle.toLowerCase().includes(q) ||
        toy.materials.toLowerCase().includes(q) ||
        toy.playSkills.some((s) => s.toLowerCase().includes(q));
      return matchesCat && matchesAge && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, selectedAge, searchQuery, sortBy]);

  // Cart Handlers
  const handleAddToCart = (
    product: ToyProduct,
    variant: ProductVariant = product.variants[0],
    quantity: number = 1,
    giftWrap: boolean = false,
    giftNote?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variant.id === variant.id &&
          item.giftWrap === giftWrap
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          giftNote: giftNote || updated[existingIndex].giftNote,
        };
        return updated;
      }
      return [...prev, { product, variant, quantity, giftWrap, giftNote }];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
    }, 1300);
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectAgeAndScroll = (age: AgeGroup) => {
    setSelectedAge(age);
    scrollToSection('collection');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8] text-slate-900">
      {/* Top Bar Contract: Strictly 1 row, 3 zones (Brand wordmark | 4-5 nav links | 2 primary actions) */}
      <header className="sticky top-0 z-40 h-16 bg-[#F9FAF8]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          Kith &amp; Kin
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('all');
              setSelectedAge('all');
              scrollToSection('collection');
            }}
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Collection
          </a>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('Wooden Architecture');
              scrollToSection('collection');
            }}
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Architecture
          </a>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('Kinetic & STEM');
              scrollToSection('collection');
            }}
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Kinetic Kits
          </a>
          <a
            href="#craftsmanship"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('craftsmanship');
            }}
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Craftsmanship
          </a>
          <a
            href="#safety-ledger"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('safety-ledger');
            }}
            className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Safety Standards
          </a>
        </nav>

        {/* Zone 3: 2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsGiftFinderOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 border border-slate-300/90 rounded-lg bg-white hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Gift Concierge
          </button>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open shopping bag with ${totalBagCount} items`}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            <span className="font-mono-tabular">({totalBagCount})</span>
          </button>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: Storefront Hero (Split-Screen Focal Anchor) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <span>Autumn / Winter Atelier Batch</span>
                <span aria-hidden="true">·</span>
                <span>Dalarna &amp; Black Forest Workshops</span>
              </div>

              <h1
                className="text-3xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                Heirloom wooden instruments for unhurried childhood play.
              </h1>

              <p className="mt-5 text-base text-slate-600 leading-relaxed max-w-[60ch]">
                Turned from sustainably harvested European steamed beech, hard rock maple, and raw brass. Zero plastic, zero synthetic varnishes, and no predetermined scripts—built to be passed down across three generations.
              </p>

              {/* Single Dominant Visual CTA + Secondary quiet action */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('collection')}
                  className="px-6 py-3.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Explore the Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsGiftFinderOpen(true)}
                  className="px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Match by Child’s Age
                </button>
              </div>

              {/* Quick Age Stage Route Bar */}
              <div className="mt-10 pt-6 border-t border-slate-200/80 w-full">
                <p className="text-xs text-slate-500 mb-2.5">
                  Filter catalog directly by developmental stage:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: '0-2', label: '0–2 yrs · Sensory & Grasp' },
                      { id: '3-5', label: '3–5 yrs · Spatial & Constructive' },
                      { id: '6-8', label: '6–8 yrs · Kinetic & Gear Logic' },
                      { id: '9+', label: '9+ yrs · Equilibrium & Physics' },
                    ] as const
                  ).map((stage) => (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleSelectAgeAndScroll(stage.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                        selectedAge === stage.id
                          ? 'border-[#1D4ED8] bg-[#1D4ED8]/10 text-[#1D4ED8] font-semibold'
                          : 'border-slate-200/90 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Image (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-[#F1F3EF] border border-slate-200/80 shadow-sm">
                <ResilientImage
                  src={HERO_IMAGE}
                  alt="Heirloom wooden train set, geometric Bauhaus stacking blocks, and botanical bear on a sunlit birch play table"
                  fallbackType="hero"
                  title="Kith & Kin Atelier Collection"
                  className="w-full h-full object-cover"
                />
                {/* Measured Scrim for Featured Callout Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                    <div>
                      <p className="text-xs text-slate-200">
                        Featured Workbench Study · Edition No. 04
                      </p>
                      <h2 className="text-lg sm:text-xl font-semibold mt-0.5">
                        Luleå Modular Beechwood Train &amp; Weimar Arch System
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveProduct(TOY_CATALOG[0])}
                      className="self-start sm:self-auto px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Inspect Flagship Set · $78
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Collection & Interactive Filter Catalog */}
        <section
          id="collection"
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 border-t border-slate-200/80"
        >
          {/* Section Header & Search/Sort Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>01. Curated Editions</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{filteredProducts.length} instruments available</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Small-Batch Play Objects &amp; Architectural Sets
              </h2>
            </div>

            {/* Search & Sort Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wood, skill, or toy..."
                  aria-label="Search toys by name, material, or skill"
                  className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200/90 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                aria-label="Sort products"
                className="px-3 py-2 text-xs font-medium bg-white border border-slate-200/90 rounded-lg text-slate-700 focus:outline-none focus:border-[#1D4ED8]"
              >
                <option value="featured">Sort: Atelier Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Interactive Segmented Filter Bar (Category + Age Stage) */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
            {/* Category Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-[#F1F3EF] rounded-xl overflow-x-auto">
              {(
                [
                  'all',
                  'Wooden Architecture',
                  'Kinetic & STEM',
                  'Soft Companions',
                  'Wooden Vehicles',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All Disciplines' : cat}
                </button>
              ))}
            </div>

            {/* Age Group Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-[#F1F3EF] rounded-xl self-start md:self-auto">
              {(['all', '0-2', '3-5', '6-8', '9+'] as const).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedAge === age
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {age === 'all' ? 'All Ages' : `${age} yrs`}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Product Grid (Uniform Aspect Ratio, Identical Field Order, Zero Pill Clutter) */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 my-8 p-8">
              <p className="text-base font-semibold text-slate-900">
                No atelier pieces match your current filter combination.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing your search term or selecting all developmental age stages.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedAge('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((toy) => {
                const isAdded = recentlyAddedId === toy.id;
                return (
                  <article
                    key={toy.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Top Image Container (4:3 uniform aspect ratio) */}
                    <div>
                      <div
                        onClick={() => setActiveProduct(toy)}
                        className="relative aspect-4/3 w-full bg-[#F1F3EF] overflow-hidden cursor-pointer border-b border-slate-100"
                      >
                        <ResilientImage
                          src={toy.image}
                          alt={toy.name}
                          fallbackType={toy.fallbackType}
                          title={toy.name}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6">
                        {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{toy.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{toy.ageLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              toy.stockStatus === 'Limited Batch'
                                ? 'text-amber-800 font-semibold'
                                : 'text-emerald-800 font-medium'
                            }
                          >
                            {toy.stockStatus}
                          </span>
                        </div>

                        {/* Product Name & Price */}
                        <div className="mt-2 flex items-baseline justify-between gap-3">
                          <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                            <button
                              type="button"
                              onClick={() => setActiveProduct(toy)}
                              className="text-left focus:outline-none cursor-pointer"
                            >
                              {toy.name}
                            </button>
                          </h3>
                          <span className="text-[15px] font-semibold text-slate-900 font-mono-tabular shrink-0">
                            ${toy.price.toFixed(2)}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {toy.subtitle}
                        </p>

                        {/* Quiet developmental skills line */}
                        <p className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 truncate">
                          Skills: {toy.playSkills.join(' / ')}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-6 pb-6 pt-0 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveProduct(toy)}
                        className="px-3.5 py-2 rounded-lg border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Specifications
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(toy, toy.variants[0], 1, false)}
                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-700'
                            : 'bg-[#1D4ED8] hover:bg-[#1E40AF]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <span>Quick Add · ${toy.price}</span>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: Craftsmanship, Material Honesty & Claim-to-Proof Adjacency */}
        <section
          id="craftsmanship"
          className="bg-[#F1F3EF] border-t border-slate-200/80 py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            {/* Editorial Narrative & Interactive Material Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>02. Material Provenance &amp; Longevity</span>
                  <span aria-hidden="true">·</span>
                  <span>EN71-3 Saliva-Safe Certified</span>
                </div>
                <h2
                  className="text-2xl sm:text-4xl font-semibold text-slate-900 mt-2 tracking-tight leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Why raw timber and unlacquered brass outlast plastic playrooms.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-[62ch]">
                  Most commercial toys seal wood beneath thick polyurethane plastic coatings that chip and mask tactile grain. In our Dalarna and Black Forest workshops, every piece is hand-sanded to 320-grit and finished solely with cold-pressed organic beeswax, plant-derived mineral pigments, and pure Belgian flax.
                </p>

                {/* Interactive Material Selector Tabs */}
                <div className="mt-8">
                  <p className="text-xs font-semibold text-slate-700 mb-2.5">
                    Inspect Raw Workshop Materials:
                  </p>
                  <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200/80 max-w-md">
                    {(
                      [
                        { id: 'beech', label: 'Steamed Beech & Walnut' },
                        { id: 'maple', label: 'Mineral-Stained Maple' },
                        { id: 'linen', label: 'OEKO-TEX Belgian Flax' },
                      ] as const
                    ).map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setActiveMaterialStudy(mat.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap truncate cursor-pointer ${
                          activeMaterialStudy === mat.id
                            ? 'bg-[#1D4ED8] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mat.label}
                      </button>
                    ))}
                  </div>

                  {/* Active Material Detail Panel */}
                  <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200/80">
                    {activeMaterialStudy === 'beech' && (
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between font-semibold text-slate-900 text-sm">
                          <span>FSC European Steamed Beechwood (Fagus sylvatica)</span>
                          <span className="font-mono-tabular text-slate-500">Janka Hardness: 1,300 lbf</span>
                        </div>
                        <p className="leading-relaxed">
                          Short-grained and naturally splinter-resistant, steamed beechwood withstands high-impact block drops without denting. Paired with raw solid brass axles that develop a warm antique patina over decades of rolling play.
                        </p>
                      </div>
                    )}
                    {activeMaterialStudy === 'maple' && (
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between font-semibold text-slate-900 text-sm">
                          <span>Hard Rock Maple &amp; Botanical Water Stains</span>
                          <span className="font-mono-tabular text-slate-500">0.0 g/L VOC Content</span>
                        </div>
                        <p className="leading-relaxed">
                          Rather than painting over wood grain, our water-based ultramarine, ochre, and sage mineral stains soak into the maple fibers. The surface retains a subtle natural friction so children can build steeper cantilevers and arches.
                        </p>
                      </div>
                    )}
                    {activeMaterialStudy === 'linen' && (
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between font-semibold text-slate-900 text-sm">
                          <span>Belgian Flax Linen &amp; Carded Alpine Sheep Wool</span>
                          <span className="font-mono-tabular text-slate-500">100% Biodegradable</span>
                        </div>
                        <p className="leading-relaxed">
                          Zero polyester stuffing or plastic safety eyes. Our soft companions are filled with pure lanolin-rich Alpine wool that regulates warmth in a child’s arms and is completely safe for teething infants.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Quantitative Proof & Attributable Testimonial (Claim-to-Proof Adjacency) */}
              <div className="lg:col-span-6 space-y-6">
                {/* Quantitative Precision Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80">
                    <p className="text-xs text-slate-500">Classroom Durability Audit</p>
                    <p className="text-3xl font-semibold text-slate-900 font-mono-tabular mt-1">
                      99.4%
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Structural joint integrity across 4,200+ wooden pieces after 36 months of daily use in 18 partner Montessori classrooms (2023–2026 study).
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80">
                    <p className="text-xs text-slate-500">Sustained Unscripted Focus</p>
                    <p className="text-3xl font-semibold text-slate-900 font-mono-tabular mt-1">
                      +42 min
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Average increase in continuous independent building sessions per afternoon compared to battery-operated plastic toys across 120 observed ages 3–6 learners.
                    </p>
                  </div>
                </div>

                {/* Attributable Educator Testimonial */}
                <blockquote className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80">
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed italic font-display">
                    “Before transitioning our spatial reasoning shelves to Kith &amp; Kin’s Weimar Arch Stacker and Luleå Beechwood Trains in September 2024, our glossy painted blocks slipped apart whenever four-year-olds attempted multi-span bridges. The raw velvet tooth of their unlacquered rock maple allowed our students to construct freestanding 14-piece Romanesque viaducts within two weeks—and not a single tenon or brass axle has loosened after two school years.”
                  </p>
                  <footer className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <cite className="not-italic font-semibold text-slate-900">
                        Ingrid Lindholm, M.Ed.
                      </cite>
                      <p className="text-slate-500">
                        Lead Early Childhood Pedagogist · Nordlys Montessori Skola, Stockholm
                      </p>
                    </div>
                    <span className="text-slate-400 font-mono-tabular">
                      Verified Classroom Partner Since 2023
                    </span>
                  </footer>
                </blockquote>
              </div>
            </div>

            {/* Safety & Developmental Sizing Reference Table (Tabular Numerals Discipline) */}
            <div id="safety-ledger" className="mt-16 pt-12 border-t border-slate-200/90">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-500">03. Pedagogical &amp; Safety Specification Matrix</p>
                  <h3 className="text-xl font-semibold text-slate-900 mt-1">
                    Age Stage Sizing, Choke-Tube Clearance &amp; Testing Ledger
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-mono-tabular">
                  Lab Protocol: EN71-1:2014+A1:2018 / ASTM F963-23
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#F9FAF8] text-slate-500 font-semibold">
                      <th className="py-3.5 px-5">Age Bracket</th>
                      <th className="py-3.5 px-5">Minimum Part Diameter</th>
                      <th className="py-3.5 px-5">Surface Finish &amp; Saliva Test</th>
                      <th className="py-3.5 px-5">Primary Developmental Milestone</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 text-slate-700">
                    <tr>
                      <td className="py-3.5 px-5 font-semibold text-slate-900 font-mono-tabular">0–2 yrs (Infant)</td>
                      <td className="py-3.5 px-5 font-mono-tabular">&ge; 44.5 mm (Zero small parts)</td>
                      <td className="py-3.5 px-5">Unbleached OEKO-TEX flax · Embroidered seams</td>
                      <td className="py-3.5 px-5">Palmar grasp, tactile bonding &amp; object permanence</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectAgeAndScroll('0-2')}
                          className="text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                        >
                          Filter 0–2 yrs
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-semibold text-slate-900 font-mono-tabular">3–5 yrs (Early Years)</td>
                      <td className="py-3.5 px-5 font-mono-tabular">&ge; 34.0 mm (EN71 Cylinder Pass)</td>
                      <td className="py-3.5 px-5">Organic beeswax &amp; zero-VOC plant mineral stain</td>
                      <td className="py-3.5 px-5">Cantilever balance, bilateral symmetry &amp; story worlds</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectAgeAndScroll('3-5')}
                          className="text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                        >
                          Filter 3–5 yrs
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-semibold text-slate-900 font-mono-tabular">6–8 yrs (Builder)</td>
                      <td className="py-3.5 px-5 font-mono-tabular">&ge; 18.5 mm (Precision arbors)</td>
                      <td className="py-3.5 px-5">Raw milled birch gears &amp; solid brushed brass</td>
                      <td className="py-3.5 px-5">Compound gear ratios, warp/weft tension &amp; astronomy</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectAgeAndScroll('6-8')}
                          className="text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                        >
                          Filter 6–8 yrs
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-semibold text-slate-900 font-mono-tabular">9+ yrs (Atelier)</td>
                      <td className="py-3.5 px-5 font-mono-tabular">&ge; 14.0 mm (Sliding weights)</td>
                      <td className="py-3.5 px-5">Steam-bent Finnish birch veneer &amp; oiled walnut</td>
                      <td className="py-3.5 px-5">Center-of-mass equilibrium &amp; harmonic oscillation</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectAgeAndScroll('9+')}
                          className="text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                        >
                          Filter 9+ yrs
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 4: Quiet Editorial Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-12 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-200/70">
          <div className="md:col-span-5">
            <span className="font-display text-lg font-semibold text-slate-900">
              Kith &amp; Kin Toy Atelier
            </span>
            <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
              Architectural wooden play instruments, kinetic kits, and organic linen companions. Crafted in small European batches with lifetime spare wooden parts support.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Showroom &amp; Repair Desk: Birger Jarlsgatan 42, Stockholm · Mon–Sat 10:00–18:00
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <p className="font-semibold text-slate-900">Catalog &amp; Services</p>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Wooden Architecture');
                    scrollToSection('collection');
                  }}
                  className="hover:text-slate-950 hover:underline cursor-pointer"
                >
                  Wooden Architecture Sets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Kinetic & STEM');
                    scrollToSection('collection');
                  }}
                  className="hover:text-slate-950 hover:underline cursor-pointer"
                >
                  Kinetic &amp; Solar Kits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsGiftFinderOpen(true)}
                  className="hover:text-slate-950 hover:underline cursor-pointer"
                >
                  Developmental Gift Concierge
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="hover:text-slate-950 hover:underline cursor-pointer"
                >
                  Furoshiki Gift Wrapping &amp; COD Checkout
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold text-slate-900">
              Seasonal Batch Dispatch Notes
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Receive notice when new numbered timber editions leave our turning lathes. Zero promotional spam.
            </p>
            {newsletterSubscribed ? (
              <p className="mt-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                Recorded — You are on the ledger for the Winter Solstice workshop release.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubscribed(true);
                    setNewsletterEmail('');
                  }
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="parent@household.org"
                  aria-label="Email address for seasonal batch notes"
                  className="flex-1 px-3 py-2 text-xs bg-[#F9FAF8] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Join Ledger
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Kith &amp; Kin Toy Atelier AB. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>FSC-C149021 Certified Timber</span>
            <span aria-hidden="true">·</span>
            <span>EN71 &amp; ASTM F963 Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Complimentary Spare Parts Forever</span>
          </div>
        </div>
      </footer>

      {/* Contiguous Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Atelier Bag & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Interactive Developmental Gift Concierge Modal */}
      <GiftFinderModal
        isOpen={isGiftFinderOpen}
        onClose={() => setIsGiftFinderOpen(false)}
        products={TOY_CATALOG}
        onSelectProduct={(toy) => setActiveProduct(toy)}
      />
    </div>
  );
}

