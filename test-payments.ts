import axios from 'axios';

const API_BASE = 'http://localhost:3002/api';

async function testPaymentAPI() {
  console.log('🧪 Testing Payment API...\n');

  try {
    // 1. Health check
    console.log('1️⃣  Health Check');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅', JSON.stringify(health.data, null, 2));

    // 2. Get test user
    console.log('\n2️⃣  Get Test User');
    const users = await axios.get(`${API_BASE}/users`);
    const userId = users.data[0]?.id;
    console.log('✅ User ID:', userId);

    // 3. Initiate payment
    console.log('\n3️⃣  Initiate Payment (MonCash)');
    const paymentInit = await axios.post(`${API_BASE}/payments/initiate`, {
      orderId: 'test-order-' + Date.now(),
      amountHTG: 1500,
      method: 'MONCASH',
      userId: userId
    });
    const txnId = paymentInit.data.transaction.id;
    console.log('✅ Transaction Created:', txnId);
    console.log('   Status:', paymentInit.data.transaction.status);
    console.log('   Amount:', paymentInit.data.transaction.amountHTG, 'HTG');

    // 4. Check payment status
    console.log('\n4️⃣  Check Payment Status');
    const paymentStatus = await axios.get(`${API_BASE}/payments/${txnId}`);
    console.log('✅ Status:', paymentStatus.data.status);
    console.log('   Reference:', paymentStatus.data.transactionRef);

    // 5. Confirm payment
    console.log('\n5️⃣  Confirm Payment');
    const paymentConfirm = await axios.post(`${API_BASE}/payments/confirm`, {
      transactionId: txnId,
      senderPhone: '+509XXXXXXXX',
      confirmation: 'CONFIRMED'
    });
    console.log('✅ Payment Confirmed!');
    console.log('   New Status:', paymentConfirm.data.transaction.status);
    console.log('   External ID:', paymentConfirm.data.transaction.externalId);

    // 6. List user transactions
    console.log('\n6️⃣  List User Transactions');
    const userTransactions = await axios.get(`${API_BASE}/payments/user/${userId}`);
    console.log('✅ Found', userTransactions.data.length, 'transaction(s)');

    console.log('\n✅ All tests passed!\n');
  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testPaymentAPI();
