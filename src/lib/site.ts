export const site = {
  name: 'MARAL',
  legalName: 'Maral Tecnología y Comunicaciones S.A.S.',
  tagline: 'Tecnología y Comunicaciones',
  phone: '573000000002',
  whatsapp: '573000000024',
  email: 'user37@example.com',
  location: 'Curití, Santander, Colombia',
  officialUrl: 'https://industriasmaral.com',
};

export function whatsappUrl(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
