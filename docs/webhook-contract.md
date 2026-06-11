# Webhook Contract: SKU Created

Endpoint (n8n webhook):
- Method: POST
- Path: /webhook/sku-created
- Content-Type: application/json

Required fields:
- sku (string): Generated SKU value.

Optional fields:
- requestId (string): Unique event id for idempotency.
- cliente (string)
- fecha (string, YYYY-MM-DD)
- plataformas (array of strings)
- formato (string)
- source (string)
- generatedAt (string, ISO 8601)

Sample payload:

```json
{
  "sku": "CLT20260610-META-1080X1350-001",
  "requestId": "evt_20260610_0001",
  "cliente": "ClienteX",
  "fecha": "2026-06-10",
  "plataformas": ["Meta", "Instagram"],
  "formato": "1080x1350",
  "source": "skugen-similar",
  "generatedAt": "2026-06-10T18:30:00Z"
}
```
