import { User, UserRole } from '../types';

export interface RegisteredUserInput {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  password: string;
  avatar?: string;
}

const STORAGE_KEY = 'mg-gestion-users';
const SESSION_KEY = 'mg-gestion-session';
let memoryUsers: Array<User & { password?: string }> = [];
let memorySession: User | null = null;

const DEMO_USERS = [
  {
    id: 'user-buyer-1',
    fullName: 'Jean-Marc Baptiste',
    email: 'jean.marc@example.ht',
    phone: '+509 3788-2341',
    role: 'BUYER' as const,
    activeSpace: 'BUYER' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    city: 'Pétion-Ville',
    address: '12 Rue Rebecca, Pétion-Ville',
    createdAt: '2026-01-20T10:00:00Z',
    password: 'Demo123!'
  },
  {
    id: 'user-seller-1',
    fullName: 'David Alexandre (TechAyiti)',
    email: 'contact@techayiti.ht',
    phone: '+509 3782-9901',
    role: 'SELLER' as const,
    activeSpace: 'SELLER' as const,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    city: 'Delmas',
    address: 'Delmas 75 #14',
    storeId: 'store-1',
    createdAt: '2026-01-10T09:00:00Z',
    password: 'Demo123!'
  },
  {
    id: 'user-admin-1',
    fullName: 'Directoire MG Gestion',
    email: 'admin@mggestion.ht',
    phone: '+509 3100-0000',
    role: 'ADMIN' as const,
    activeSpace: 'ADMIN' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    city: 'Port-au-Prince',
    address: 'Siège Social MG Gestion, Pétion-Ville',
    createdAt: '2026-01-01T00:00:00Z',
    password: 'Demo123!'
  }
];

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.replace(/\D/g, '');

const buildDefaultAvatar = (role: UserRole) => {
  const avatars = {
    BUYER: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    SELLER: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    ADMIN: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  };

  return avatars[role] || avatars.BUYER;
};

const getStoredUsers = (): Array<User & { password?: string }> => {
  const hasBrowserStorage = typeof window !== 'undefined' && !!window.localStorage;

  if (!hasBrowserStorage) {
    if (memoryUsers.length === 0) {
      memoryUsers = [...DEMO_USERS];
    }
    return memoryUsers;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }

    const parsed = JSON.parse(raw) as Array<User & { password?: string }>;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_USERS;
  } catch {
    return DEMO_USERS;
  }
};

const saveStoredUsers = (users: Array<User & { password?: string }>) => {
  const hasBrowserStorage = typeof window !== 'undefined' && !!window.localStorage;

  if (!hasBrowserStorage) {
    memoryUsers = users;
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const listUsers = (): Array<User & { password?: string }> => {
  return getStoredUsers();
};

export const registerUser = (input: RegisteredUserInput): (User & { password?: string }) | null => {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);

  if (!input.fullName.trim() || !email || !phone || !input.password.trim()) {
    return null;
  }

  const users = getStoredUsers();
  const alreadyExists = users.some(
    (u) => normalizeEmail(u.email) === email || normalizePhone(u.phone) === phone
  );

  if (alreadyExists) {
    return null;
  }

  if (input.password.length < 8) {
    return null;
  }

  const newUser: User & { password?: string } = {
    id: `user-${Date.now()}`,
    fullName: input.fullName.trim(),
    email,
    phone: `+509 ${phone.slice(-8)}`,
    role: input.role,
    activeSpace: input.role,
    avatar: input.avatar || buildDefaultAvatar(input.role),
    isVerified: true,
    city: input.city || 'Port-au-Prince',
    address: `${input.city || 'Port-au-Prince'} - MG Gestion`,
    createdAt: new Date().toISOString(),
    password: input.password,
  };

  users.push(newUser);
  saveStoredUsers(users);
  return newUser;
};

export const authenticateUser = (identifier: string, password: string, preferredRole?: UserRole): User | null => {
  const users = getStoredUsers();
  const normalizedIdentifier = normalizeEmail(identifier);
  const phoneDigits = normalizePhone(identifier);

  const user = users.find((candidate) => {
    const validEmail = normalizeEmail(candidate.email) === normalizedIdentifier;
    const validPhone = normalizePhone(candidate.phone) === phoneDigits;
    const matchesRole = !preferredRole || candidate.role === preferredRole;
    return (validEmail || validPhone) && matchesRole;
  });

  if (!user || user.password !== password) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
};

export const saveSession = (user: User) => {
  const hasBrowserStorage = typeof window !== 'undefined' && !!window.localStorage;

  if (!hasBrowserStorage) {
    memorySession = user;
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const loadSession = (): User | null => {
  const hasBrowserStorage = typeof window !== 'undefined' && !!window.localStorage;

  if (!hasBrowserStorage) {
    return memorySession;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  const hasBrowserStorage = typeof window !== 'undefined' && !!window.localStorage;

  if (!hasBrowserStorage) {
    memorySession = null;
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
};
