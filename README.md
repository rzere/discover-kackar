# Discover Kaçkar - Website & Admin Panel

A modern, multilingual website for discoverkackar.com built with Next.js, TypeScript, and Tailwind CSS. Features a comprehensive content management system for managing the rich cultural and natural heritage of the Kaçkar Mountains.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)

## 🏔️ Project Overview

This project creates a multilingual (Turkish/English/French/German) website showcasing:
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
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (with mock fallback for development)
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
- Supabase account (for database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/discoverkackar-website.git
   cd discoverkackar-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database**
   ```bash
   # Install Supabase CLI (if not already installed)
   npm install -g supabase
   
   # Link to your Supabase project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - Turkish: [http://localhost:3000/tr](http://localhost:3000/tr)
   - English: [http://localhost:3000/en](http://localhost:3000/en)
   - French: [http://localhost:3000/fr](http://localhost:3000/fr)
   - German: [http://localhost:3000/de](http://localhost:3000/de)
   - Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 🔐 Admin Panel Access

For testing the admin panel, you can use the default credentials (configured via environment variables):
- **Email**: `admin@discoverkackar.com` (or set `ADMIN_EMAIL` in `.env.local`)
- **Password**: `admin123` (or set `ADMIN_PASSWORD` in `.env.local`)

**⚠️ Security Note**: Change these credentials in production by setting the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

## 🌐 Internationalization

The website supports multiple languages:
- **Turkish** (primary): `/tr/...`
- **English**: `/en/...`
- **French**: `/fr/...`
- **German**: `/de/...`

Translation files are located in the `locales/` directory:
- `locales/tr.json` - Turkish translations
- `locales/en.json` - English translations
- `locales/fr.json` - French translations
- `locales/de.json` - German translations

Default language: Turkish

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
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.com
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ADMIN_EMAIL=your-admin-email
   ADMIN_PASSWORD=your-secure-password
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `.next` folder** to your hosting provider

## 🔮 Future Enhancements

### Phase 2 - Backend Integration
- [x] Replace mock APIs with Supabase
- [x] Image upload and management
- [x] Real-time content updates
- [x] User roles and permissions
- [ ] Advanced image optimization
- [ ] Content versioning

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗄️ Database Schema

The project uses Supabase (PostgreSQL) with the following main tables:
- `profiles` - User profiles and roles
- `categories` - Content categories (multilingual)
- `subcategories` - Content subcategories (multilingual)
- `images` - Optimized image storage
- `pages` - Dynamic page content
- `site_settings` - Site configuration
- `contact_submissions` - Contact form submissions
- `cta_cards` - Call-to-action cards
- `footer` - Footer content (multilingual)

## 🔧 Database Migrations

The project includes comprehensive database migrations in the `supabase/migrations/` directory. To run all migrations:

```bash
supabase db push
```

Migration files are numbered sequentially and should be run in order. The migrations include:
- Initial schema setup
- Multilingual content structure
- Image optimization features
- Contact and CTA functionality
- French and German language support

## 🆘 Support

For support and questions:
- Email: info@discoverkackar.com
- Documentation: Check the project documentation
- Issues: Use [GitHub Issues](https://github.com/your-username/discoverkackar-website/issues) for bug reports
- Discussions: Use [GitHub Discussions](https://github.com/your-username/discoverkackar-website/discussions) for questions

## 🚨 Security

If you discover a security vulnerability, please report it responsibly:
1. Do not open a public issue
2. Email security@discoverkackar.com with details
3. We will respond within 48 hours

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

---

**Built with ❤️ for the beautiful Kaçkar Mountains** 🏔️
