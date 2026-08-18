import React from 'react';
import { motion } from 'motion/react';

interface SkeletonPulseProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base pulsing skeleton element powered by Framer Motion.
 * Smoothly pulses opacity between 0.35 and 0.85 to indicate loading.
 */
export const SkeletonPulse: React.FC<SkeletonPulseProps> = ({ className = '', style }) => {
  return (
    <motion.div
      animate={{ opacity: [0.35, 0.85, 0.35] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`bg-slate-200 dark:bg-slate-800 ${className}`}
      style={style}
    />
  );
};

/**
 * Product Card Skeleton mirroring the exact dimensions and layout of the marketplace product cards.
 */
export const ProductCardSkeleton: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <div
      id={id}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-xs"
    >
      {/* Aspect square image placeholder */}
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
        <SkeletonPulse className="w-full h-full" />
        {/* Floating badge skeleton */}
        <div className="absolute top-2.5 left-2.5">
          <SkeletonPulse className="w-12 h-4 rounded-md" />
        </div>
        {/* Wishlist icon placeholder */}
        <div className="absolute top-2.5 right-2.5">
          <SkeletonPulse className="w-7 h-7 rounded-full" />
        </div>
        {/* Rating badge placeholder */}
        <div className="absolute bottom-2.5 left-2.5">
          <SkeletonPulse className="w-14 h-4 rounded-md" />
        </div>
      </div>

      {/* Info & Add to Cart */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Store name line */}
          <SkeletonPulse className="w-24 h-2.5 rounded-full" />
          {/* Product name lines */}
          <SkeletonPulse className="w-full h-3.5 rounded-md" />
          <SkeletonPulse className="w-3/4 h-3.5 rounded-md" />
        </div>

        {/* Footer price and add button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <SkeletonPulse className="w-20 h-4 rounded-md" />
            <SkeletonPulse className="w-12 h-2.5 rounded-md" />
          </div>
          <SkeletonPulse className="w-8 h-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Store Card Skeleton mirroring the verified merchant profile cards.
 */
export const StoreCardSkeleton: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <div
      id={id}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-xs"
    >
      {/* Banner & Logo area */}
      <div className="relative h-24 bg-slate-100 dark:bg-slate-800">
        <SkeletonPulse className="w-full h-full" />
        <div className="absolute -bottom-3 left-3">
          <SkeletonPulse className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-900 shadow-md" />
        </div>
      </div>

      {/* Store details */}
      <div className="p-4 pt-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SkeletonPulse className="w-28 h-4 rounded-md" />
            <SkeletonPulse className="w-4 h-4 rounded-full" />
          </div>
          <SkeletonPulse className="w-full h-3 rounded-md" />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <SkeletonPulse className="w-20 h-3 rounded-md" />
          <SkeletonPulse className="w-14 h-3 rounded-md" />
        </div>
      </div>
    </div>
  );
};

/**
 * Category Item Skeleton mirroring the circular/icon category buttons.
 */
export const CategoryItemSkeleton: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <div
      id={id}
      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2 text-center shadow-xs"
    >
      <SkeletonPulse className="w-12 h-12 rounded-xl" />
      <SkeletonPulse className="w-16 h-3 rounded-md mt-1" />
      <SkeletonPulse className="w-10 h-2 rounded-md" />
    </div>
  );
};

/**
 * Trust Highlights Skeleton.
 */
export const TrustHighlightsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="trust-skeleton-grid">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs"
        >
          <SkeletonPulse className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5 flex-1">
            <SkeletonPulse className="w-24 h-3.5 rounded-md" />
            <SkeletonPulse className="w-36 h-2.5 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Hero Banner Skeleton.
 */
export const HeroBannerSkeleton: React.FC = () => {
  return (
    <div
      id="hero-banner-skeleton"
      className="relative rounded-3xl bg-slate-900 p-6 sm:p-10 overflow-hidden shadow-xl border border-slate-800"
    >
      <div className="max-w-2xl space-y-4">
        {/* Pill badge */}
        <SkeletonPulse className="w-48 h-6 rounded-full bg-slate-800" />
        {/* Headline */}
        <div className="space-y-2 pt-2">
          <SkeletonPulse className="w-3/4 h-8 sm:h-10 rounded-xl bg-slate-800" />
          <SkeletonPulse className="w-1/2 h-8 sm:h-10 rounded-xl bg-slate-800" />
        </div>
        {/* Paragraph */}
        <div className="space-y-1.5 pt-1">
          <SkeletonPulse className="w-full max-w-lg h-3.5 rounded-md bg-slate-800" />
          <SkeletonPulse className="w-4/5 max-w-md h-3.5 rounded-md bg-slate-800" />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-3">
          <SkeletonPulse className="w-36 h-11 rounded-xl bg-slate-800" />
          <SkeletonPulse className="w-32 h-11 rounded-xl bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

/**
 * Full BuyerHome Skeleton that exactly mirrors the real BuyerHome layout.
 */
export const BuyerHomeSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 pb-12"
      id="buyer-home-skeleton"
    >
      {/* 1. Hero Banner Skeleton */}
      <HeroBannerSkeleton />

      {/* 2. Trust Highlights Bar Skeleton */}
      <TrustHighlightsSkeleton />

      {/* 3. Categories Grid Skeleton */}
      <section className="space-y-3.5" id="categories-skeleton-section">
        <div className="flex items-center justify-between">
          <SkeletonPulse className="w-28 h-5 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CategoryItemSkeleton key={i} id={`cat-skeleton-${i}`} />
          ))}
        </div>
      </section>

      {/* 4. Verified Stores Spotlight Skeleton */}
      <section className="space-y-3.5" id="stores-skeleton-section">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="w-36 h-5 rounded-md" />
          <SkeletonPulse className="w-16 h-4 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StoreCardSkeleton key={i} id={`store-skeleton-${i}`} />
          ))}
        </div>
      </section>

      {/* 5. Popular Products Grid Skeleton */}
      <section className="space-y-4" id="products-skeleton-section">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <SkeletonPulse className="w-40 h-5 rounded-md" />
            <SkeletonPulse className="w-56 h-3 rounded-md" />
          </div>
          <SkeletonPulse className="w-20 h-4 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} id={`product-skeleton-${i}`} />
          ))}
        </div>
      </section>

      {/* 6. Haiti Payments Callout Skeleton */}
      <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 w-full sm:w-2/3">
          <SkeletonPulse className="w-32 h-3 rounded-full bg-slate-800" />
          <SkeletonPulse className="w-3/4 h-5 rounded-md bg-slate-800" />
          <SkeletonPulse className="w-full h-3 rounded-md bg-slate-800" />
        </div>
        <div className="flex gap-3">
          <SkeletonPulse className="w-28 h-9 rounded-xl bg-slate-800" />
          <SkeletonPulse className="w-28 h-9 rounded-xl bg-slate-800" />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Search and Filter View Skeleton mirroring the search header, filters bar, and results grid.
 */
export const SearchAndFilterSkeleton: React.FC<{ activeTab?: 'products' | 'stores' }> = ({
  activeTab = 'products',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-12"
      id="search-filter-skeleton"
    >
      {/* Search Header Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Main Search Input Skeleton */}
        <SkeletonPulse className="w-full h-12 rounded-2xl" />

        {/* Tab switcher buttons skeleton */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-2">
            <SkeletonPulse className="w-28 h-8 rounded-xl" />
            <SkeletonPulse className="w-28 h-8 rounded-xl" />
          </div>
          <SkeletonPulse className="w-20 h-4 rounded-md" />
        </div>

        {/* Filter controls row skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div>
            <SkeletonPulse className="w-16 h-2.5 rounded-md mb-1.5" />
            <SkeletonPulse className="w-full h-9 rounded-xl" />
          </div>
          <div>
            <SkeletonPulse className="w-20 h-2.5 rounded-md mb-1.5" />
            <SkeletonPulse className="w-full h-9 rounded-xl" />
          </div>
          <div>
            <SkeletonPulse className="w-14 h-2.5 rounded-md mb-1.5" />
            <SkeletonPulse className="w-full h-9 rounded-xl" />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <SkeletonPulse className="w-28 h-4 rounded-md" />
            <SkeletonPulse className="w-32 h-4 rounded-md" />
          </div>
        </div>
      </div>

      {/* Results grid skeleton */}
      {activeTab === 'products' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" id="search-products-skeleton-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} id={`search-prod-skeleton-${i}`} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="search-stores-skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <StoreCardSkeleton key={i} id={`search-store-skeleton-${i}`} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Store Profile View Skeleton.
 */
export const StoreProfileSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-12"
      id="store-profile-skeleton"
    >
      {/* Back button */}
      <SkeletonPulse className="w-24 h-5 rounded-md" />

      {/* Store Banner & Profile Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="h-44 sm:h-56 bg-slate-100 dark:bg-slate-800">
          <SkeletonPulse className="w-full h-full" />
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            <SkeletonPulse className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg" />
            <div className="flex gap-2">
              <SkeletonPulse className="w-28 h-10 rounded-xl" />
              <SkeletonPulse className="w-28 h-10 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <SkeletonPulse className="w-48 h-6 rounded-md" />
            <SkeletonPulse className="w-full max-w-md h-3.5 rounded-md" />
            <div className="flex gap-4 pt-1">
              <SkeletonPulse className="w-24 h-4 rounded-md" />
              <SkeletonPulse className="w-24 h-4 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <SkeletonPulse className="w-36 h-5 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
