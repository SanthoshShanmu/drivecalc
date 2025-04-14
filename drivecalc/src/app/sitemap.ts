import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Norwegian pages
    {
      url: 'https://drivecalc.no',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: 'https://drivecalc.no/en',
          no: 'https://drivecalc.no',
        },
      },
    },
    {
      url: 'https://drivecalc.no/tips',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://drivecalc.no/en/tips',
          no: 'https://drivecalc.no/tips',
        },
      },
    },
    {
      url: 'https://drivecalc.no/faq',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://drivecalc.no/en/faq',
          no: 'https://drivecalc.no/faq',
        },
      },
    },
    
    // English pages
    {
      url: 'https://drivecalc.no/en',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          en: 'https://drivecalc.no/en',
          no: 'https://drivecalc.no',
        },
      },
    },
    {
      url: 'https://drivecalc.no/en/tips',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://drivecalc.no/en/tips',
          no: 'https://drivecalc.no/tips',
        },
      },
    },
    {
      url: 'https://drivecalc.no/en/faq',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://drivecalc.no/en/faq',
          no: 'https://drivecalc.no/faq',
        },
      },
    }
  ];
}