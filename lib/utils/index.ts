// lib/utils/index.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'PKR'): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function generateSku(): string {
  return 'GI-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export const CATEGORIES = [
  { id: 'cricket', label: 'Cricket', icon: '🏏', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
  { id: 'football', label: 'Football', icon: '⚽', color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50' },
  { id: 'boxing', label: 'Boxing', icon: '🥊', color: 'from-red-500 to-rose-600', bg: 'bg-red-50' },
  { id: 'badminton', label: 'Badminton', icon: '🏸', color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-50' },
  { id: 'tennis', label: 'Tennis', icon: '🎾', color: 'from-lime-500 to-green-600', bg: 'bg-lime-50' },
  { id: 'fitness', label: 'Fitness', icon: '💪', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50' },
  { id: 'swimming', label: 'Swimming', icon: '🏊', color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-50' },
  { id: 'running', label: 'Running', icon: '🏃', color: 'from-orange-500 to-red-600', bg: 'bg-orange-50' },
  { id: 'basketball', label: 'Basketball', icon: '🏀', color: 'from-orange-400 to-amber-600', bg: 'bg-amber-50' },
  { id: 'volleyball', label: 'Volleyball', icon: '🏐', color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50' },
] as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};
