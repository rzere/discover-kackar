import SimpleNavbar from './SimpleNavbar';
import SimpleFooter from './SimpleFooter';

interface SimpleMainLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function SimpleMainLayout({ children, locale }: SimpleMainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <SimpleNavbar locale={locale} />
      <main>
        {children}
      </main>
      <SimpleFooter locale={locale} />
    </div>
  );
}