# app

Next.js App Router routes:

- `page.tsx`: home page. `layout.tsx`: root layout, metadata and the site chrome.
- `tienda/`: shop with search and filters. `categoria/[slug]/`: category pages. `producto/[slug]/`: product detail.
- `carrito/`: cart. `checkout/`: quote form that opens WhatsApp with the request.
- `contacto/`: contact options (WhatsApp, phone, email).
- `login/`, `registro/`: redirect to `/contacto`, since there are no client accounts.
- `principal/[[...segments]]/`: redirects for legacy URLs from the earlier layout.
- `globals.css`: base styles and older class names still in use.
