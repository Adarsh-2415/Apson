import type {
  CompanyIntroData,
  FeaturedProductsSectionData,
  WhyApsonSectionData,
  ContactCTASectionData,
  ManpowerSectionData,
  AboutPageData,
  Product,
  ProductsPageData,
} from '@/types/cms'

export const DEFAULT_COMPANY_INTRO_DATA: CompanyIntroData = {
  eyebrow: 'ABOUT APSON INDUSTRIES',
  heading: 'Engineering & Testing Solutions for Industrial Applications',
  descriptionParagraphs: [
    'APSON INDUSTRIES is engaged in the manufacturing of electrodynamic vibration shaker systems, modular power amplifiers, digital vibration controllers, vibration control software and a wide range of testing and engineering equipment.',
    'Our product portfolio includes vibration, shock and impact testing systems, environmental test chambers, specialized testing machines, mechanical items, electrical/electronic assemblies and cable harness assemblies.',
  ],
  ctaText: 'Discover APSON Industries',
  ctaHref: '/about',
  imageSrc: '/images/slider-1.jpg',
  imageAlt: 'APSON INDUSTRIES Engineering & Testing Equipment Manufacturing',
}

export const INITIAL_PRODUCTS_LIST: Product[] = [
  {
    id: 'prod-1',
    name: 'Electrodynamic Vibration Testing System',
    slug: 'electrodynamic-vibration-testing-system',
    category: 'Vibration Testing Systems',
    shortDescription:
      'Advanced shaker systems engineered for sine, random, shock, and resonance search testing up to +4000 Kgf.',
    imageSrc: '/images/slider-1.jpg',
    imageAlt: 'Electrodynamic Vibration Testing System',
    highlights: [
      'Sine, Random & Shock Testing',
      'Up to +4000 Kgf Thrust Rating',
      'Digital Vibration Control Interface',
    ],
    isPublished: true,
    isFeatured: true,
    displayOrder: 1,
  },
  {
    id: 'prod-2',
    name: 'Combined Horizontal Slip Table with Electrodynamic Vibration Shaker',
    slug: 'combined-horizontal-slip-table',
    category: 'Vibration Testing Systems',
    shortDescription:
      'Combo base horizontal slip table integrated with an electrodynamic vibration shaker system, used for industrial and laboratory durability testing.',
    imageSrc: '/images/slider-2.jpg',
    imageAlt: 'Combined Horizontal Slip Table with Electrodynamic Vibration Shaker',
    highlights: [
      'Integrated Combo Base Architecture',
      'Horizontal & Vertical Testing Capability',
      'High Precision Hydrodynamic Bearings',
    ],
    isPublished: true,
    isFeatured: true,
    displayOrder: 2,
  },
  {
    id: 'prod-3',
    name: 'Vibration Test Head Expander',
    slug: 'vibration-test-head-expander',
    category: 'Vibration Testing Systems',
    shortDescription:
      'Head expanders designed to extend the mounting area of electrodynamic shakers for large specimen testing.',
    imageSrc: '/images/slider-3.jpg',
    imageAlt: 'Vibration Test Head Expander',
    highlights: [
      'Extended Specimen Mounting Area',
      'Lightweight Alloy Fabrication',
      'Low Resonance Frequency',
    ],
    isPublished: true,
    isFeatured: true,
    displayOrder: 3,
  },
  {
    id: 'prod-4',
    name: 'Shock & Bump Test Machine',
    slug: 'shock-bump-test-machine',
    category: 'Mechanical Testing Equipment',
    shortDescription:
      'Shock and bump test machine used for mechanical testing and evaluating product durability under impact or acceleration loads.',
    imageSrc: '/images/slider-3.jpg',
    imageAlt: 'Shock & Bump Test Machine',
    highlights: [
      'Repetitive Bump & Half-Sine Impact Testing',
      'Heavy-Duty Mechanical Frame',
      'Programmable Drop Acceleration',
    ],
    isPublished: true,
    isFeatured: true,
    displayOrder: 4,
  },
  {
    id: 'prod-5',
    name: 'Dust Test Chamber',
    slug: 'dust-test-chamber',
    category: 'Environmental Testing Equipment',
    shortDescription:
      'Dust ingress protection test chamber designed for evaluating component sealing and reliability under dusty environmental conditions.',
    imageSrc: '/images/slider-2.jpg',
    imageAlt: 'Dust Test Chamber',
    highlights: [
      'Ingress Protection Evaluation',
      'Controlled Dust Agitation System',
      'Transparent Inspection Window',
    ],
    isPublished: true,
    isFeatured: true,
    displayOrder: 5,
  },
  {
    id: 'prod-6',
    name: 'Industrial Centrifugal Fan',
    slug: 'industrial-centrifugal-fan',
    category: 'Industrial Equipment',
    shortDescription:
      'This industrial centrifugal fan features a heavy-duty scroll housing, an integrated electric motor with direct drive mounting, and an extended rectangular inlet/outlet duct assembly. It is commonly utilized in manufacturing facilities for material conveying, ventilation, combustion supply, or dust collection.',
    imageSrc: '/images/slider-1.jpg',
    imageAlt: 'Industrial Centrifugal Fan',
    highlights: [
      'Heavy-Duty Scroll Housing',
      'Direct Drive Motor Mounting',
      'Ventilation & Material Conveying',
    ],
    isPublished: true,
    isFeatured: true,
    displayOrder: 6,
  },
]

export const DEFAULT_FEATURED_PRODUCTS_DATA: FeaturedProductsSectionData = {
  eyebrow: 'OUR PRODUCTS',
  heading: 'Featured Testing & Engineering Solutions',
  description:
    "Explore APSON Industries' range of testing systems, environmental chambers, vibration equipment and specialized engineering solutions.",
  ctaText: 'View All Products',
  ctaHref: '/products',
  products: INITIAL_PRODUCTS_LIST,
}

export const DEFAULT_CONTACT_CTA_DATA: ContactCTASectionData = {
  eyebrow: "LET'S DISCUSS YOUR REQUIREMENT",
  heading: 'Looking for the Right Testing Solution?',
  description:
    'Whether you require vibration testing equipment, environmental chambers, shock testing systems or specialized engineering assemblies, get in touch with APSON Industries to discuss your requirements.',
  primaryCtaText: 'Contact Us',
  primaryCtaHref: '/contact',
  secondaryCtaText: 'View Products',
  secondaryCtaHref: '/products',
}

export const DEFAULT_PRODUCTS_PAGE_DATA: ProductsPageData = {
  hero: {
    eyebrow: 'OUR PRODUCTS',
    heading: 'Engineered Solutions for Testing & Industrial Applications',
    description:
      'Explore APSON Industries’ comprehensive range of electrodynamic vibration shaker systems, environmental test chambers, shock testing machines, and specialized industrial equipment.',
    breadcrumbText: 'Home / Products',
    imageSrc: '/images/slider-1.jpg',
    imageAlt: 'APSON INDUSTRIES Product Catalogue',
  },
  categories: [
    'All Products',
    'Vibration Testing Systems',
    'Mechanical Testing Equipment',
    'Environmental Testing Equipment',
    'Industrial Equipment',
  ],
  products: INITIAL_PRODUCTS_LIST,
  cta: DEFAULT_CONTACT_CTA_DATA,
}

export const DEFAULT_WHY_APSON_DATA: WhyApsonSectionData = {
  eyebrow: 'WHY APSON INDUSTRIES',
  heading: 'A Comprehensive Approach to Testing & Engineering',
  introduction:
    'APSON Industries brings together a broad range of testing equipment and engineering capabilities to address different industrial testing requirements.',
  features: [
    {
      number: '01',
      title: 'Comprehensive Product Range',
      description:
        'Vibration, shock, environmental and specialized testing solutions across a broad range of industrial requirements.',
      iconName: 'Layers',
    },
    {
      number: '02',
      title: 'Integrated Engineering Capabilities',
      description:
        'Mechanical, electrical and electronic assemblies form part of our product and engineering portfolio.',
      iconName: 'Cpu',
    },
    {
      number: '03',
      title: 'Specialized Testing Solutions',
      description:
        'Solutions covering vibration, temperature, humidity, thermal shock, rain, dust, salt spray and other testing requirements.',
      iconName: 'Sliders',
    },
    {
      number: '04',
      title: 'Industrial-Focused Solutions',
      description:
        'Equipment and systems developed around practical testing and engineering requirements.',
      iconName: 'Wrench',
    },
  ],
}



export const DEFAULT_MANPOWER_DATA: ManpowerSectionData = {
  eyebrow: 'HUMAN CAPITAL & CAPABILITY',
  heading: 'Our Workforce',
  description: 'A dedicated team working together to deliver reliable industrial solutions.',
  technical: 3,
  nonTechnical: 4,
  skilled: 2,
  semiUnskilled: 2,
}

/* ==========================================================================
   DEFAULT ABOUT PAGE CMS SEED DATA
   ========================================================================== */

export const DEFAULT_ABOUT_PAGE_DATA: AboutPageData = {
  hero: {
    eyebrow: 'ABOUT APSON INDUSTRIES',
    heading: 'Pioneering Engineering & Testing Systems',
    description:
      'APSON INDUSTRIES is an established manufacturer of electrodynamic vibration shaker systems, environmental test chambers, and specialized engineering equipment based in Roorkee, Uttarakhand, India.',
    breadcrumbText: 'Home / About Us',
    imageSrc: '/images/slider-2.jpg',
    imageAlt: 'APSON INDUSTRIES Engineering & Testing Facility',
  },
  intro: {
    eyebrow: 'OUR BACKGROUND & FOCUS',
    heading: 'Dedicated to Industrial Precision & Reliability',
    paragraphs: [
      'APSON INDUSTRIES is engaged in the manufacturing of electrodynamic vibration shaker systems up to +4000 Kgf, modular power amplifiers, digital vibration controllers, vibration control software and specialized testing machines.',
      'Our product portfolio spans vibration, shock and impact testing systems, environmental test chambers, mechanical items, electrical/electronic assemblies and cable harness assemblies.',
    ],
    imageSrc: '/images/slider-3.jpg',
    imageAlt: 'APSON Equipment Manufacturing',
    highlights: [
      'Electrodynamic Shakers up to +4000 Kgf',
      'Environmental & Thermal Test Chambers',
      'IPX9K Jet Washing Systems',
      'Custom Cable Harness & Assemblies',
    ],
  },
  statistics: [
    {
      id: 'stat-1',
      label: 'Vibration Capacity',
      value: '+4000',
      suffix: 'Kgf',
      iconName: 'Activity',
      isVisible: true,
    },
    {
      id: 'stat-2',
      label: 'Core Categories',
      value: '4+',
      suffix: 'Systems',
      iconName: 'Grid',
      isVisible: true,
    },
    {
      id: 'stat-3',
      label: 'Facility Location',
      value: 'Roorkee',
      suffix: 'India',
      iconName: 'MapPin',
      isVisible: true,
    },
  ],
  missionVision: {
    mission: {
      heading: 'Our Mission',
      description:
        'To manufacture and deliver robust, highly accurate electrodynamic vibration testing systems and environmental test chambers that empower industries to achieve peak product reliability.',
      iconName: 'Target',
    },
    vision: {
      heading: 'Our Vision',
      description:
        'To be a recognized leader in industrial testing equipment manufacturing, expanding advanced engineering capabilities across specialized environmental and mechanical testing systems.',
      iconName: 'Eye',
    },
  },
  whyChoose: {
    eyebrow: 'WHY CHOOSE APSON',
    heading: 'Key Strengths & Engineering Portfolio',
    items: [
      {
        id: 'why-1',
        title: 'Quality Assurance',
        description:
          'Rigorous in-house engineering and calibration across all vibration shaker systems and test chambers.',
        iconName: 'ShieldCheck',
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: 'why-2',
        title: 'Reliable Products',
        description:
          'Built for long-term operational durability under demanding industrial testing standards.',
        iconName: 'CheckCircle2',
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: 'why-3',
        title: 'Technical Expertise',
        description:
          'Specialized capabilities covering mechanical, electrical, and electronic assembly integration.',
        iconName: 'Cpu',
        displayOrder: 3,
        isVisible: true,
      },
      {
        id: 'why-4',
        title: 'Customer-Centric Approach',
        description:
          'Customized equipment configurations designed around practical industrial testing requirements.',
        iconName: 'UserCheck',
        displayOrder: 4,
        isVisible: true,
      },
      {
        id: 'why-5',
        title: 'Timely Delivery',
        description:
          'Streamlined production and manufacturing workflows at our Civil Lines facility in Roorkee.',
        iconName: 'Clock',
        displayOrder: 5,
        isVisible: true,
      },
      {
        id: 'why-6',
        title: 'Industry Experience',
        description:
          'Proven capability in shock, impact, environmental, and vibration testing equipment manufacturing.',
        iconName: 'Award',
        displayOrder: 6,
        isVisible: true,
      },
    ],
  },
  coreValues: {
    eyebrow: 'OUR FOUNDATIONAL PRINCIPLES',
    heading: 'Core Values Driving Our Engineering',
    items: [
      {
        id: 'val-1',
        title: 'Quality',
        description:
          'Uncompromised build quality and testing precision in every equipment assembly.',
        iconName: 'Award',
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: 'val-2',
        title: 'Integrity',
        description:
          'Transparent commercial operations and honest engineering specifications.',
        iconName: 'Shield',
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: 'val-3',
        title: 'Innovation',
        description:
          'Continuous development of digital vibration controllers and control software.',
        iconName: 'Zap',
        displayOrder: 3,
        isVisible: true,
      },
      {
        id: 'val-4',
        title: 'Reliability',
        description:
          'Equipment designed for continuous industrial testing operations.',
        iconName: 'Anchor',
        displayOrder: 4,
        isVisible: true,
      },
      {
        id: 'val-5',
        title: 'Customer Satisfaction',
        description:
          'Dedicated technical support and guidance for testing equipment setup.',
        iconName: 'Heart',
        displayOrder: 5,
        isVisible: true,
      },
      {
        id: 'val-6',
        title: 'Continuous Improvement',
        description:
          'Regular enhancement of manufacturing processes and component quality.',
        iconName: 'TrendingUp',
        displayOrder: 6,
        isVisible: true,
      },
    ],
  },
  industries: {
    eyebrow: 'APPLICATIONS & SECTORS',
    heading: 'Industries We Serve',
    description:
      'APSON Industries provides testing systems and assemblies utilized across diverse engineering sectors.',
    items: [
      {
        id: 'ind-1',
        name: 'Automotive & Aerospace Testing',
        description:
          'Vibration shaker systems, thermal shock chambers, and specialized cable harness assemblies.',
        iconName: 'Car',
        displayOrder: 1,
        isActive: true,
      },
      {
        id: 'ind-2',
        name: 'Electronics & Defense Systems',
        description:
          'Bump, impact, and digital vibration controllers for rugged electronic components.',
        iconName: 'Radio',
        displayOrder: 2,
        isActive: true,
      },
      {
        id: 'ind-3',
        name: 'Environmental Reliability',
        description:
          'Rain, dust, salt spray, and IPX9K jet washing test enclosures.',
        iconName: 'CloudRain',
        displayOrder: 3,
        isActive: true,
      },
      {
        id: 'ind-4',
        name: 'Industrial Manufacturing',
        description:
          'Heating ovens, walk-in chambers, and custom mechanical items.',
        iconName: 'Factory',
        displayOrder: 4,
        isActive: true,
      },
    ],
  },
  qualityManufacturing: {
    eyebrow: 'PRODUCTION & QUALITY CONTROL',
    heading: 'High-Precision Manufacturing Standards',
    paragraphs: [
      'Every piece of equipment manufactured at APSON Industries undergoes comprehensive quality checks and validation protocols to ensure strict compliance with industrial testing standards.',
      'From electrical assembly wiring to mechanical frame fabrication and amplifier calibration, quality control is integrated into every phase of manufacturing.',
    ],
    imageSrc: '/images/slider-1.jpg',
    imageAlt: 'Quality Control & Manufacturing Facility',
    featureList: [
      'Process Excellence & Quality Control',
      'In-House Electrical & Electronic Assembly',
      'Vibration & Environmental System Calibration',
      'Robust Mechanical Fabrication',
    ],
  },
  milestones: {
    eyebrow: 'OUR MILESTONES',
    heading: 'Building Industrial Testing Excellence',
    description:
      'Key operational milestones of APSON Industries in Roorkee, India.',
    isVisible: true,
    items: [
      {
        id: 'm-1',
        year: 'Phase 1',
        title: 'Foundation in Roorkee',
        description:
          'Established manufacturing operations in Civil Lines, Roorkee for engineering equipment.',
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: 'm-2',
        year: 'Phase 2',
        title: 'Vibration & Amplifiers Portfolio',
        description:
          'Expanded into electrodynamic vibration systems up to +4000 Kgf and modular power amplifiers.',
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: 'm-3',
        year: 'Phase 3',
        title: 'Environmental & IPX9K Enclosures',
        description:
          'Introduced environmental chambers, thermal shock units, and IPX9K high-pressure jet washers.',
        displayOrder: 3,
        isVisible: true,
      },
    ],
  },
  cta: {
    eyebrow: 'LOOKING FOR RELIABLE INDUSTRIAL SOLUTIONS?',
    heading: 'Discuss Your Testing Equipment Requirement',
    description:
      'Get in touch with APSON Industries to discuss vibration shaker systems, environmental chambers, or custom engineering assemblies.',
    primaryCtaText: 'Explore Products',
    primaryCtaHref: '/products',
    secondaryCtaText: 'Contact Us',
    secondaryCtaHref: '/contact',
    isVisible: true,
  },
}
