'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Envelope, 
  Clock,
  Mountains,
  PaperPlaneTilt
} from '@phosphor-icons/react';
import { getImageFromCategory } from '@/lib/utils/imageUtils';

export default function ContactPage({
  params
}: {
  params: { locale: string };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would normally send the form data to your API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const heroImage = getImageFromCategory('hero', 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center text-green-700 hover:text-green-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.backToHome')}
          </Link>
          
          <div className="flex items-center space-x-3">
            <Mountains className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {t('contact.title')}
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              {t('contact.subtitle')}
            </h2>
            <p className="text-xl max-w-2xl">
              {t('contact.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t('contact.form.send')}
            </h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{t('contact.form.success')}</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{t('contact.form.error')}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-vertical"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt className="w-5 h-5 mr-2" />
                    {t('contact.form.send')}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info.address')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('contact.info.address')}
                    </h4>
                    <p className="text-gray-600">
                      Kaçkar Dağları Milli Parkı<br />
                      Rize, Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('contact.info.phone')}
                    </h4>
                    <p className="text-gray-600">
                      +90 464 XXX XX XX
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Envelope className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('contact.info.email')}
                    </h4>
                    <p className="text-gray-600">
                      info@discoverkackar.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('contact.info.workingHours')}
                    </h4>
                    <p className="text-gray-600">
                      {locale === 'tr' ? (
                        <>
                          Pazartesi - Cuma: 09:00 - 18:00<br />
                          Cumartesi - Pazar: 10:00 - 16:00
                        </>
                      ) : (
                        <>
                          Monday - Friday: 09:00 - 18:00<br />
                          Saturday - Sunday: 10:00 - 16:00
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'tr' ? 'Kaçkar Hakkında' : 'About Kaçkar'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {locale === 'tr' ? 
                  'Kaçkar Dağları, Doğu Karadeniz Bölgesi\'nde yer alan eşsiz doğal güzellikleri, zengin kültürel mirası ve macera dolu aktiviteleri ile ziyaretçilerine unutulmaz deneyimler sunar.' :
                  'The Kaçkar Mountains, located in the Eastern Black Sea Region, offer visitors unforgettable experiences with their unique natural beauty, rich cultural heritage, and adventurous activities.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}