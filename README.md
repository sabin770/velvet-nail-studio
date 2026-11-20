# Velvet Nail Studio (MERN, beta)

Ported from your single-page HTML into a MERN app with separate pages:

| Route               | Page               | Data source                |
|---------------------|--------------------|----------------------------|
| `/`                 | Home (hero)        | Static, morphing hero hands |
| `/designs`          | Designs gallery    | MongoDB `designs`, Cloudinary photos |
| `/design-your-set`  | Design your set    | Live morphing preview      |
| `/services`         | Services           | MongoDB `services`         |
| `/shop`             | Shop + cart        | MongoDB `products`, `orders` |
| `/book`             | Book an appointment | MongoDB `bookings`         |

## 1. Prerequisites

- Node.js 18+
- MongoDB running on localhost (default `mongodb://127.0.0.1:27017`)
- A free Cloudinary account (cloud name, API key, API secret from the dashboard)

## 2. Configure

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in your Cloudinary values.

## 3. Install

```bash
cd server && npm install
cd ../client && npm install
```

## 4. Seed the database

```bash
cd server
npm run seed
```

This creates the 10 designs, 6 services, and 11 products from your HTML. Running it again resets those three collections (bookings and orders are kept).

## 5. Run

Two terminals:

```bash
# terminal 1
cd server && npm run dev        # API on http://localhost:5000

# terminal 2
cd client && npm run dev        # App on http://localhost:5173
```

Open http://localhost:5173.

## Adding photos (Cloudinary)

Designs and products can have a real photo. Upload with a multipart request to the API (no admin UI yet):

```bash
curl -F "title=Chrome Dream" -F "style=chrome" -F "note=Mirror finish" \
     -F "image=@./chrome.jpg" http://localhost:5000/api/designs
```

Products work the same way at `/api/products` with fields `name`, `category`, `price`, `description`, `emoji`, and `image`. Photos go to Cloudinary folders `velvet-nails/designs` and `velvet-nails/products`. If a design has no photo, the gallery shows three morphing nails instead.

## How the morph works

`client/src/components/NailShape.jsx` stores each shape as a 16-point outline with the same point count. When the shape changes, it interpolates every point over about 650 ms with easing, so the nail flows into the new shape instead of snapping. Length changes animate through a CSS height transition. Users who prefer reduced motion get an instant change.

## Notes for beta

- Admin upload routes (`POST` and `DELETE` on designs and products) have no login. Add auth before going public.
- Checkout and booking save data but charge nothing and send no email yet.
- Booking time slots are fixed in both `server/routes/bookings.js` and `client/src/constants.js`.
