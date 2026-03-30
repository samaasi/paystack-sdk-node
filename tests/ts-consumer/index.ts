import { PaystackClient, createPaystackClient } from '../../dist/index.js'
import { verifyPaystackSignature } from '../../dist/webhooks.js'

const client = new PaystackClient({ apiKey: 'sk_test_123' })
await createPaystackClient({ overrides: { apiKey: 'sk_test_123' } })

await verifyPaystackSignature({
  secretKey: 'sk_test_123',
  payload: 'payload',
  signature: 'deadbeef',
})

void client
