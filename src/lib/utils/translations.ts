// Comprehensive translation utility for all 4 languages
export type Locale = 'tr' | 'en' | 'fr' | 'de';

export const translations = {
  // Hero section
  hero: {
    followTrails: {
      tr: 'Rotaları Keşfet',
      en: 'Follow the Trails',
      fr: 'Suivre les Sentiers',
      de: 'Wanderwege Folgen'
    },
    subtitle: {
      tr: 'Türkiye\'nin Gizli Dağ Cenneti',
      en: 'Turkey\'s Hidden Mountain Paradise',
      fr: 'Le Paradis Montagnard Caché de la Turquie',
      de: 'Türkeis Verstecktes Bergparadies'
    }
  },

  // Gallery section
  gallery: {
    title: {
      tr: 'Kaçkar\'dan Kareler',
      en: 'Glimpses of Kaçkar',
      fr: 'Aperçus de Kaçkar',
      de: 'Einblicke in Kaçkar'
    },
    description: {
      tr: 'Kaçkar Dağları\'nın büyüleyici manzaralarını keşfedin',
      en: 'Discover the enchanting landscapes of the Kaçkar Mountains',
      fr: 'Découvrez les paysages enchanteurs des montagnes de Kaçkar',
      de: 'Entdecken Sie die bezaubernden Landschaften der Kaçkar-Berge'
    }
  },

  // Categories section
  categories: {
    title: {
      tr: 'Kategorileri Keşfet',
      en: 'Explore Categories',
      fr: 'Explorer les Catégories',
      de: 'Kategorien Erkunden'
    },
    description: {
      tr: 'Özenle hazırlanmış kategorilerimiz aracılığıyla Kaçkar Dağları\'nın her yönünü keşfedin, her biri benzersiz deneyimler ve maceralar sunuyor.',
      en: 'Discover every aspect of Kaçkar Mountains through our carefully curated categories, each offering unique experiences and adventures.',
      fr: 'Découvrez tous les aspects des montagnes Kaçkar grâce à nos catégories soigneusement sélectionnées, chacune offrant des expériences et des aventures uniques.',
      de: 'Entdecken Sie jeden Aspekt der Kaçkar-Berge durch unsere sorgfältig kuratierten Kategorien, die jeweils einzigartige Erfahrungen und Abenteuer bieten.'
    },
    exploreButton: {
      tr: 'Keşfet',
      en: 'Explore',
      fr: 'Explorer',
      de: 'Erkunden'
    },
    exploreButtonWithArrow: {
      tr: 'Keşfet →',
      en: 'Explore →',
      fr: 'Explorer →',
      de: 'Erkunden →'
    }
  },

  // Contact/CTA buttons
  contact: {
    contactUs: {
      tr: 'İletişime Geçin',
      en: 'Contact Us',
      fr: 'Contactez-nous',
      de: 'Kontaktieren Sie uns'
    },
    getInTouch: {
      tr: 'İletişime Geçin',
      en: 'Get in Touch',
      fr: 'Entrer en contact',
      de: 'Kontakt aufnehmen'
    },
    contact: {
      tr: 'İletişim',
      en: 'Contact',
      fr: 'Contact',
      de: 'Kontakt'
    },
    form: {
      name: {
        tr: 'Ad Soyad',
        en: 'Full Name',
        fr: 'Nom complet',
        de: 'Vollständiger Name'
      },
      namePlaceholder: {
        tr: 'Adınızı ve soyadınızı girin',
        en: 'Enter your full name',
        fr: 'Entrez votre nom complet',
        de: 'Geben Sie Ihren vollständigen Namen ein'
      },
      email: {
        tr: 'E-posta Adresi',
        en: 'Email Address',
        fr: 'Adresse e-mail',
        de: 'E-Mail-Adresse'
      },
      emailPlaceholder: {
        tr: 'E-posta adresinizi girin',
        en: 'Enter your email address',
        fr: 'Entrez votre adresse e-mail',
        de: 'Geben Sie Ihre E-Mail-Adresse ein'
      },
      phone: {
        tr: 'Telefon Numarası',
        en: 'Phone Number',
        fr: 'Numéro de téléphone',
        de: 'Telefonnummer'
      },
      phonePlaceholder: {
        tr: 'Telefon numaranızı girin (isteğe bağlı)',
        en: 'Enter your phone number (optional)',
        fr: 'Entrez votre numéro de téléphone (optionnel)',
        de: 'Geben Sie Ihre Telefonnummer ein (optional)'
      },
      country: {
        tr: 'Ülke',
        en: 'Country',
        fr: 'Pays',
        de: 'Land'
      },
      countryPlaceholder: {
        tr: 'Ülkenizi seçin',
        en: 'Select your country',
        fr: 'Sélectionnez votre pays',
        de: 'Wählen Sie Ihr Land'
      },
      message: {
        tr: 'Mesaj',
        en: 'Message',
        fr: 'Message',
        de: 'Nachricht'
      },
      messagePlaceholder: {
        tr: 'Seyahat planlarınız, sorularınız veya size nasıl yardımcı olabileceğimiz hakkında bize bilgi verin...',
        en: 'Tell us about your travel plans, questions, or how we can help you...',
        fr: 'Parlez-nous de vos projets de voyage, questions ou comment nous pouvons vous aider...',
        de: 'Erzählen Sie uns von Ihren Reiseplänen, Fragen oder wie wir Ihnen helfen können...'
      },
      submit: {
        tr: 'Mesaj Gönder',
        en: 'Send Message',
        fr: 'Envoyer le message',
        de: 'Nachricht senden'
      },
      submitting: {
        tr: 'Gönderiliyor...',
        en: 'Sending...',
        fr: 'Envoi en cours...',
        de: 'Wird gesendet...'
      },
      successMessage: {
        tr: 'Teşekkürler! Mesajınız başarıyla gönderildi. 24 saat içinde size dönüş yapacağız.',
        en: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.',
        fr: 'Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.',
        de: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir werden Ihnen innerhalb von 24 Stunden antworten.'
      },
      errorMessage: {
        tr: 'Üzgünüz, mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
        en: 'Sorry, there was an error sending your message. Please try again.',
        fr: 'Désolé, une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.',
        de: 'Entschuldigung, beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      }
    }
  },

  // Footer
  footer: {
    subtitle: {
      tr: 'Türkiye\'nin Gizli Dağ Cenneti',
      en: 'Turkey\'s Hidden Mountain Paradise',
      fr: 'Le Paradis Montagnard Caché de la Turquie',
      de: 'Türkeis Verstecktes Bergparadies'
    }
  },

  // Event banner
  event: {
    utmbBanner: {
      tr: 'Kaçkar by UTMB 26-28 Eylül 2025',
      en: 'Kaçkar by UTMB 26-28 September 2025',
      fr: 'Kaçkar by UTMB 26-28 Septembre 2025',
      de: 'Kaçkar by UTMB 26-28 September 2025'
    }
  },

  // Category page
  category: {
    backToHome: {
      tr: 'Ana Sayfaya Dön',
      en: 'Back to Home',
      fr: 'Retour à l\'accueil',
      de: 'Zurück zur Startseite'
    },
    highlights: {
      tr: 'Öne Çıkanlar',
      en: 'Highlights',
      fr: 'Points forts',
      de: 'Höhepunkte'
    },
    readyToExplore: {
      tr: 'Keşfetmeye Hazır mısın?',
      en: 'Ready to Explore?',
      fr: 'Prêt à explorer?',
      de: 'Bereit zu erkunden?'
    },
    readyToExploreDescription: {
      tr: 'Mükemmel Kaçkar deneyiminizi planlamak için yerel uzmanlarla iletişime geçin.',
      en: 'Get in touch with local experts to plan your perfect Kaçkar experience.',
      fr: 'Contactez des experts locaux pour planifier votre expérience parfaite à Kaçkar.',
      de: 'Kontaktieren Sie lokale Experten, um Ihr perfektes Kaçkar-Erlebnis zu planen.'
    }
  }
};

export function getTranslation(key: string, locale: Locale): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value[k];
    if (value === undefined) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
  }
  
  if (typeof value === 'object' && value[locale]) {
    return value[locale];
  }
  
  console.warn(`Translation for locale "${locale}" not found for key "${key}"`);
  return value[locale] || value['en'] || key;
}

// Helper function for backward compatibility
export function getLocalizedText(
  jsonbContent: any, 
  fallbackText: string, 
  locale: Locale = 'en'
): string {
  if (!jsonbContent) return fallbackText;
  
  if (typeof jsonbContent === 'string') {
    return jsonbContent;
  }
  
  if (typeof jsonbContent === 'object') {
    return jsonbContent[locale] || jsonbContent['en'] || fallbackText;
  }
  
  return fallbackText;
}

// Helper function to get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname.startsWith('/fr')) return 'fr';
  if (pathname.startsWith('/de')) return 'de';
  if (pathname.startsWith('/en')) return 'en';
  return 'tr'; // default
}
