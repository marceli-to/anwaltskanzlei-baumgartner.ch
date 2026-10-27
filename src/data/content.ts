// Lists shown on the pages and repeated in llms.txt, so both always say the same

/** Home, "Unsere Schwerpunkte" */
export const focus = [
  'Strafrecht\u00A0/ Jugendstrafrecht',
  'Wirtschaftsstrafrecht (insbesondere Rechtshilfe, Vermögensabschöpfung, Geldwäscherei)',
  'Verwaltungsrecht (insbesondere Polizeirecht)',
  'Interne Untersuchungen',
  'Zivilrecht',
];

/** Rechtsgebiete, left column */
export const strafrecht = [
  'Allgemeines Strafrecht\u00A0/ Strafverteidigungen',
  'Geschädigtenvertretung\u00A0/ Opferhilfe',
  'Formulierung von Strafanzeigen',
  'Vermögensdelikte',
  'Wirtschaftsstrafrecht',
  'Internationale Rechtshilfe und Amtshilfe',
  'Nebenstrafrecht (Strassenverkehrsrecht, Ausländerrecht, Waffenrecht, Datenschutzrecht, Baurecht, Arztrecht, Sportrecht)',
  'Jugendstrafrecht',
  'Militärstrafrecht',
  'Unternehmensinterne Untersuchungen',
  'Administrativverfahren',
  'Verwaltungsstrafrecht',
  'Rechtsgutachten',
  'Geldwäscherei',
  'Vermögensabschöpfung',
  'Korruption und Bestechung',
  'Wirtschaftlicher Nachrichtendienst',
];

/** Rechtsgebiete, right column */
export const areas: { title: string; items?: string[] }[] = [
  { title: 'Administrativuntersuchungen' },
  { title: 'Strassenverkehrsrecht' },
  { title: 'Polizeirecht' },
  { title: 'Arbeitsrecht\u00A0/ Öffentliches Personalrecht' },
  { title: 'Zivilrecht', items: ['Familienrecht', 'Vertragsrecht', 'Arbeitsrecht', 'Gesellschaftsrecht', 'Versicherungsrecht'] },
  {
    title: 'Verwaltungsrecht',
    items: [
      'Compliance und Corporate Governance (Prüfung und Erarbeitung von Sicherheitskonzepten bei Anlässen; Controllings)',
      'Waffenerwerbschein',
      'Gastronomiewesen',
      'Verwaltungsrechtliche Massnahmen',
    ],
  },
];

/** Team, "Eckdaten" */
export const facts = [
  'Dr. iur., Universität Zürich (2014, magna cum laude)',
  'Rechtsanwalt im Kanton Zürich (2008)',
  'Staatsanwalt im Kanton Zürich (2009–2017)',
  'Geschäftsfeldleiter Sicherheit\u00A0/ Kommandant Stadtpolizei Uster (2017–2026)',
  'Dozententätigkeit für Polizei, Staatsanwaltschaft und Verwaltung',
];
