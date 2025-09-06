# Discover Kaçkar - Website & Admin Panel

A modern, bilingual website for discoverkackar.com built with Next.js, TypeScript, and Tailwind CSS. Features a comprehensive content management system for managing the rich cultural and natural heritage of the Kaçkar Mountains.

## 🏔️ Project Overview

This project creates a dual-language (Turkish/English) website showcasing:
- **Nature & Adventure**: Hiking, UTMB routes, cycling, water sports, winter activities
- **Culture & Local Life**: Hemşin & Laz cultures, village life, traditional crafts
- **Gastronomy**: Local flavors, traditional cooking, tea culture
- **Music & Dance**: Horon, Tulum, Kemençe traditions
- **Sustainable Tourism**: Eco-friendly practices and local community support
- **Health & Wellness**: Highland yoga, thermal springs
- **Photography & Art**: Seasonal routes, artist programs
- **Educational Tourism**: Biology, geology, craftsmanship programs
- **Events & Festivals**: Local celebrations and cultural events

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Fonts**: Instrument Serif (headings) + Lato (body)
- **Icons**: Phosphor Icons
- **Internationalization**: next-intl
- **Authentication**: Mock auth (ready for Supabase integration)
- **Color Scheme**: 
  - Primary Green: `#67C090`
  - Secondary Mint: `#DDF4E7` 
  - Teal: `#26667F`
  - Navy: `#124170`

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Homepage
│   │   └── category/      # Category pages
│   ├── admin/             # Admin panel
│   │   ├── login/         # Admin login
│   │   ├── dashboard/     # Admin dashboard
│   │   └── content/       # Content management
│   └── api/               # API routes
├── components/
│   ├── layout/            # Layout components
│   ├── sections/          # Page sections
│   └── admin/             # Admin components
├── lib/
│   ├── types/             # TypeScript types
│   ├── data/              # Mock data
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions
└── locales/               # Translation files
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd discoverkackar-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Copy assets (optional)**
   ```bash
   # Copy images from the assets folder to public/images/
   cp -r ../assets/* public/images/
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - Turkish: [http://localhost:3000/tr](http://localhost:3000/tr)
   - English: [http://localhost:3000/en](http://localhost:3000/en)
   - Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 🔐 Admin Panel Access

For testing the admin panel:
- **Email**: `admin@discoverkackar.com`
- **Password**: `admin123`

## 🌐 Internationalization

The website supports Turkish (primary) and English:
- Routes: `/tr/...` and `/en/...`
- Translation files: `locales/tr.json` and `locales/en.json`
- Default language: Turkish

## 📊 Content Management

The admin panel includes:
- **Dashboard**: Overview and quick actions
- **Content Management**: CRUD operations for all content
- **Category Management**: Organize content by categories
- **Language Management**: Edit content in both languages
- **Authentication**: Secure login system

## 🎨 Design System

### Typography
- **Headings**: Instrument Serif (classical, mountain-inspired)
- **Body Text**: Lato (modern, readable)

### Colors
- **Primary Green**: Nature and growth (`#67C090`)
- **Secondary Mint**: Fresh, clean accent (`#DDF4E7`)
- **Teal**: Mountain water (`#26667F`)
- **Navy**: Deep, adventurous (`#124170`)

### Components
- Responsive navigation with language switcher
- Hero sections with mountain-inspired gradients
- Card-based layouts for easy scanning
- Admin interface with modern dashboard design

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Key Features

1. **Responsive Design**: Mobile-first approach
2. **Performance**: Optimized images and fonts
3. **SEO**: Proper meta tags and structured data
4. **Accessibility**: WCAG compliant components
5. **Internationalization**: Complete i18n support

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Environment Variables**
   Set up the following in Vercel dashboard:
   ```
   NEXTAUTH_SECRET=your-secret-key
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `.next` folder** to your hosting provider

## 🔮 Future Enhancements

### Phase 2 - Backend Integration
- [ ] Replace mock APIs with Supabase
- [ ] Image upload and management
- [ ] Real-time content updates
- [ ] User roles and permissions

### Phase 3 - Advanced Features
- [ ] Search functionality
- [ ] Event booking system
- [ ] Interactive maps
- [ ] Multi-media galleries
- [ ] Newsletter integration
- [ ] Social media integration

### Phase 4 - Analytics & Optimization
- [ ] Google Analytics integration
- [ ] Performance monitoring
- [ ] A/B testing
- [ ] Advanced SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

For support and questions:
- Email: info@discoverkackar.com
- Documentation: Check the `/docs` folder
- Issues: Use GitHub Issues for bug reports

---

**Built with ❤️ for the beautiful Kaçkar Mountains** 🏔️
