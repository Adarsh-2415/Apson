export const COMPANY_INFO = {
  name: 'APSON INDUSTRIES',
  logoSrc: '/images/logo.png',
  logoAlt: 'APSON INDUSTRIES Logo',
  description: 'Industrial manufacturing and engineering company specializing in vibration testing systems, shock and impact equipment, environmental test chambers, and specialized mechanical/electrical assemblies.',
  address: {
    street: '385/2, Jadugar Road, 42 Civil Lines',
    city: 'Roorkee',
    postalCode: '247 667',
    state: 'Uttarakhand (U.K.)',
    country: 'INDIA',
    fullFormatted: '385/2, Jadugar Road, 42 Civil Lines, Roorkee – 247 667, U.K. (INDIA)',
  },
  phones: [
    { display: '9758533004', raw: '9758533004' },
    { display: '8439653605', raw: '8439653605' },
    { display: '9997180037', raw: '9997180037' },
  ],
  email: 'apsonindustries.rke@gmail.com',
  googleMapsUrl: 'https://share.google/OzWlhU4MoNCwlBe9C',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3460.0509305400715!2d77.8844774!3d29.862805000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb37790c240dd%3A0xa077727d7c062e72!2s42%2C%20385%2F2%2C%20Jadugar%20Road%2C%20Civil%20Lines%2C%20Roorkee%2C%20Uttarakhand%20247667!5e0!3m2!1sen!2sin!4v1786516828586!5m2!1sen!2sin',
} as const

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Contact Us', href: '/contact' },
] as const
