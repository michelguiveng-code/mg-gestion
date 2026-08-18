import { Category, Store, Product, Order, User, PlatformConfig, AuditLog, ReportItem, PickupPoint, AppNotification, ChatMessage } from '../types';

export const HAITIAN_DEPARTMENTS = [
  'Ouest',
  'Nord',
  'Nord-Est',
  'Nord-Ouest',
  'Artibonite',
  'Centre',
  'Sud',
  'Sud-Est',
  'Grand\'Anse',
  'Nippes'
];

export const HAITIAN_CITIES: Record<string, string[]> = {
  'Ouest': ['Port-au-Prince', 'Pétion-Ville', 'Delmas', 'Carrefour', 'Tabarre', 'Kenscoff', 'Cité Soleil', 'Léogâne', 'Petit-Goâve'],
  'Nord': ['Cap-Haïtien', 'Limonade', 'Plaine-du-Nord', 'Milot', 'Dondon', 'Acul-du-Nord'],
  'Artibonite': ['Gonaïves', 'Saint-Marc', 'Verrettes', 'Dessalines', 'Saint-Michel-de-l\'Attalaye'],
  'Sud': ['Les Cayes', 'Camp-Perrin', 'Torbeck', 'Port-Salut', 'Aquin', 'Cavaillon'],
  'Sud-Est': ['Jacmel', 'Marigot', 'Cayes-Jacmel', 'Bainet', 'Belle-Anse'],
  'Centre': ['Hinche', 'Mirebalais', 'Lascahobas', 'Thomassique'],
  'Nord-Est': ['Fort-Liberté', 'Ouanaminthe', 'Trou-du-Nord', 'Terrier-Rouge'],
  'Nord-Ouest': ['Port-de-Paix', 'Saint-Louis-du-Nord', 'Jean-Rabel', 'Môle-Saint-Nicolas'],
  'Grand\'Anse': ['Jérémie', 'Moron', 'Corail', 'Anse-d\'Hainault'],
  'Nippes': ['Miragoâne', 'Anse-à-Veau', 'Petite-Rivière-de-Nippes', 'Fonds-des-Nègres']
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'tech',
    nameFr: 'Téléphones & Électronique',
    nameHt: 'Telefòn & Elektwonik',
    nameEn: 'Phones & Electronics',
    icon: 'Smartphone',
    itemCount: 42,
    bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'solar',
    nameFr: 'Énergie Solaire & Inverters',
    nameHt: 'Enèji Solè & Envètè',
    nameEn: 'Solar & Inverters',
    icon: 'Zap',
    itemCount: 28,
    bannerImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fashion',
    nameFr: 'Mode & Chaussures',
    nameHt: 'Mòd & Soulye',
    nameEn: 'Fashion & Shoes',
    icon: 'ShoppingBag',
    itemCount: 86,
    bannerImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'artisanat',
    nameFr: 'Artisanat & Fè Fòje Lakay',
    nameHt: 'Atizana & Fè Fòje Lakay',
    nameEn: 'Haitian Crafts & Iron Art',
    icon: 'Palette',
    itemCount: 35,
    bannerImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'agro',
    nameFr: 'Produits Locaux & Café',
    nameHt: 'Pwodui Lokal & Kafe',
    nameEn: 'Local Produce & Coffee',
    icon: 'Coffee',
    itemCount: 19,
    bannerImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'home',
    nameFr: 'Maison & Électroménager',
    nameHt: 'Kay & Aparèy Elektwonik',
    nameEn: 'Home & Appliances',
    icon: 'Home',
    itemCount: 31,
    bannerImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'beauty',
    nameFr: 'Beauté & Soins Karayib',
    nameHt: 'Bote & Swen Po',
    nameEn: 'Beauty & Skincare',
    icon: 'Sparkles',
    itemCount: 24,
    bannerImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    sellerId: 'user-seller-1',
    name: 'TechAyiti Delmas',
    slug: 'tech-ayiti-delmas',
    slogan: 'Lidè nan teknoloji ak pyès orijinal an Ayiti',
    description: 'Boutik espesyalize nan vant telefòn smartphone, tablèt, inverters ak panèl solè. Tout pwodui gen garanti ofisyèl.',
    category: 'tech',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 128,
    followersCount: 1420,
    isVerified: true,
    phone: '+509 3782-9901',
    city: 'Delmas',
    address: 'Delmas 75, angle Rue Charlemagne Péralte #14',
    monCashNumber: '37829901',
    natCashNumber: '41209901',
    subscriptionPlan: 'PRO',
    isFeatured: true,
    totalSalesHTG: 845000,
    ordersCount: 42,
    status: 'ACTIVE',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'store-2',
    sellerId: 'user-seller-2',
    name: 'Boutik Lakay Pétion-Ville',
    slug: 'boutik-lakay-petion-ville',
    slogan: 'Elegans, mòd ak atizana 100% kreyòl',
    description: 'Nou kreye rad ak soulye atizanal ak twal bon kalite. Livrezon rapid nan tout Pétion-Ville ak Pòtoprens.',
    category: 'fashion',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 89,
    followersCount: 980,
    isVerified: true,
    phone: '+509 3611-4455',
    city: 'Pétion-Ville',
    address: 'Rue Panaméricaine, En face Complexe Promenade',
    monCashNumber: '36114455',
    natCashNumber: '42331122',
    subscriptionPlan: 'PRO',
    isFeatured: true,
    totalSalesHTG: 520000,
    ordersCount: 29,
    status: 'ACTIVE',
    createdAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'store-3',
    sellerId: 'user-seller-3',
    name: 'Solèy Ayiti Enèji',
    slug: 'soley-ayiti-eneji',
    slogan: 'Kouran 24/24 pou kay ou ak biznis ou',
    description: 'Enstalasyon ak vant sistèm solè konplè, batri ityòm lifepo4, envètè hibrid 1.5kVa rive 10kVa.',
    category: 'solar',
    logo: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 64,
    followersCount: 1650,
    isVerified: true,
    phone: '+509 3844-0012',
    city: 'Tabarre',
    address: 'Boulevard 15 Octobre, Proche ambassade',
    monCashNumber: '38440012',
    natCashNumber: '43990012',
    subscriptionPlan: 'PRO',
    isFeatured: true,
    totalSalesHTG: 1420000,
    ordersCount: 18,
    status: 'ACTIVE',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'store-4',
    sellerId: 'user-seller-4',
    name: 'Atizana Noailles & Fè Fòje',
    slug: 'atizana-noailles',
    slogan: 'Vrè zèv atizay ayisyen fèt ak men',
    description: 'Eskilti an fè dekoupe, bwa bèl poli, tablo penti natif natal soti dirèkteman nan men atis Kwadèboukè ak Jakmèl.',
    category: 'artisanat',
    logo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 42,
    followersCount: 710,
    isVerified: true,
    phone: '+509 3105-8899',
    city: 'Port-au-Prince',
    address: 'Place Boyer / Village Artistique',
    monCashNumber: '31058899',
    natCashNumber: '44558899',
    subscriptionPlan: 'FREE',
    isFeatured: false,
    totalSalesHTG: 285000,
    ordersCount: 15,
    status: 'ACTIVE',
    createdAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'store-5',
    sellerId: 'user-seller-5',
    name: 'AgroDondon & Kafe Nasyonal',
    slug: 'agrodondon-kafe',
    slogan: 'Kafe pi bon kalite ak pwodui natirèl nò peyi a',
    description: 'Kafe arabika griye tradisyonèlman, siwo myèl natirèl, lwil maskreti pi bon kalite san melanj.',
    category: 'agro',
    logo: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 37,
    followersCount: 540,
    isVerified: true,
    phone: '+509 3700-1122',
    city: 'Cap-Haïtien',
    address: 'Rue 18 A, Cap-Haïtien',
    monCashNumber: '37001122',
    natCashNumber: '40001122',
    subscriptionPlan: 'FREE',
    isFeatured: false,
    totalSalesHTG: 195000,
    ordersCount: 22,
    status: 'ACTIVE',
    createdAt: '2026-02-20T11:00:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    storeId: 'store-1',
    storeName: 'TechAyiti Delmas',
    storeLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Delmas',
    storeVerified: true,
    name: 'Samsung Galaxy A55 5G (128GB / 8GB RAM)',
    description: 'Smartphone Samsung Galaxy A55 orijinal, ekran Super AMOLED 120Hz, kamera trip 50MP OIS, batri 5000mAh. Debloke pou Digicel & Natcom. Pwodui nèf nan bwat ak 1 an garanti.',
    price: 34500,
    comparePrice: 38000,
    category: 'tech',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v1', name: 'Koulè', options: ['Ble Marine', 'Nwa Matt', 'Mawon'] },
      { id: 'v2', name: 'Kapasite', options: ['128GB', '256GB (+4500 HTG)'] }
    ],
    stock: 14,
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isActive: true,
    tags: ['samsung', 'smartphone', '5g', 'tech'],
    createdAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'prod-2',
    storeId: 'store-3',
    storeName: 'Solèy Ayiti Enèji',
    storeLogo: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Tabarre',
    storeVerified: true,
    name: 'Envètè Hibrid Solè 2.4kVA / 24V Pure Sine Wave',
    description: 'Envètè hibrid pwofesyonèl ak kontwolè MPPT 60A entegre. Travay dirèkteman ak panèl solè ak kouran vil la. Ideyal pou frijidè, fanatik, TV ak limyè lakay ou.',
    price: 49500,
    comparePrice: 55000,
    category: 'solar',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v1', name: 'Puissance', options: ['2.4 kVA (24V)', '3.6 kVA (24V) (+18000 HTG)'] }
    ],
    stock: 8,
    rating: 5.0,
    reviewCount: 24,
    isFeatured: true,
    isActive: true,
    tags: ['inverter', 'solar', 'enèji', 'batri'],
    createdAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 'prod-3',
    storeId: 'store-2',
    storeName: 'Boutik Lakay Pétion-Ville',
    storeLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Pétion-Ville',
    storeVerified: true,
    name: 'Chemiz Karabela Koud Men & Pantalon Lin',
    description: 'Chemiz tradisyonèl Karabela modènize, koud ak twal lin natirèl premium. Trè frè pou klima cho a. Kreye pa atizan koud Pétion-Ville.',
    price: 6800,
    comparePrice: 8500,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v1', name: 'Taille', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { id: 'v2', name: 'Koulè', options: ['Blan Karabela', 'Ble Syèl', 'Bèj'] }
    ],
    stock: 22,
    rating: 4.8,
    reviewCount: 19,
    isFeatured: true,
    isActive: true,
    tags: ['karabela', 'chemiz', 'mòd', 'rad'],
    createdAt: '2026-03-03T15:30:00Z'
  },
  {
    id: 'prod-4',
    storeId: 'store-4',
    storeName: 'Atizana Noailles & Fè Fòje',
    storeLogo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Port-au-Prince',
    storeVerified: true,
    name: 'Eskilti Fè Dekoupe « Pye Bwa Lavi » (Dyamèt 60cm)',
    description: 'Pyès atizay inik fè dekoupe tradisyonèl pa mèt atizan Noailles (Kwadèboukè). Fini ak verni anti-rouye pou dekore salon oswa biwo.',
    price: 9500,
    comparePrice: 12000,
    category: 'artisanat',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 5,
    rating: 4.9,
    reviewCount: 14,
    isFeatured: false,
    isActive: true,
    tags: ['artisanat', 'fè fòje', 'noailles', 'dekorasyon'],
    createdAt: '2026-03-04T10:15:00Z'
  },
  {
    id: 'prod-5',
    storeId: 'store-5',
    storeName: 'AgroDondon & Kafe Nasyonal',
    storeLogo: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Cap-Haïtien',
    storeVerified: true,
    name: 'Kafe Arabika Dondon Griye nan Bwa (Paakèt 1kg)',
    description: 'Kafe pi rekòlte nan mòn Dondon nan Nò Haïti. Parfen entans, gou chokola ak karamèl natirèl. 100% òganik san pwodui chimik.',
    price: 1850,
    comparePrice: 2200,
    category: 'agro',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v1', name: 'Mouture', options: ['Gren antye', 'Moulen fen (pou filt)', 'Moulen espresso'] }
    ],
    stock: 50,
    rating: 4.9,
    reviewCount: 45,
    isFeatured: true,
    isActive: true,
    tags: ['kafe', 'dondon', 'òganik', 'pwodui lokal'],
    createdAt: '2026-03-05T08:20:00Z'
  },
  {
    id: 'prod-6',
    storeId: 'store-1',
    storeName: 'TechAyiti Delmas',
    storeLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Delmas',
    storeVerified: true,
    name: 'Panèl Solè Monokristalen 550W Tier-1',
    description: 'Panèl solè gwo efikasite 22.8%, selil Half-Cut, garanti rannman 25 ane. Rezistan kont gwo van ak lapli siklòn.',
    price: 16500,
    comparePrice: 19000,
    category: 'solar',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 30,
    rating: 4.9,
    reviewCount: 16,
    isFeatured: false,
    isActive: true,
    tags: ['solar', 'panèl', 'solèy', 'enèji'],
    createdAt: '2026-03-06T12:00:00Z'
  },
  {
    id: 'prod-7',
    storeId: 'store-2',
    storeName: 'Boutik Lakay Pétion-Ville',
    storeLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Pétion-Ville',
    storeVerified: true,
    name: 'Sandal Kwi Veritab Atizanal pou Fanm & Gason',
    description: 'Sandal kwi natirèl trete ak men, semèl dirab ki pa glise. Trè konfòtab pou mache nan chalè a.',
    price: 3200,
    comparePrice: 4000,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v1', name: 'Pointure', options: ['38', '39', '40', '41', '42', '43', '44'] },
      { id: 'v2', name: 'Koulè', options: ['Kwi Mawon', 'Kwi Nwa', 'Kwi Natirèl'] }
    ],
    stock: 25,
    rating: 4.7,
    reviewCount: 11,
    isFeatured: false,
    isActive: true,
    tags: ['sandal', 'soulye', 'kwi', 'mòd'],
    createdAt: '2026-03-07T14:45:00Z'
  },
  {
    id: 'prod-8',
    storeId: 'store-1',
    storeName: 'TechAyiti Delmas',
    storeLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    storeCity: 'Delmas',
    storeVerified: true,
    name: 'Pousèt & Fanatik Recharjab Solè 16 Pous ak Limyè LED',
    description: 'Fanatik recharjab silansye ak batri entegre ki dire jiska 12 èdtan san kouran. Gen pò USB pou chaje telefòn ou lè gen pann kouran.',
    price: 8900,
    comparePrice: 10500,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    rating: 4.8,
    reviewCount: 22,
    isFeatured: true,
    isActive: true,
    tags: ['fanatik', 'recharjab', 'limyè', 'kay'],
    createdAt: '2026-03-08T16:00:00Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-buyer-1',
    fullName: 'Jean-Marc Baptiste',
    email: 'jean.marc@example.ht',
    phone: '+509 3788-2341',
    role: 'BUYER',
    activeSpace: 'BUYER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    city: 'Pétion-Ville',
    address: '12 Rue Rebecca, Pétion-Ville',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'user-seller-1',
    fullName: 'David Alexandre (TechAyiti)',
    email: 'contact@techayiti.ht',
    phone: '+509 3782-9901',
    role: 'SELLER',
    activeSpace: 'SELLER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    city: 'Delmas',
    address: 'Delmas 75 #14',
    storeId: 'store-1',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'user-admin-1',
    fullName: 'Directoire MG Gestion',
    email: 'admin@mggestion.ht',
    phone: '+509 3100-0000',
    role: 'ADMIN',
    activeSpace: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    city: 'Port-au-Prince',
    address: 'Siège Social MG Gestion, Pétion-Ville',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MG-2026-8941',
    buyerId: 'user-buyer-1',
    buyerName: 'Jean-Marc Baptiste',
    buyerPhone: '+509 3788-2341',
    buyerEmail: 'jean.marc@example.ht',
    storeId: 'store-1',
    storeName: 'TechAyiti Delmas',
    items: [
      {
        productId: 'prod-1',
        productName: 'Samsung Galaxy A55 5G (128GB / 8GB RAM)',
        productImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
        price: 34500,
        quantity: 1,
        selectedVariant: 'Ble Marine / 128GB',
        storeId: 'store-1'
      }
    ],
    subtotalHTG: 34500,
    deliveryFeeHTG: 450,
    serviceFeeHTG: 250,
    totalAmountHTG: 35200,
    deliveryAddress: {
      fullName: 'Jean-Marc Baptiste',
      phone: '+509 3788-2341',
      secondaryPhone: '+509 4210-9988',
      city: 'Pétion-Ville',
      street: '12 Rue Rebecca, 2ème barrière grise à droite',
      department: 'Ouest',
      deliveryNotes: 'Rele m lè w rive bò plas Boyer a tanpri.'
    },
    paymentMethod: 'MONCASH',
    paymentStatus: 'SUCCESSFUL',
    paymentReference: 'MC-TXN-88492019',
    orderStatus: 'IN_DELIVERY',
    timeline: [
      { status: 'CREATED', timestamp: '2026-03-08T10:14:00Z', note: 'Commande passée par l\'acheteur' },
      { status: 'PAID', timestamp: '2026-03-08T10:15:22Z', note: 'Paiement MonCash validé par le serveur sécurisé' },
      { status: 'CONFIRMED', timestamp: '2026-03-08T10:45:00Z', note: 'Boutique TechAyiti a confirmé le stock et préparé la facture' },
      { status: 'PREPARING', timestamp: '2026-03-08T11:20:00Z', note: 'Colis emballé avec scellé de sécurité MG' },
      { status: 'IN_DELIVERY', timestamp: '2026-03-08T13:00:00Z', note: 'Coursier MG Express en route (Livreur: Pierre +509 3411-2233)' }
    ],
    createdAt: '2026-03-08T10:14:00Z',
    updatedAt: '2026-03-08T13:00:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'MG-2026-8942',
    buyerId: 'user-buyer-1',
    buyerName: 'Jean-Marc Baptiste',
    buyerPhone: '+509 3788-2341',
    buyerEmail: 'jean.marc@example.ht',
    storeId: 'store-5',
    storeName: 'AgroDondon & Kafe Nasyonal',
    items: [
      {
        productId: 'prod-5',
        productName: 'Kafe Arabika Dondon Griye nan Bwa (Paakèt 1kg)',
        productImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
        price: 1850,
        quantity: 2,
        selectedVariant: 'Moulen fen (pou filt)',
        storeId: 'store-5'
      }
    ],
    subtotalHTG: 3700,
    deliveryFeeHTG: 400,
    serviceFeeHTG: 100,
    totalAmountHTG: 4200,
    deliveryAddress: {
      fullName: 'Jean-Marc Baptiste',
      phone: '+509 3788-2341',
      city: 'Pétion-Ville',
      street: '12 Rue Rebecca',
      department: 'Ouest'
    },
    paymentMethod: 'NATCASH',
    paymentStatus: 'SUCCESSFUL',
    paymentReference: 'NC-TXN-44910283',
    orderStatus: 'DELIVERED',
    timeline: [
      { status: 'CREATED', timestamp: '2026-03-01T09:00:00Z', note: 'Commande initiée' },
      { status: 'PAID', timestamp: '2026-03-01T09:02:00Z', note: 'Paiement NatCash vérifié avec succès' },
      { status: 'CONFIRMED', timestamp: '2026-03-01T09:30:00Z', note: 'Confirmée par AgroDondon' },
      { status: 'PREPARING', timestamp: '2026-03-01T10:00:00Z', note: 'Emballage café fraîchement moulu' },
      { status: 'IN_DELIVERY', timestamp: '2026-03-01T14:00:00Z', note: 'En cours de livraison' },
      { status: 'DELIVERED', timestamp: '2026-03-01T16:30:00Z', note: 'Colis remis en main propre au destinataire' }
    ],
    review: {
      id: 'rev-1',
      rating: 5,
      comment: 'Kafe a santi bon anpil, bon gou natirèl ! Livrezon an te rive rapid nan menm jounen an.',
      createdAt: '2026-03-01T18:00:00Z',
      authorName: 'Jean-Marc Baptiste'
    },
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T16:30:00Z'
  }
];

export const INITIAL_PLATFORM_CONFIG: PlatformConfig = {
  marketplaceCommissionPercent: 3.5,
  proSubscriptionPriceHTG: 750,
  featuredProductPriceHTG: 300,
  featuredStorePriceHTG: 1200,
  baseDeliveryFeeHTG: 350,
  supportPhone: '+509 2811-0000',
  supportEmail: 'sipò@mggestion.ht',
  monCashSandbox: true,
  natCashSandbox: true
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorName: 'Directoire MG Gestion',
    actorRole: 'ADMIN',
    action: 'VERIFICATION_BADGE_GRANTED',
    target: 'Store: Solèy Ayiti Enèji (store-3)',
    details: 'Vérification du registre de commerce et pièces d\'identité complétée.',
    timestamp: '2026-03-07T14:20:00Z'
  },
  {
    id: 'log-2',
    actorName: 'Système MonCash Webhook',
    actorRole: 'SYSTEM',
    action: 'PAYMENT_SETTLEMENT',
    target: 'Order: MG-2026-8941',
    details: 'Transaction 35 200 HTG confirmée par API Digicel.',
    timestamp: '2026-03-08T10:15:22Z'
  },
  {
    id: 'log-3',
    actorName: 'Directoire MG Gestion',
    actorRole: 'ADMIN',
    action: 'COMMISSION_RATE_ADJUSTED',
    target: 'Platform Settings',
    details: 'Taux de commission ajusté à 3.5% (Abonnements Pro exemptés).',
    timestamp: '2026-03-05T09:00:00Z'
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    reporterName: 'Marc-Eddy P.',
    reporterPhone: '+509 3899-1122',
    targetType: 'PRODUCT',
    targetId: 'prod-4',
    targetTitle: 'Eskilti Fè Dekoupe Noailles',
    reason: 'Question sur les dimensions exactes',
    details: 'L\'acheteur demande confirmation si le diamètre est bien de 60cm avant envoi.',
    status: 'RESOLVED',
    createdAt: '2026-03-06T11:00:00Z'
  }
];

export const USD_TO_HTG_RATE = 132.5; // 1 USD = 132.50 HTG (Taux de référence BRH)

export const PICKUP_POINTS: PickupPoint[] = [
  {
    id: 'pk-delmas-33',
    name: 'Pwen Relè Delmas 33 (Total Station)',
    department: 'Ouest',
    city: 'Delmas',
    address: 'Carrefour Delmas 33, en face Station Total',
    landmark: 'Total Delmas 33',
    openingHours: 'Lendi - Samdi: 8:00 AM - 6:00 PM',
    phone: '+509 3788-1122',
    feeHTG: 150,
  },
  {
    id: 'pk-petionville-stpierre',
    name: 'Pwen Relè Pétion-Ville (Place Saint-Pierre)',
    department: 'Ouest',
    city: 'Pétion-Ville',
    address: 'Rue Lamarre, bò Place Saint-Pierre',
    landmark: 'Plaza Saint-Pierre',
    openingHours: 'Lendi - Dimanch: 8:00 AM - 7:00 PM',
    phone: '+509 3455-8899',
    feeHTG: 150,
  },
  {
    id: 'pk-tabarre-clergine',
    name: 'Pwen Relè Tabarre (Clergine)',
    department: 'Ouest',
    city: 'Tabarre',
    address: 'Boulevard 15 Octobre, Carrefour Clergine',
    landmark: 'Carrefour Clergine',
    openingHours: 'Lendi - Samdi: 8:30 AM - 5:30 PM',
    phone: '+509 4120-7766',
    feeHTG: 150,
  },
  {
    id: 'pk-cap-samari',
    name: 'Pwen Relè Cap-Haïtien (Rond-Point Samari)',
    department: 'Nord',
    city: 'Cap-Haïtien',
    address: 'Rond-Point Samari, Rue 18-A',
    landmark: 'Samari Express',
    openingHours: 'Lendi - Samdi: 8:00 AM - 6:00 PM',
    phone: '+509 3899-4455',
    feeHTG: 200,
  },
  {
    id: 'pk-cayes-centre',
    name: 'Pwen Relè Les Cayes (Rue Général Marion)',
    department: 'Sud',
    city: 'Les Cayes',
    address: 'Angle Rue Général Marion & Rue Mgr Dumas',
    landmark: 'Centre-Ville Les Cayes',
    openingHours: 'Lendi - Samdi: 8:00 AM - 5:00 PM',
    phone: '+509 3677-2233',
    feeHTG: 200,
  },
  {
    id: 'pk-gonaives-croix',
    name: 'Pwen Relè Gonaïves (Carrefour de la Croix)',
    department: 'Artibonite',
    city: 'Gonaïves',
    address: 'Avenue des Dattes, Carrefour de la Croix',
    landmark: 'Carrefour Croix',
    openingHours: 'Lendi - Samdi: 8:00 AM - 5:30 PM',
    phone: '+509 4322-1100',
    feeHTG: 200,
  },
  {
    id: 'pk-jacmel-port',
    name: 'Pwen Relè Jacmel (Bò Lanmè / Port)',
    department: 'Sud-Est',
    city: 'Jacmel',
    address: 'Rue du Commerce, près du Port Touristique',
    landmark: 'Port Touristique Jacmel',
    openingHours: 'Lendi - Samdi: 8:30 AM - 5:00 PM',
    phone: '+509 3111-9988',
    feeHTG: 200,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'SMS',
    title: 'SMS Digicel MonCash Reçu',
    message: 'Ou transfere 35,200 HTG bay MG Gestion Escrow pou Kòmand #MG-2026-8941. Kòd PIN retrè ou an se 4892.',
    timestamp: 'Il y a 5 minutes',
    isRead: false,
    orderId: 'ord-1',
  },
  {
    id: 'notif-2',
    type: 'ORDER',
    title: 'Kòmand an Kou Preparasyon',
    message: 'Boutik "TechAyiti Delmas" fin valide kòmand ou a. Koli an pral remèt bay kourye livrezon an.',
    timestamp: 'Il y a 20 minutes',
    isRead: false,
    orderId: 'ord-1',
  },
  {
    id: 'notif-3',
    type: 'PROMO',
    title: 'Nouvo Promo Solè & Envètè ☀️',
    message: 'Jwenn jiska 20% rabè sou panno solè ak batri gel semèn sa a sou tout boutik vérifye.',
    timestamp: 'Il y a 2 heures',
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'SYSTEM',
    title: 'To BRH Jounen an Afiche',
    message: 'To referans BRH jodi a se 1 USD = 132.50 HTG. Ou ka chanje lajan an HTG oswa USD nan tèt paj la.',
    timestamp: 'Il y a 4 heures',
    isRead: true,
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    storeId: 'store-1',
    storeName: 'TechAyiti Delmas',
    storeLogo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80',
    sender: 'SELLER',
    senderName: 'Jean-Marc (TechAyiti)',
    text: 'Bonswa! Byenvini sou paj TechAyiti Delmas. Tout telefòn Samsung ak iPhone nou yo gen 6 mwa garanti e nou gen stock disponib Delmas 33.',
    timestamp: '10:30 AM',
  },
  {
    id: 'msg-2',
    storeId: 'store-1',
    storeName: 'TechAyiti Delmas',
    storeLogo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80',
    sender: 'BUYER',
    senderName: 'Mwen',
    text: 'Bonjou! Èske nou ka fè livrezon Delmas 33 jodi a si m peye ak MonCash kounye a?',
    timestamp: '10:32 AM',
  },
  {
    id: 'msg-3',
    storeId: 'store-1',
    storeName: 'TechAyiti Delmas',
    storeLogo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150&auto=format&fit=crop&q=80',
    sender: 'SELLER',
    senderName: 'Jean-Marc (TechAyiti)',
    text: 'Wi wi, livrè nou an pare! Le ou fin valide kòmand lan sou MG Gestion, koli an ap rive nan 1h a 2h tan.',
    timestamp: '10:35 AM',
  },
];

export const MOCK_CATEGORIES = INITIAL_CATEGORIES;
export const MOCK_STORES = INITIAL_STORES;
export const MOCK_PRODUCTS = INITIAL_PRODUCTS;
export const MOCK_USERS = INITIAL_USERS;
export const MOCK_ORDERS = INITIAL_ORDERS;
export const MOCK_TRANSACTIONS = [
  {
    id: 'tx-1',
    orderId: 'ord-1',
    amountHTG: 35200,
    method: 'MONCASH' as const,
    status: 'SUCCESS' as any,
    senderPhone: '+509 3788-2940',
    phone: '+509 3788-2940',
    transactionRef: 'MC-TXN-20260308-4829',
    operatorRef: 'DIGICEL-HT-948102',
    createdAt: '2026-03-08T10:15:00Z',
    confirmedAt: '2026-03-08T10:15:22Z',
    logs: ['Initiated via MonCash API', 'OTP Verified', 'Settled into Escrow Account']
  },
  {
    id: 'tx-2',
    orderId: 'ord-2',
    amountHTG: 12850,
    method: 'NATCASH' as const,
    status: 'SUCCESS' as any,
    senderPhone: '+509 4120-9901',
    phone: '+509 4120-9901',
    transactionRef: 'NC-TXN-20260307-1192',
    operatorRef: 'NATCOM-HT-331049',
    createdAt: '2026-03-07T14:30:00Z',
    confirmedAt: '2026-03-07T14:30:15Z',
    logs: ['Initiated via NatCash API', 'OTP Verified', 'Settled into Escrow Account']
  }
];

