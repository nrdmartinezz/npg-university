/**
 * Per-project configuration. This and `navigation.ts` are the two files that
 * must be filled in for every new site. Blank optional values ship nothing —
 * an empty analytics ID means that vendor's script is never emitted.
 */

export interface AnalyticsConfig {
  /** LogDash website ID (`data-website-id`). Blank skips the script. */
  logdash: string;
  ga4: string;
  gtm: string;
  metaPixel: string;
  bingUet: string;
  clarity: string;
}

export type SchemaBusinessType =
  | 'LocalBusiness'
  | 'ProfessionalService'
  | 'HomeAndConstructionBusiness'
  | 'Plumber'
  | 'Electrician'
  | 'RoofingContractor'
  | 'GeneralContractor'
  | 'Dentist'
  | 'Physician'
  | 'Attorney'
  | 'AccountingService'
  | 'InsuranceAgency'
  | 'RealEstateAgent';

export interface SiteConfig {
  /** Absolute origin, no trailing slash. Must match `site` in astro.config.mjs. */
  url: string;
  name: string;
  legalName?: string;
  tagline: string;
  description: string;
  locale: string;

  business: {
    schemaType: SchemaBusinessType;
    phone: string;
    /** Digits only, E.164 — used for tel: links. */
    phoneHref: string;
    email: string;
    address: {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    };
    /** Omit entirely for service-area businesses with no walk-in location. */
    geo?: { latitude: number; longitude: number };
    /** schema.org openingHours strings, e.g. 'Mo-Fr 08:00-17:00'. */
    hours: string[];
    priceRange?: string;
  };

  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
  };

  /** Absolute or site-relative path to the fallback Open Graph image. */
  defaultOgImage: string;

  /** Relative path to the PHP form handler. Blank disables all forms. */
  formEndpoint: string;

  /**
   * Google reCAPTCHA v3 site key (public). Blank skips the widget. The matching
   * secret is configured server-side in ~/private/site-mail.php.
   */
  recaptchaSiteKey: string;

  analytics: AnalyticsConfig;

  verification: {
    google: string;
    bing: string;
    meta: string;
  };

  /** 'none' is correct for US-only clients. Switch to 'banner' only when required. */
  consent: 'none' | 'banner';
}

export const site: SiteConfig = {
  url: 'https://example.com',
  name: 'New Patient Group',
  legalName: 'New Patient Group',
  tagline: 'Train your team on demand. Master consumer psychology.',
  description:
    'Battle-tested on-demand courses to train dental and orthodontic teams, master patient psychology, and convert more same-day starts.',
  locale: 'en-US',

  business: {
    schemaType: 'ProfessionalService',
    phone: '',
    phoneHref: '',
    email: 'hello@example.com',
    address: {
      street: '2064 Ever Red Court',
      locality: 'Colorado Springs',
      region: 'CO',
      postalCode: '80921',
      country: 'US',
    },
    hours: [],
  },

  social: {},

  defaultOgImage: '/og-default.png',

  formEndpoint: '/api/submit.php',
  recaptchaSiteKey: '',

  analytics: {
    logdash: '',
    ga4: '',
    gtm: '',
    metaPixel: '',
    bingUet: '',
    clarity: '',
  },

  verification: {
    google: '',
    bing: '',
    meta: '',
  },

  consent: 'none',
};

export const formattedAddress = [
  site.business.address.street,
  `${site.business.address.locality}, ${site.business.address.region} ${site.business.address.postalCode}`,
].join(', ');

/** LogDash site ID for LogDash.astro (`data-website-id`). Blank skips the script. */
export const logdashWebsiteId = site.analytics.logdash;

/** No configured third-party ID means the ad-tag bundle is never mounted. */
export const hasAnalytics = Object.entries(site.analytics).some(
  ([key, value]) => key !== 'logdash' && Boolean(value),
);
