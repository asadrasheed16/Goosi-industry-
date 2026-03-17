// lib/utils/unsplash.ts

export interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string; thumb: string };
  alt_description: string;
  user: { name: string };
  links: { html: string };
}

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const BASE_URL = 'https://api.unsplash.com';

// Sports keyword mapping for better image results
const SPORTS_KEYWORDS: Record<string, string> = {
  cricket: 'cricket sport bat ball',
  football: 'football soccer ball sport',
  boxing: 'boxing gloves sport fight',
  badminton: 'badminton racket shuttlecock',
  tennis: 'tennis racket ball court',
  fitness: 'gym fitness weights training',
  swimming: 'swimming pool sport athlete',
  running: 'running shoes athlete marathon',
  basketball: 'basketball court sport',
  volleyball: 'volleyball sport beach',
};

export async function fetchProductImages(
  productName: string,
  category: string,
  count = 4
): Promise<string[]> {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your_unsplash_access_key') {
    // Fallback curated sports images when no API key
    return getFallbackImages(category, count);
  }

  try {
    const keyword = SPORTS_KEYWORDS[category] || category;
    const query = `${productName} ${keyword}`;

    const response = await fetch(
      `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&content_filter=high`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) throw new Error('Unsplash API error');

    const data = await response.json();
    return data.results.map((photo: UnsplashPhoto) => photo.urls.regular);
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return getFallbackImages(category, count);
  }
}

// Curated fallback images per category (always works, no API needed)
const FALLBACK_IMAGES: Record<string, string[]> = {
  cricket: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    'https://images.unsplash.com/photo-1578763363228-6e8428de69b2?w=800&q=80',
    'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80',
  ],
  football: [
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    'https://images.unsplash.com/photo-1611200945029-aaaba2bfb2a0?w=800&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  ],
  boxing: [
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80',
    'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80',
    'https://images.unsplash.com/photo-1601994114032-e7d10b3f3bac?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  ],
  badminton: [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80',
    'https://images.unsplash.com/photo-1617083277963-f3236e5b4921?w=800&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
  ],
  tennis: [
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    'https://images.unsplash.com/photo-1562552476-8ac59b2a2e46?w=800&q=80',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
  ],
  swimming: [
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
    'https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=800&q=80',
    'https://images.unsplash.com/photo-1603138403919-1b1e3e08a724?w=800&q=80',
  ],
  running: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  ],
  basketball: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800&q=80',
    'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&q=80',
    'https://images.unsplash.com/photo-1581608006219-b72be45bf21d?w=800&q=80',
  ],
  volleyball: [
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
    'https://images.unsplash.com/photo-1547499023-01d5af5bce9e?w=800&q=80',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
    'https://images.unsplash.com/photo-1592009308141-cf4ba8a5dc37?w=800&q=80',
  ],
};

export function getFallbackImages(category: string, count = 4): string[] {
  const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.cricket;
  return images.slice(0, count);
}
