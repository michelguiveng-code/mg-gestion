# API Documentation - Payment Methods

## Endpoints de Paiement (MonCash & NatCash)

### 1. Initier un paiement
**POST** `/api/payments/initiate`

Crée une transaction de paiement en attente.

**Requête:**
```json
{
  "orderId": "order-123",
  "amountHTG": 1500,
  "method": "MONCASH",
  "userId": "user-456"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "transaction": {
    "id": "txn-abc123",
    "orderId": "order-123",
    "amountHTG": 1500,
    "method": "MONCASH",
    "status": "PENDING",
    "transactionRef": "MONCASH-1692345600-xyz789",
    "createdAt": "2026-08-17T14:30:00Z"
  },
  "paymentUrl": "https://mg-gestion.onrender.com/payment?txnId=txn-abc123&method=MONCASH"
}
```

### 2. Confirmer un paiement
**POST** `/api/payments/confirm`

Valide et confirme un paiement via MonCash ou NatCash.

**Requête:**
```json
{
  "transactionId": "txn-abc123",
  "senderPhone": "+509XXXXXXXX",
  "confirmation": "CONFIRMED"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Paiement de 1500 HTG confirmé via MONCASH",
  "transaction": {
    "id": "txn-abc123",
    "status": "SUCCESSFUL",
    "confirmedAt": "2026-08-17T14:35:00Z",
    "externalId": "MONCASH-API-abc123xyz"
  }
}
```

### 3. Vérifier le statut d'un paiement
**GET** `/api/payments/:transactionId`

Récupère les détails d'une transaction.

**Réponse (200):**
```json
{
  "id": "txn-abc123",
  "orderId": "order-123",
  "amountHTG": 1500,
  "method": "MONCASH",
  "status": "SUCCESSFUL",
  "senderPhone": "+509XXXXXXXX",
  "transactionRef": "MONCASH-1692345600-xyz789",
  "createdAt": "2026-08-17T14:30:00Z",
  "confirmedAt": "2026-08-17T14:35:00Z"
}
```

### 4. Lister les transactions d'un utilisateur
**GET** `/api/payments/user/:userId`

Récupère toutes les transactions d'un utilisateur.

**Réponse (200):**
```json
[
  {
    "id": "txn-abc123",
    "orderId": "order-123",
    "amountHTG": 1500,
    "method": "MONCASH",
    "status": "SUCCESSFUL",
    "createdAt": "2026-08-17T14:30:00Z"
  },
  {
    "id": "txn-def456",
    "orderId": "order-124",
    "amountHTG": 2000,
    "method": "NATCASH",
    "status": "PENDING",
    "createdAt": "2026-08-17T15:00:00Z"
  }
]
```

### 5. Rembourser une transaction
**POST** `/api/payments/:transactionId/refund`

Rembourse une transaction.

**Requête:**
```json
{
  "reason": "Produit retourné"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Remboursement traité",
  "transaction": {
    "id": "txn-abc123",
    "status": "REFUNDED",
    "failedAt": "2026-08-17T15:45:00Z",
    "failureReason": "Produit retourné"
  }
}
```

## Statuts de Transaction

| Statut | Signification |
|--------|---------------|
| PENDING | En attente de confirmation |
| SUCCESSFUL | Paiement réussi |
| FAILED | Paiement échoué |
| REFUNDED | Remboursement effectué |

## Méthodes de Paiement Supportées

- **MONCASH**: Service de paiement mobile haïtien
- **NATCASH**: Service de paiement mobile haïtien
- **STRIPE**: (À venir)
- **PAYPAL**: (À venir)

## Intégration MonCash/NatCash Réelle

Pour utiliser les véritables API MonCash et NatCash :

### MonCash
1. Créer un compte business: https://moncash.ht
2. Obtenir les credentials API
3. Ajouter au `.env`:
```
MONCASH_API_KEY=your_api_key
MONCASH_SECRET=your_secret
```

### NatCash
1. Créer un compte: https://www.natcash.ht
2. Demander les credentials API
3. Ajouter au `.env`:
```
NATCASH_API_KEY=your_api_key
NATCASH_SECRET=your_secret
```

## Exemple d'utilisation côté client

```javascript
// 1. Initier paiement
const initiateResponse = await fetch('/api/payments/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 'order-123',
    amountHTG: 1500,
    method: 'MONCASH',
    userId: 'user-456'
  })
});

const { transaction, paymentUrl } = await initiateResponse.json();

// 2. Rediriger vers paiement (chez MonCash/NatCash)
window.location.href = transaction.externalPaymentUrl;

// 3. Après confirmation, vérifier le statut
const statusResponse = await fetch(`/api/payments/${transaction.id}`);
const { status } = await statusResponse.json();

if (status === 'SUCCESSFUL') {
  console.log('Paiement confirmé!');
} else if (status === 'FAILED') {
  console.log('Paiement échoué!');
}
```

## Webhook (À implémenter)

MonCash et NatCash envoient des notifications webhook pour les confirmations. À ajouter:

```javascript
app.post('/webhooks/payment/confirm', (req, res) => {
  // Valider la signature webhook
  // Mettre à jour le statut de transaction
  // Confirmer la réception
});
```

## Codes d'erreur

| Code | Message | Solution |
|------|---------|----------|
| 400 | Montant invalide | Vérifier que amountHTG > 0 |
| 400 | Méthode invalide | Utiliser MONCASH ou NATCASH |
| 404 | Transaction non trouvée | Vérifier le transactionId |
| 400 | Transaction déjà traitée | Ne peut pas traiter deux fois |
| 400 | Confirmation invalide | Fournir senderPhone valide |

## Tests

```bash
# Initier paiement
curl -X POST http://localhost:3002/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-1",
    "amountHTG": 500,
    "method": "MONCASH",
    "userId": "user-1"
  }'

# Vérifier statut
curl http://localhost:3002/api/payments/txn-xxx

# Confirmer paiement
curl -X POST http://localhost:3002/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "txn-xxx",
    "senderPhone": "+50912345678",
    "confirmation": "CONFIRMED"
  }'
```
