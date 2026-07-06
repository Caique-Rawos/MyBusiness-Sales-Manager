---
name: project_cupom_fiscal
description: Detalhes do cupom fiscal — endpoint, campos da loja, QR Code bitcoin, biblioteca usada
metadata:
  type: project
---

**Endpoint:** `GET /venda-relatorio/cupom_fiscal/:idVenda`

**Estrutura do retorno:**
- `loja`: `{ nomeFantasia, cpfCnpj, ie?, endereco }` — campos exatos da entidade `LojaOrmEntity`
- `cupomItens[]`: lowercase snake_case via `getRawMany()` — `precounitario`, `subtotal`, `ncm`, `icms`, `pis`, `cofins`, `ipi`, `quantidade`, `descricao`, `codigodebarra`
- `totalVendas`: number
- `tributosAproximados`: number

**QR Code:** Gerado com o pacote `qrcode` (não `qrcode.react`). Valor encodes URI bitcoin:
```
bitcoin:bc1q0a9gnhf0h4chfmtvjrj33eu3mtszryxyyead84?amount=<totalVendas>
```
Gerado via `QRCode.toDataURL(uri)` no useEffect e renderizado como `<img src={dataUrl}>`.

**Why:** `qrcode.react` causou tela em branco no Vite — incompatibilidade de bundling. O pacote `qrcode` puro não tem esse problema.

**How to apply:** Sempre usar `qrcode` (não `qrcode.react`) para geração de QR code neste projeto.
