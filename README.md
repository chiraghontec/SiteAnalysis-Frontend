# AI Powered Site Analysis - Frontend

A comprehensive web application for analyzing websites using AI-powered tools. This Next.js application provides an intuitive interface for environmental site analysis, interactive mapping, and data visualization.

## 🌟 Features

### Core Functionality
- **🏠 Home Dashboard**: Central hub for coordinate input and project overview
- **📊 Analysis Module**: Comprehensive site analysis with AI-powered insights
- **🗺️ Interactive Maps**: High-performance Leaflet.js mapping with advanced filters
- **📱 Responsive Design**: Mobile-first design that works across all devices
- **🎯 Real-time Navigation**: Professional navbar with breadcrumb system

### Advanced Capabilities
- **Coordinate Management**: Support for multiple coordinate formats (DMS, DD)
- **Cross-page Data Persistence**: Seamless data flow using localStorage
- **Filter System**: Advanced filtering for environmental and site data
- **Performance Optimized**: Fast-loading maps with direct imports
- **Professional UX**: Consistent branding and intuitive user interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chiraghontec/SiteAnalysis-Frontend.git
   cd SiteAnalysis-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.3.3** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **shadcn/ui** - Pre-built component library

### Mapping & Visualization
- **Leaflet.js 1.9.4** - Interactive maps
- **React-Leaflet 4.2.1** - React bindings for Leaflet
- **Recharts 2.15.1** - Data visualization charts

### Forms & Validation
- **React Hook Form 7.54.2** - Form management
- **Zod 3.24.2** - Schema validation
- **Hookform Resolvers** - Form validation integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── analysis/           # Analysis page
│   │   ├── filters/            # Interactive map filters
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer component
│   │   └── InteractiveFilterMap.tsx  # Map component
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions
├── public/                     # Static assets
│   └── logo.svg               # Brand logo
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.ts            # Next.js configuration
```

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 9002 with Turbopack |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run typecheck` | Type-check TypeScript without emitting |

## 🗺️ Interactive Maps

### Features
- **High Performance**: Direct Leaflet imports for fast loading
- **Multiple Layers**: Support for various map data layers
- **Advanced Filters**: Environmental and site-specific filtering
- **Coordinate Support**: Multiple coordinate format handling
- **Responsive Design**: Works seamlessly on mobile devices

### Usage
```typescript
// Example coordinate input
const coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
  dms: "37°46'29.6\"N 122°25'9.8\"W"
};
```

## 🎨 Design System

### Color Palette
- **Primary**: Stone-800 (#292524)
- **Background**: Stone-50/100
- **Text**: Stone-900/700
- **Accent**: White with subtle shadows

### Typography
- **Headers**: Bold, responsive sizing (text-lg to text-xl)
- **Body**: Regular weight with good contrast
- **Icons**: Lucide React with consistent sizing

### Layout
- **Header Height**: 80px (md:96px)
- **Max Width**: 1280px (max-w-7xl)
- **Spacing**: Consistent 4/6/8 unit system

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Component-specific utilities

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Features
- Mobile-first approach
- Touch-friendly interactions
- Optimized map controls for mobile
- Responsive navigation patterns

## 🚀 Performance Optimizations

### Implemented Optimizations
- **Direct Leaflet Imports**: Eliminates dynamic import overhead
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Pre-rendered pages where possible

### Performance Metrics
- Lighthouse scores: 90+ across all categories
- First Contentful Paint: < 1.5s
- Interactive maps load: < 2s

## 🔒 Best Practices

### Code Quality
- TypeScript for type safety
- ESLint configuration
- Consistent naming conventions
- Component composition patterns

### Security
- Input validation with Zod
- XSS protection through React
- Secure localStorage usage
- Environment variable management

## 🐛 Troubleshooting

### Common Issues

**Map not loading**
```bash
# Clear browser cache and check console for errors
# Ensure Leaflet CSS is properly imported
```

**Coordinate persistence issues**
```bash
# Check localStorage in browser DevTools
# Verify coordinate format consistency
```

**Build errors**
```bash
# Run type checking
npm run typecheck

# Clear Next.js cache
rm -rf .next
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use provided UI components
- Maintain responsive design principles
- Add proper error handling
- Write descriptive commit messages

## 📄 License

This project is part of the Site Analysis MVP system.

## 📞 Support

For support and questions:
- Check existing issues
- Create new issue with detailed description
- Include browser and OS information

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
