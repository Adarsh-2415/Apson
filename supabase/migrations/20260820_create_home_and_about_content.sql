-- ============================================================================
-- APSON INDUSTRIES — HOME & ABOUT US PAGE CONTENT MASTER MIGRATION & SEED
-- Dollar-quoted ($JSON$...$JSON$) to prevent any single-quote escaping errors
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENSURE PAGE RECORDS EXIST IN PUBLIC.PAGES
-- ----------------------------------------------------------------------------

-- Ensure Home Page Record Exists
INSERT INTO public.pages (id, title, slug, status, seo_title, seo_description)
VALUES (
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Home',
  '/',
  'published',
  'APSON Industries — Engineering & Industrial Solutions',
  'Leading industrial manufacturer & testing equipment solutions provider.'
)
ON CONFLICT (slug) DO NOTHING;

-- Ensure About Us Page Record Exists
INSERT INTO public.pages (id, title, slug, status, seo_title, seo_description)
VALUES (
  'a1b2c3d4-0002-4000-8000-000000000002',
  'About Us',
  '/about',
  'published',
  'About APSON Industries — Quality & Innovation',
  'Learn about APSON Industries mission, vision, workforce, and manufacturing capabilities.'
)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. SEED HOME PAGE CONTENT INTO PUBLIC.PAGE_SECTIONS
-- ----------------------------------------------------------------------------
INSERT INTO public.page_sections (id, page_id, section_type, content, display_order, is_visible)
VALUES (
  'b1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'home_page_content',
  $JSON${
    "heroSlides": [
      {
        "id": "slide-1",
        "title": "Electrodynamic Vibration Testing Systems",
        "subtitle": "Advanced Shaker Systems, Controllers & Power Amplifiers Engineered for Precision Testing up to +4000 Kgf.",
        "primaryCtaText": "Explore Shaker Systems",
        "primaryCtaHref": "/products",
        "secondaryCtaText": "Technical Inquiry",
        "secondaryCtaHref": "/contact",
        "imageSrc": "/images/slider-1.jpg",
        "imageAlt": "Electrodynamic Vibration Testing Systems"
      },
      {
        "id": "slide-2",
        "title": "Custom Environmental Test Chambers",
        "subtitle": "High-Performance Rain, Dust, Thermal & Humidity Chambers Built for Harsh Industrial Operations.",
        "primaryCtaText": "View Environmental Line",
        "primaryCtaHref": "/products",
        "secondaryCtaText": "Discuss Requirements",
        "secondaryCtaHref": "/contact",
        "imageSrc": "/images/slider-2.jpg",
        "imageAlt": "Custom Environmental Test Chambers"
      },
      {
        "id": "slide-3",
        "title": "Specialized Mechanical & Electronics Assemblies",
        "subtitle": "Delivering Rugged Mechanical Fixtures, Cable Harnessing & Electronics Assemblies for Industrial Applications.",
        "primaryCtaText": "Our Capabilities",
        "primaryCtaHref": "/about",
        "secondaryCtaText": "Get In Touch",
        "secondaryCtaHref": "/contact",
        "imageSrc": "/images/slider-3.jpg",
        "imageAlt": "Specialized Mechanical & Electronics Assemblies"
      }
    ],
    "companyIntro": {
      "eyebrow": "ABOUT APSON INDUSTRIES",
      "heading": "Engineering & Testing Solutions for Industrial Applications",
      "descriptionParagraphs": [
        "APSON INDUSTRIES is engaged in the manufacturing of electrodynamic vibration shaker systems, modular power amplifiers, digital vibration controllers, vibration control software and a wide range of testing and engineering equipment.",
        "Our product portfolio includes vibration, shock and impact testing systems, environmental test chambers, specialized testing machines, mechanical items, electrical/electronic assemblies and cable harness assemblies."
      ],
      "ctaText": "Discover APSON Industries",
      "ctaHref": "/about",
      "imageSrc": "/images/slider-1.jpg",
      "imageAlt": "APSON INDUSTRIES Engineering & Testing Equipment Manufacturing"
    },
    "manpower": {
      "eyebrow": "HUMAN CAPITAL & CAPABILITY",
      "heading": "Our Workforce",
      "description": "A dedicated team working together to deliver reliable industrial solutions.",
      "technical": 3,
      "nonTechnical": 4,
      "skilled": 2,
      "semiUnskilled": 2
    },
    "whyApson": {
      "eyebrow": "WHY APSON INDUSTRIES",
      "heading": "A Comprehensive Approach to Testing & Engineering",
      "introduction": "APSON Industries brings together a broad range of testing equipment and engineering capabilities to address different industrial testing requirements.",
      "features": [
        {
          "number": "01",
          "title": "Comprehensive Product Range",
          "description": "Vibration, shock, environmental and specialized testing solutions across a broad range of industrial requirements.",
          "iconName": "Layers"
        },
        {
          "number": "02",
          "title": "Integrated Engineering Capabilities",
          "description": "Mechanical, electrical and electronic assemblies form part of our product and engineering portfolio.",
          "iconName": "Cpu"
        },
        {
          "number": "03",
          "title": "Specialized Testing Solutions",
          "description": "Solutions covering vibration, temperature, humidity, thermal shock, rain, dust, salt spray and other testing requirements.",
          "iconName": "Sliders"
        },
        {
          "number": "04",
          "title": "Industrial-Focused Solutions",
          "description": "Equipment and systems developed around practical testing and engineering requirements.",
          "iconName": "Wrench"
        }
      ]
    },
    "cta": {
      "eyebrow": "READY TO ELEVATE YOUR TESTING CAPABILITIES?",
      "heading": "Partner with APSON Industries",
      "description": "Discuss your vibration shaker, environmental chamber, or custom engineering requirements with our specialists in Roorkee.",
      "primaryCtaText": "Explore Products",
      "primaryCtaHref": "/products",
      "secondaryCtaText": "Contact Us",
      "secondaryCtaHref": "/contact"
    }
  }$JSON$::jsonb,
  1,
  true
)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content;

-- ----------------------------------------------------------------------------
-- 3. SEED ABOUT US PAGE CONTENT INTO PUBLIC.PAGE_SECTIONS
-- ----------------------------------------------------------------------------
INSERT INTO public.page_sections (id, page_id, section_type, content, display_order, is_visible)
VALUES (
  'b1b2c3d4-0002-4000-8000-000000000002',
  'a1b2c3d4-0002-4000-8000-000000000002',
  'about_page_content',
  $JSON${
    "hero": {
      "eyebrow": "ABOUT APSON INDUSTRIES",
      "heading": "Engineered for Precision, Quality & Durability",
      "description": "Discover our journey in manufacturing electrodynamic vibration systems, environmental test chambers, and custom engineering assemblies.",
      "breadcrumbText": "Home / About Us",
      "imageSrc": "/images/slider-1.jpg",
      "imageAlt": "About APSON Industries"
    },
    "intro": {
      "eyebrow": "OUR CORE IDENTITY",
      "heading": "Leading Manufacturer of Industrial Testing Systems in India",
      "paragraphs": [
        "APSON INDUSTRIES, based in Roorkee, India, is engaged in manufacturing electrodynamic vibration shaker systems, modular power amplifiers, digital vibration controllers, and environmental test enclosures.",
        "With a strong foundation in mechanical, electrical, and electronic engineering, we deliver comprehensive testing machinery tailored to stringent industrial standards."
      ],
      "imageSrc": "/images/slider-2.jpg",
      "imageAlt": "APSON Manufacturing Facility"
    },
    "statistics": [
      {
        "id": "stat-1",
        "label": "Technical Engineers",
        "value": "3+",
        "iconName": "Cpu",
        "isVisible": true
      },
      {
        "id": "stat-2",
        "label": "Support Personnel",
        "value": "4+",
        "iconName": "Users",
        "isVisible": true
      },
      {
        "id": "stat-3",
        "label": "Skilled Technicians",
        "value": "2+",
        "iconName": "Wrench",
        "isVisible": true
      },
      {
        "id": "stat-4",
        "label": "Production Staff",
        "value": "2+",
        "iconName": "Settings",
        "isVisible": true
      }
    ],
    "missionVision": {
      "mission": {
        "heading": "Delivering Uncompromised Reliability",
        "description": "To design, manufacture, and support world-class vibration and environmental testing systems that enable industries to validate their products with absolute confidence."
      },
      "vision": {
        "heading": "Setting the Standard in Industrial Testing",
        "description": "To be recognized as a premier manufacturer of electrodynamic shakers, amplifiers, and environmental enclosures across India and global markets."
      }
    },
    "whyChoose": {
      "eyebrow": "OUR ADVANTAGES",
      "heading": "Why Industries Trust APSON",
      "items": [
        {
          "id": "wc-1",
          "title": "In-House R&D & Fabrication",
          "description": "Complete control over shaker coil winding, power amplifier modularity, and structural frames.",
          "iconName": "ShieldCheck",
          "displayOrder": 1,
          "isVisible": true
        },
        {
          "id": "wc-2",
          "title": "Tailored Engineering Solutions",
          "description": "Custom head expanders, slip tables, and environmental chambers tailored to exact test specs.",
          "iconName": "Sliders",
          "displayOrder": 2,
          "isVisible": true
        },
        {
          "id": "wc-3",
          "title": "End-to-End System Support",
          "description": "From installation and calibration to long-term maintenance and spare parts availability.",
          "iconName": "Clock",
          "displayOrder": 3,
          "isVisible": true
        }
      ]
    },
    "coreValues": {
      "eyebrow": "OUR GUIDING PRINCIPLES",
      "heading": "Core Values That Drive Our Operations",
      "items": [
        {
          "id": "cv-1",
          "title": "Engineering Integrity",
          "description": "Every system undergoes rigorous calibration and structural testing before dispatch.",
          "iconName": "Award",
          "displayOrder": 1,
          "isVisible": true
        },
        {
          "id": "cv-2",
          "title": "Customer First",
          "description": "Building long-term relationships through transparent communication and rapid service response.",
          "iconName": "HeartHandshake",
          "displayOrder": 2,
          "isVisible": true
        },
        {
          "id": "cv-3",
          "title": "Continuous Innovation",
          "description": "Constantly upgrading digital controllers, amplifier efficiency, and chamber insulation.",
          "iconName": "Zap",
          "displayOrder": 3,
          "isVisible": true
        }
      ]
    },
    "industries": {
      "eyebrow": "DOMAINS SERVED",
      "heading": "Industries We Serve",
      "description": "Our testing systems are deployed across critical manufacturing and research sectors.",
      "items": [
        {
          "id": "ind-1",
          "name": "Aerospace & Defense Research",
          "description": "Precision vibration shaker systems and thermal altitude testing.",
          "displayOrder": 1,
          "isActive": true
        },
        {
          "id": "ind-2",
          "name": "Automotive & Electric Vehicle Components",
          "description": "Battery pack vibration testing and shock endurance.",
          "displayOrder": 2,
          "isActive": true
        },
        {
          "id": "ind-3",
          "name": "Electronics & Telecommunications Assemblies",
          "description": "Dust ingress, rain spray, and thermal shock testing.",
          "displayOrder": 3,
          "isActive": true
        }
      ]
    },
    "qualityManufacturing": {
      "eyebrow": "QUALITY ASSURANCE",
      "heading": "Manufacturing Excellence & Testing Precision",
      "paragraphs": [
        "Our manufacturing unit in Roorkee adheres to strict quality guidelines during component selection, assembly, and final burn-in testing."
      ],
      "imageSrc": "/images/slider-1.jpg",
      "imageAlt": "Quality Manufacturing",
      "featureList": [
        "Calibrated sensors and precision measuring instruments",
        "Full load thermal & vibration burn-in tests",
        "Standardized safety interlocks on power amplifiers"
      ]
    },
    "milestones": {
      "eyebrow": "JOURNEY & EVOLUTION",
      "heading": "Key Milestones",
      "description": "Our evolutionary journey in industrial testing equipment manufacturing.",
      "items": [
        {
          "id": "ms-1",
          "year": "Phase 1",
          "title": "Establishment in Roorkee",
          "description": "Founded operations focusing on basic electrical assemblies and testing accessories.",
          "displayOrder": 1,
          "isVisible": true
        },
        {
          "id": "ms-2",
          "year": "Phase 2",
          "title": "Electrodynamic Shaker & Amplifier Line",
          "description": "Expanded into manufacturing vibration shaker systems up to +4000 Kgf and modular power amplifiers.",
          "displayOrder": 2,
          "isVisible": true
        },
        {
          "id": "ms-3",
          "year": "Phase 3",
          "title": "Environmental Enclosures Portfolio",
          "description": "Introduced rain, dust, thermal, and IPX9K high-pressure jet washer chambers.",
          "displayOrder": 3,
          "isVisible": true
        }
      ],
      "isVisible": true
    },
    "cta": {
      "eyebrow": "DISCUSS YOUR REQUIREMENT",
      "heading": "Ready to Consult with Our Engineering Team?",
      "description": "Contact APSON Industries to discuss technical specs, custom fixtures, or request a quote for your facility.",
      "primaryCtaText": "Explore Products",
      "primaryCtaHref": "/products",
      "secondaryCtaText": "Contact Us",
      "secondaryCtaHref": "/contact",
      "isVisible": true
    }
  }$JSON$::jsonb,
  1,
  true
)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content;
