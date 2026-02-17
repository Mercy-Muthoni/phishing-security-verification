# Social Media Phishing Attacks Information Portal

An informational web application focused on educating Kenyan businesses about social media phishing attacks and their impact.

## Features

- Homepage with hero section and navigation
- Educational Resources section
- News Updates
- Tips and Best Practices
- Verify Link tool
- Reporting tool for incidents
- Admin platform with CRUD operations

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, TanStack Router, TanStack Query, Next-themes, Radix UI, Sonner, Lucide React, Internet Identity
- **Backend:** Node.js, Express, MongoDB

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repository

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   npm install
   ```

4. Set up environment variables for backend (create .env file):
   ```
   MONGO_URI=mongodb://localhost:27017/phishing-portal
   PORT=5000
   ```

5. Start the backend:
   ```
   npm run dev
   ```

6. Start the frontend (in another terminal):
   ```
   cd ../frontend
   npm run dev
   ```

7. Open http://localhost:5173 in your browser

## Automated Phishing Feed Ingestion (Node.js)

The backend includes `backend/services/phishingFeedIngestor.js`, which fetches phishing links from PhishTank, OpenPhish, and URLScan and stores only new links in MongoDB (deduplicated by `normalizedUrl`).

The ingestor is injected and started in `backend/server.js` after MongoDB connects.

### Schedule

By default, ingestion runs:

- once immediately at backend startup
- every 12 hours after that

You can configure it with environment variables:

```
INGEST_LIMIT_PER_SOURCE=100
INGEST_INTERVAL_HOURS=12
```

## Build

To build the frontend for production:
```
cd frontend
npm run build
```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
