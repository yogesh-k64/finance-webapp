# Finance Manager App - README

## Overview
A modern financial management application for tracking customer handouts, collections, and balances with JSON import/export functionality.

## Features
- **Dashboard Overview**: Key financial metrics at a glance
- **Customer Management**: Track customer information and transactions
- **Handout Tracking**: Record and manage financial handouts
- **Collection System**: Monitor payment collections
- **Data Portability**: Full JSON import/export capabilities
- **Date Filtering**: Analyze data by custom date ranges

## Technologies Used
- **Frontend**: React.js with TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Data Persistence**: JSON file storage
- **Build Tool**: Vite

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/finance-manager.git
   cd finance-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
### Main Dashboard
- View key financial metrics
- Navigate between Customers, Handouts, and Collection sections
- Filter data by date range

### Data Management
- **Export**: Click "EXPORT TO JSON" to save all data
- **Import**: Click "IMPORT JSON" to load saved data

## File Structure
```
src/
├── components/       # Reusable UI components
├── pages/            # Application screens
├── store/            # Redux store configuration
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Configuration
Create a `.env` file in the root directory with any environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Data Structure
Example JSON structure:
```json
{
  "handouts": [
    {
      "id": "1",
      "name": "John Doe",
      "amount": 5000,
      "date": "2025-05-01",
      "collections": [
        {
          "amount": 2000,
          "date": "2025-05-15"
        }
      ]
    }
  ],
  "lastUpdated": "2025-05-20T12:00:00Z"
}
```

## License
MIT License

## Contact
For support or questions, please contact: [your.email@example.com]