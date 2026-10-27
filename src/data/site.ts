export const site = {
  name: 'Anwaltskanzlei Dr. iur. Andreas Baumgartner',
  url: 'https://anwaltskanzlei-baumgartner.ch',
  description: 'Anwaltskanzlei Dr. iur. Andreas Baumgartner in Stäfa am Zürichsee: Strafrecht, Wirtschaftsstrafrecht, Verwaltungs- und Polizeirecht, interne Untersuchungen und Zivilrecht.',
};

export const contact = {
  name: 'Dr. iur. Andreas Baumgartner',
  firm: 'Anwaltskanzlei Dr. iur. Andreas Baumgartner',
  street: 'Kronenstrasse 9',
  postalCode: '8712',
  city: 'Stäfa',
  country: 'CH',
  phones: ['+41 78 343 69 13', '+41 44 928 19 30'],
  email: 'andy@anwaltskanzlei-baumgartner.ch',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Rechtsgebiete', href: '/rechtsgebiete/' },
  { label: 'Team', href: '/team/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const legalNav = [
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutzerklärung', href: '/datenschutz/' },
];

/** "+41 78 343 69 13" → "tel:+41783436913" */
export const tel = (phone: string) => `tel:${phone.replace(/\s/g, '')}`;

/** Kontakt map (Mapbox). Coordinates are [longitude, latitude], the order Mapbox uses. */
export const map = {
  // Greyscale house style, as on the immosite.ch projects
  style: 'mapbox://styles/marcelitoooo/ck16ms7m51nlo1cmwnqrbjuyq?optimize=true',
  zoom: 15.5,
  markers: [
    // Kronenstrasse 9, positions from the client
    { kind: 'office', title: 'Anwaltskanzlei Dr. iur. Andreas Baumgartner', coordinates: [8.72532, 47.24219] },
    { kind: 'parking', title: 'Besucherparkplätze (gelb markiert)', coordinates: [8.725634, 47.242375] },
  ],
} as const;
