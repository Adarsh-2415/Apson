-- Migration Script: Migrate 100% About Us Page Content (All 10 Sections) into Supabase CMS

DO $$
DECLARE
    v_page_id UUID;
BEGIN
    -- 1. Ensure 'About Us' page record exists in public.pages
    SELECT id INTO v_page_id FROM public.pages WHERE slug = '/about';
    
    IF v_page_id IS NULL THEN
        INSERT INTO public.pages (title, slug, status)
        VALUES ('About Us', '/about', 'published')
        RETURNING id INTO v_page_id;
    END IF;

    -- 2. Insert or Update full 10-section payload in public.page_sections
    DELETE FROM public.page_sections WHERE page_id = v_page_id AND section_type = 'about_page_content';

    INSERT INTO public.page_sections (
        page_id,
        section_type,
        content,
        display_order,
        is_visible
    ) VALUES (
        v_page_id,
        'about_page_content',
        $JSON${
          "hero": {
            "eyebrow": "ABOUT APSON INDUSTRIES",
            "heading": "Pioneering Engineering & Testing Systems",
            "description": "APSON INDUSTRIES is an established manufacturer of electrodynamic vibration shaker systems, environmental test chambers, and specialized engineering equipment based in Roorkee, Uttarakhand, India.",
            "breadcrumbText": "Home / About Us",
            "imageSrc": "/images/slider-2.jpg",
            "imageAlt": "APSON INDUSTRIES Engineering & Testing Facility"
          },
          "intro": {
            "eyebrow": "OUR BACKGROUND & FOCUS",
            "heading": "Dedicated to Industrial Precision & Reliability",
            "paragraphs": [
              "APSON INDUSTRIES is engaged in the manufacturing of electrodynamic vibration shaker systems up to +4000 Kgf, modular power amplifiers, digital vibration controllers, vibration control software and specialized testing machines.",
              "Our product portfolio spans vibration, shock and impact testing systems, environmental test chambers, mechanical items, electrical/electronic assemblies and cable harness assemblies."
            ],
            "imageSrc": "/images/slider-3.jpg",
            "imageAlt": "APSON Equipment Manufacturing",
            "highlights": [
              "Electrodynamic Shakers up to +4000 Kgf",
              "Environmental & Thermal Test Chambers",
              "IPX9K Jet Washing Systems",
              "Custom Cable Harness & Assemblies"
            ]
          },
          "statistics": [
            {
              "id": "stat-1",
              "label": "Vibration Capacity",
              "value": "+4000",
              "suffix": "Kgf",
              "iconName": "Activity",
              "isVisible": true
            },
            {
              "id": "stat-2",
              "label": "Core Categories",
              "value": "4+",
              "suffix": "Systems",
              "iconName": "Grid",
              "isVisible": true
            },
            {
              "id": "stat-3",
              "label": "Facility Location",
              "value": "Roorkee",
              "suffix": "India",
              "iconName": "MapPin",
              "isVisible": true
            }
          ],
          "missionVision": {
            "mission": {
              "heading": "Our Mission",
              "description": "To manufacture and deliver robust, highly accurate electrodynamic vibration testing systems and environmental test chambers that empower industries to achieve peak product reliability.",
              "iconName": "Target"
            },
            "vision": {
              "heading": "Our Vision",
              "description": "To be a recognized leader in industrial testing equipment manufacturing, expanding advanced engineering capabilities across specialized environmental and mechanical testing systems.",
              "iconName": "Eye"
            }
          },
          "whyChoose": {
            "eyebrow": "WHY CHOOSE APSON",
            "heading": "Key Strengths & Engineering Portfolio",
            "items": [
              {
                "id": "why-1",
                "title": "Quality Assurance",
                "description": "Rigorous in-house engineering and calibration across all vibration shaker systems and test chambers.",
                "iconName": "ShieldCheck",
                "displayOrder": 1,
                "isVisible": true
              },
              {
                "id": "why-2",
                "title": "Reliable Products",
                "description": "Built for long-term operational durability under demanding industrial testing standards.",
                "iconName": "CheckCircle2",
                "displayOrder": 2,
                "isVisible": true
              },
              {
                "id": "why-3",
                "title": "Technical Expertise",
                "description": "Specialized capabilities covering mechanical, electrical, and electronic assembly integration.",
                "iconName": "Cpu",
                "displayOrder": 3,
                "isVisible": true
              },
              {
                "id": "why-4",
                "title": "Customer-Centric Approach",
                "description": "Customized equipment configurations designed around practical industrial testing requirements.",
                "iconName": "UserCheck",
                "displayOrder": 4,
                "isVisible": true
              },
              {
                "id": "why-5",
                "title": "Timely Delivery",
                "description": "Streamlined production and manufacturing workflows at our Civil Lines facility in Roorkee.",
                "iconName": "Clock",
                "displayOrder": 5,
                "isVisible": true
              },
              {
                "id": "why-6",
                "title": "Industry Experience",
                "description": "Proven capability in shock, impact, environmental, and vibration testing equipment manufacturing.",
                "iconName": "Award",
                "displayOrder": 6,
                "isVisible": true
              }
            ]
          },
          "coreValues": {
            "eyebrow": "OUR FOUNDATIONAL PRINCIPLES",
            "heading": "Core Values Driving Our Engineering",
            "items": [
              {
                "id": "val-1",
                "title": "Quality",
                "description": "Uncompromised build quality and testing precision in every equipment assembly.",
                "iconName": "Award",
                "displayOrder": 1,
                "isVisible": true
              },
              {
                "id": "val-2",
                "title": "Integrity",
                "description": "Transparent commercial operations and honest engineering specifications.",
                "iconName": "Shield",
                "displayOrder": 2,
                "isVisible": true
              },
              {
                "id": "val-3",
                "title": "Innovation",
                "description": "Continuous development of digital vibration controllers and control software.",
                "iconName": "Zap",
                "displayOrder": 3,
                "isVisible": true
              },
              {
                "id": "val-4",
                "title": "Reliability",
                "description": "Equipment designed for continuous industrial testing operations.",
                "iconName": "Anchor",
                "displayOrder": 4,
                "isVisible": true
              },
              {
                "id": "val-5",
                "title": "Customer Satisfaction",
                "description": "Dedicated technical support and guidance for testing equipment setup.",
                "iconName": "Heart",
                "displayOrder": 5,
                "isVisible": true
              },
              {
                "id": "val-6",
                "title": "Continuous Improvement",
                "description": "Regular enhancement of manufacturing processes and component quality.",
                "iconName": "TrendingUp",
                "displayOrder": 6,
                "isVisible": true
              }
            ]
          },
          "industries": {
            "eyebrow": "APPLICATIONS & SECTORS",
            "heading": "Industries We Serve",
            "description": "APSON Industries provides testing systems and assemblies utilized across diverse engineering sectors.",
            "items": [
              {
                "id": "ind-1",
                "name": "Automotive & Aerospace Testing",
                "description": "Vibration shaker systems, thermal shock chambers, and specialized cable harness assemblies.",
                "iconName": "Car",
                "displayOrder": 1,
                "isActive": true
              },
              {
                "id": "ind-2",
                "name": "Electronics & Defense Systems",
                "description": "Bump, impact, and digital vibration controllers for rugged electronic components.",
                "iconName": "Radio",
                "displayOrder": 2,
                "isActive": true
              },
              {
                "id": "ind-3",
                "name": "Environmental Reliability",
                "description": "Rain, dust, salt spray, and IPX9K jet washing test enclosures.",
                "iconName": "CloudRain",
                "displayOrder": 3,
                "isActive": true
              },
              {
                "id": "ind-4",
                "name": "Industrial Manufacturing",
                "description": "Heating ovens, walk-in chambers, and custom mechanical items.",
                "iconName": "Factory",
                "displayOrder": 4,
                "isActive": true
              }
            ]
          },
          "qualityManufacturing": {
            "eyebrow": "PRODUCTION & QUALITY CONTROL",
            "heading": "High-Precision Manufacturing Standards",
            "paragraphs": [
              "Every piece of equipment manufactured at APSON Industries undergoes comprehensive quality checks and validation protocols to ensure strict compliance with industrial testing standards.",
              "From electrical assembly wiring to mechanical frame fabrication and amplifier calibration, quality control is integrated into every phase of manufacturing."
            ],
            "imageSrc": "/images/slider-1.jpg",
            "imageAlt": "Quality Control & Manufacturing Facility",
            "featureList": [
              "Process Excellence & Quality Control",
              "In-House Electrical & Electronic Assembly",
              "Vibration & Environmental System Calibration",
              "Robust Mechanical Fabrication"
            ]
          },
          "milestones": {
            "eyebrow": "OUR MILESTONES",
            "heading": "Building Industrial Testing Excellence",
            "description": "Key operational milestones of APSON Industries in Roorkee, India.",
            "isVisible": true,
            "items": [
              {
                "id": "m-1",
                "year": "Phase 1",
                "title": "Foundation in Roorkee",
                "description": "Established manufacturing operations in Civil Lines, Roorkee for engineering equipment.",
                "displayOrder": 1,
                "isVisible": true
              },
              {
                "id": "m-2",
                "year": "Phase 2",
                "title": "Vibration & Amplifiers Portfolio",
                "description": "Expanded into electrodynamic vibration systems up to +4000 Kgf and modular power amplifiers.",
                "displayOrder": 2,
                "isVisible": true
              },
              {
                "id": "m-3",
                "year": "Phase 3",
                "title": "Environmental & IPX9K Enclosures",
                "description": "Introduced environmental chambers, thermal shock units, and IPX9K high-pressure jet washers.",
                "displayOrder": 3,
                "isVisible": true
              }
            ]
          },
          "cta": {
            "eyebrow": "LOOKING FOR RELIABLE INDUSTRIAL SOLUTIONS?",
            "heading": "Discuss Your Testing Equipment Requirement",
            "description": "Get in touch with APSON Industries to discuss vibration shaker systems, environmental chambers, or custom engineering assemblies.",
            "primaryCtaText": "Explore Products",
            "primaryCtaHref": "/products",
            "secondaryCtaText": "Contact Us",
            "secondaryCtaHref": "/contact",
            "isVisible": true
          }
        }$JSON$::jsonb,
        1,
        true
    );

    RAISE NOTICE 'About Us page content successfully migrated to Supabase CMS!';
END $$;
