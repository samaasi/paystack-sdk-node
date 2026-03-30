import { PaystackClient, createPaystackClient } from '../../dist/index.js'
import { verifyPaystackSignature } from '../../dist/webhooks.js'
import { PaystackEvent } from '../../dist/index.js'

const client = new PaystackClient({ apiKey: 'sk_test_123' })
await createPaystackClient({ overrides: { apiKey: 'sk_test_123' } })

await verifyPaystackSignature({
  secretKey: 'sk_test_123',
  payload: 'payload',
  signature: 'deadbeef',
})

const eventName: `${PaystackEvent}` = PaystackEvent.ChargeSuccess
void eventName
void client
