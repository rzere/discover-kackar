'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/sections/ContactForm';
import { getImageUrl } from '@/lib/utils/imageUtils';
import SimpleNavbar from '@/components/layout/SimpleNavbar';
import { 
  MapPin, 
  Envelope,
  Phone, 
  FacebookLogo,
  InstagramLogo,
  TwitterLogo
} from '@phosphor-icons/react';

interface ContactPageProps {
  params: {
    locale: string;
  };
}

export default function ContactPage({ params }: ContactPageProps) {
  const [footerData, setFooterData] = useState<any>(null);
  const [contactPageData, setContactPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isEnglish = params.locale === 'en';

  // Helper function to get localized text from JSONB field
  const getLocalizedText = (jsonbField: any, fallback: string = '') => {
    if (!jsonbField) return fallback;
    if (typeof jsonbField === 'string') return jsonbField;
    return jsonbField[params.locale] || jsonbField['en'] || fallback;
  };

  const fetchData = async () => {
    // Removed minimum loading time for fastest possible loading
    setLoading(true);

    try {
      const [footerResponse, contactPageResponse] = await Promise.all([
        fetch(`/api/public/footer?locale=${params.locale}`),
        fetch(`/api/admin/contact-pages?locale=${params.locale}`)
      ]);

      if (footerResponse.ok) {
        const footerResult = await footerResponse.json();
        if (footerResult.data) {
          setFooterData(footerResult.data);
        }
      }

      if (contactPageResponse.ok) {
        const contactPageResult = await contactPageResponse.json();
        console.log('Contact page API response:', contactPageResult);
        if (contactPageResult.data && contactPageResult.data.length > 0) {
          setContactPageData(contactPageResult.data[0]); // Admin API returns array, we want first item
          console.log('Set contact page data:', contactPageResult.data[0]);
        }
      } else {
        console.error('Contact page API error:', contactPageResponse.status, contactPageResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.locale]);

  // Refresh data when page becomes visible (in case admin made changes)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [params.locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SimpleNavbar locale={params.locale} />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        {contactPageData?.hero_background_image_url ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${contactPageData.hero_background_image_url})`,
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10"></div>
        )}
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-black mb-6 leading-tight text-white drop-shadow-2xl">
            {getLocalizedText(contactPageData?.hero_title, isEnglish ? 'Contact Us' : 'İletişime Geçin')}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            {getLocalizedText(contactPageData?.hero_subtitle, isEnglish 
              ? 'Get in touch with us for any questions about your Kaçkar adventure' 
              : 'Kaçkar maceranız hakkında sorularınız için bizimle iletişime geçin')}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {getLocalizedText(contactPageData?.form_title, isEnglish ? 'Send us a Message' : 'Bize Mesaj Gönderin')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getLocalizedText(contactPageData?.form_description, isEnglish 
                ? 'Fill out the form below and we\'ll get back to you within 24 hours' 
                : 'Aşağıdaki formu doldurun, 24 saat içinde size dönüş yapacağız')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <ContactForm 
              translations={contactPageData ? {
                name: getLocalizedText(contactPageData.form_name, isEnglish ? 'Full Name' : 'Ad Soyad'),
                namePlaceholder: getLocalizedText(contactPageData.form_name_placeholder, isEnglish ? 'Enter your full name' : 'Adınızı ve soyadınızı girin'),
                email: getLocalizedText(contactPageData.form_email, isEnglish ? 'Email Address' : 'E-posta Adresi'),
                emailPlaceholder: getLocalizedText(contactPageData.form_email_placeholder, isEnglish ? 'Enter your email address' : 'E-posta adresinizi girin'),
                phone: getLocalizedText(contactPageData.form_phone, isEnglish ? 'Phone Number' : 'Telefon Numarası'),
                phonePlaceholder: getLocalizedText(contactPageData.form_phone_placeholder, isEnglish ? 'Enter your phone number (optional)' : 'Telefon numaranızı girin (isteğe bağlı)'),
                country: getLocalizedText(contactPageData.form_country, isEnglish ? 'Country' : 'Ülke'),
                countryPlaceholder: getLocalizedText(contactPageData.form_country_placeholder, isEnglish ? 'Select your country' : 'Ülkenizi seçin'),
                message: getLocalizedText(contactPageData.form_message, isEnglish ? 'Message' : 'Mesaj'),
                messagePlaceholder: getLocalizedText(contactPageData.form_message_placeholder, isEnglish ? 'Tell us about your travel plans, questions, or how we can help you...' : 'Seyahat planlarınız, sorularınız veya size nasıl yardımcı olabileceğimiz hakkında bize bilgi verin...'),
                submit: getLocalizedText(contactPageData.form_submit, isEnglish ? 'Send Message' : 'Mesaj Gönder'),
                submitting: getLocalizedText(contactPageData.form_submitting, isEnglish ? 'Sending...' : 'Gönderiliyor...'),
                successMessage: getLocalizedText(contactPageData.form_success_message, isEnglish ? 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.' : 'Teşekkürler! Mesajınız başarıyla gönderildi. 24 saat içinde size dönüş yapacağız.'),
                errorMessage: getLocalizedText(contactPageData.form_error_message, isEnglish ? 'Sorry, there was an error sending your message. Please try again.' : 'Üzgünüz, mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
              } : undefined}
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {getLocalizedText(contactPageData?.info_title, isEnglish ? 'Get in Touch' : 'İletişime Geçin')}
            </h2>
            <p className="text-lg text-gray-600">
              {getLocalizedText(contactPageData?.info_description, isEnglish 
                ? 'We\'re here to help you plan your perfect Kaçkar adventure' 
                : 'Mükemmel Kaçkar maceranızı planlamanıza yardımcı olmak için buradayız')}
            </p>
      </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Email */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getLocalizedText(contactPageData?.email_title, isEnglish ? 'Email Us' : 'E-posta Gönderin')}
              </h3>
              <p className="text-gray-600">
                {contactPageData?.email_value || 'info@discoverkackar.com'}
              </p>
            </div>

            {/* Phone */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getLocalizedText(contactPageData?.phone_title, isEnglish ? 'Call Us' : 'Bizi Arayın')}
              </h3>
              <p className="text-gray-600">
                {contactPageData?.phone_value || '+90 (555) 123-4567'}
                {/* Debug: {JSON.stringify(contactPageData?.phone_value)} */}
              </p>
              </div>

            {/* Response Time */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getLocalizedText(contactPageData?.response_title, isEnglish ? 'Response Time' : 'Yanıt Süresi')}
              </h3>
              <p className="text-gray-600">
                {getLocalizedText(contactPageData?.response_value, isEnglish ? 'Within 24 hours' : '24 saat içinde')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dynamic Footer */}
      <footer className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src="/logos/logo-main.png"
                  alt="Discover Kaçkar"
                  className="h-12 w-auto mr-3"
                  onError={(e) => {
                    console.log('Footer logo failed to load, trying UTMB logo');
                    e.currentTarget.src = '/logos/logo-UTMB.png';
                  }}
                />
                <h3 className="text-xl font-bold">
                  {footerData?.company_name || 'Discover Kaçkar'}
                </h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                {footerData?.company_description || (isEnglish 
                  ? 'Discover the breathtaking beauty of the Kaçkar Mountains through our comprehensive travel guide.' 
                  : 'Kapsamlı seyahat rehberimiz aracılığıyla Kaçkar Dağları\'nın nefes kesen güzelliğini keşfedin.')}
              </p>
              <div className="flex space-x-4">
                {footerData?.social_links?.facebook && (
                  <a href={footerData.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Facebook">
                    <FacebookLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.instagram && (
                  <a href={footerData.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Instagram">
                    <InstagramLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.twitter && (
                  <a href={footerData.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Twitter">
                    <TwitterLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.youtube && (
                  <a href={footerData.social_links.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
              </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {isEnglish ? 'Quick Links' : 'Hızlı Bağlantılar'}
              </h4>
              <ul className="space-y-2">
                {footerData?.quick_links && footerData.quick_links.length > 0 ? (
                  footerData.quick_links.map((link: any, index: number) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {isEnglish ? link.title_en : link.title_tr}
                      </a>
                    </li>
                  ))
                ) : (
                  <>
                    <li><a href={`/${params.locale}`} className="text-gray-300 hover:text-white transition-colors text-sm">{isEnglish ? 'Home' : 'Ana Sayfa'}</a></li>
                    <li><a href={`/${params.locale}/contact`} className="text-gray-300 hover:text-white transition-colors text-sm">{isEnglish ? 'Contact' : 'İletişim'}</a></li>
                  </>
                )}
              </ul>
          </div>

            {/* Contact Info */}
                  <div>
              <h4 className="text-lg font-semibold mb-4">
                {isEnglish ? 'Contact Info' : 'İletişim Bilgileri'}
                    </h4>
              <div className="space-y-3">
                {footerData?.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      {footerData.address}
                    </span>
                  </div>
                )}
                {footerData?.email && (
                  <div className="flex items-center space-x-2">
                    <Envelope size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${footerData.email}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {footerData.email}
                    </a>
                  </div>
                )}
                {footerData?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${footerData.phone}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {footerData.phone}
                    </a>
                  </div>
                )}
                {!footerData && (
                  <div className="text-gray-300 text-sm">
                    <p>{isEnglish ? 'Contact us for more information' : 'Daha fazla bilgi için bizimle iletişime geçin'}</p>
                  </div>
                )}
                </div>
              </div>
            </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-400">
                {footerData?.copyright_text || `© ${new Date().getFullYear()} Discover Kaçkar. ${isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}`}
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end space-x-4 sm:space-x-6">
                {footerData?.legal_links && footerData.legal_links.length > 0 ? (
                  footerData.legal_links.map((link: any, index: number) => (
                    <a 
                      key={index}
                      href={link.url} 
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {isEnglish ? link.title_en : link.title_tr}
                    </a>
                  ))
                ) : (
                  <>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{isEnglish ? 'Privacy Policy' : 'Gizlilik Politikası'}</a>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{isEnglish ? 'Terms of Service' : 'Hizmet Şartları'}</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}