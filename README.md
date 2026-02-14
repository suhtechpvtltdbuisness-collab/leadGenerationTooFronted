# LeadFlow Dashboard

A professional React-based Lead Management Dashboard built with Vite and Tailwind CSS.

## 🚀 Features

- **Dashboard Overview**: Display key metrics with interactive stats cards
- **Lead Management**: Track Hot Leads, Total Leads, Ongoing Leads, and Closed Leads
- **Client Insights**: View potential client needs (gain points) and roadblocks (pain points)
- **Lead Funnel Visualization**: Interactive funnel chart showing lead progression
- **Activity Feed**: Recent lead activities and updates
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Built with Tailwind CSS for a clean, professional look

## 📁 Project Structure

```
leadflow-dashboard/
├── src/
│   ├── components/
│   │   ├── ActivityFeed.jsx      # Recent lead activity timeline
│   │   ├── Dashboard.jsx         # Main dashboard component
│   │   ├── FunnelChart.jsx       # Lead funnel visualization
│   │   ├── Header.jsx            # Top navigation header
│   │   ├── InfoSection.jsx       # Info cards for gain/pain points
│   │   ├── Sidebar.jsx           # Left navigation sidebar
│   │   └── StatsCard.jsx         # Metric display cards
│   ├── App.jsx                   # Main app component
│   ├── index.css                 # Global styles with Tailwind
│   └── main.jsx                  # App entry point
├── public/
├── index.html
├── package.json
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── vite.config.js                # Vite configuration
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Inter Font** - Modern typography from Google Fonts

## 📦 Installation

1. Navigate to the project directory:
```bash
cd leadflow-dashboard
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## 🏗️ Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#2563eb',
        hover: '#1d4ed8',
      },
    },
  },
}
```

### Components
All components are located in `src/components/` and use Tailwind CSS classes for styling.

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Development

- Hot Module Replacement (HMR) enabled
- ESLint configured for code quality
- Fast refresh for instant updates

## 📄 License

© 2026 LeadFlow. All rights reserved.

## 👨‍💻 Author

Built with ❤️ using React, Vite, and Tailwind CSS
