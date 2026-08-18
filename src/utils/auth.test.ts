import { authenticateUser, registerUser, loadSession, saveSession, clearSession } from './auth';

const defaultBuyer = authenticateUser('jean.marc@example.ht', 'Demo123!', 'BUYER');
if (!defaultBuyer) {
  throw new Error('demo buyer should be available by default');
}

const buyer = registerUser({
  fullName: 'Test Buyer',
  email: 'testbuyer@example.ht',
  phone: '+509 3700-0001',
  role: 'BUYER',
  city: 'Port-au-Prince',
  password: 'Demo123!'
});

if (!buyer || buyer.role !== 'BUYER') {
  throw new Error('registerUser should create a buyer user');
}

const authenticated = authenticateUser('testbuyer@example.ht', 'Demo123!', 'BUYER');
if (!authenticated) {
  throw new Error('authenticateUser should accept the registered buyer');
}

saveSession(authenticated);
const loaded = loadSession();
if (!loaded || loaded.email !== authenticated.email) {
  throw new Error('saveSession and loadSession should persist the session');
}

clearSession();
const cleared = loadSession();
if (cleared) {
  throw new Error('clearSession should clear the saved session');
}

console.log('auth persistence checks passed');
