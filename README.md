# FarmFinder - Farmers Market Directory

A beautiful, modern web application to discover and explore farmers markets in your area. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real Data**: Displays actual farmers markets from CSV data
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Search & Filter**: Find markets by location, county, or state
- **Detailed Information**: View market hours, descriptions, contact info, and more
- **Mobile Friendly**: Works perfectly on all devices

## 📊 Data Source

The application uses real farmers market data from a CSV file containing:
- Market names and descriptions
- Full addresses and locations
- Operating hours and days
- Contact information (phone, email, website)
- Geographic data (county, state)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom components
- **Language**: TypeScript for type safety
- **Data**: CSV parsing with custom utilities
- **Icons**: Lucide React icons

## 🏃‍♂️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/markets/route.ts    # API endpoint for markets data
│   ├── markets/page.tsx        # All markets listing page
│   ├── page.tsx               # Home page with featured markets
│   └── farmers_markets (1).csv # Data source
├── components/
│   └── ui/                    # Reusable UI components
├── lib/
│   └── csv-utils.ts           # CSV parsing utilities
└── public/                    # Static assets
```

## 🎯 Key Components

### Home Page (`app/page.tsx`)
- Hero section with search functionality
- Featured markets display (first 6 from CSV)
- Statistics section
- Responsive navigation

### Markets Page (`app/markets/page.tsx`)
- Complete listing of all markets
- Search and filter functionality
- Sort by name, city, county, or state
- Loading states and error handling

### CSV Utilities (`lib/csv-utils.ts`)
- Parses CSV data with proper quote handling
- TypeScript interfaces for type safety
- Helper functions for data manipulation

### API Route (`app/api/markets/route.ts`)
- Serves CSV data as JSON
- Error handling and proper HTTP responses

## 🎨 Design Features

- **Green Theme**: Fresh, nature-inspired color scheme
- **Card Layout**: Clean, organized market information
- **Responsive Grid**: Adapts to different screen sizes
- **Hover Effects**: Interactive elements with smooth transitions
- **Typography**: Clear, readable text hierarchy

## 📱 Responsive Design

- **Mobile**: Single column layout with optimized spacing
- **Tablet**: Two-column grid for markets
- **Desktop**: Three-column grid with full navigation

## 🔧 Customization

### Adding More Markets
Simply update the CSV file with new market data following the same format.

### Styling Changes
Modify the Tailwind classes in the component files or update the global CSS.

### Data Structure
The CSV should include these columns:
- state_name, state_abbreviation, county_name
- market_name, market_description, market_address
- market_city, market_zipcode, market_latitude, market_longitude
- market_open_days, market_open_time, market_close_time
- market_website, market_phone, market_email

## 🚀 Deployment

This is a Next.js application that can be deployed to:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## 📄 License

This project is open source and available under the MIT License.
