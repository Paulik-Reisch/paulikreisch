/** Verified editorial content shared by the visible page and its structured data. */
export const homeBook = {
  title: 'Hallo Welt',
  subtitle: 'Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S',
  pages: 106,
  chapters: 36,
  authors: ['Philipp Paulik', 'Maximilian Reisch'],
} as const;

export const homeFaqs = [
  { question: 'Was ist „Hallo Welt“?', answer: '„Hallo Welt“ ist ein satirisches Buch von Philipp Paulik und Maximilian Reisch. In 36 Kapiteln auf 106 Seiten nehmen sie den Schulalltag, die Bürokratie und das Erwachsenwerden aufs Korn.' },
  { question: 'Für wen ist das Buch gedacht?', answer: 'Für alle, die den Schulwahnsinn kennen: Schüler, ehemalige Schüler und Lehrkräfte mit Humor. Das Buch erzählt mit Ironie und schwarzem Humor; es ist Satire, kein Schulratgeber.' },
  { question: 'Wo kann ich das Buch kaufen und reinlesen?', answer: 'Im Buchshop findest du die Leseprobe, Informationen zum Buch und die Links zu den verfügbaren Ausgaben. Der Kauf erfolgt bei den dort verlinkten Anbietern.' },
  { question: 'Was ist Worthaft?', answer: 'Worthaft ist unser deutsches Worträtsel: fünf Buchstaben, sechs Versuche und jeden Tag ein neues Wort. Dein Spielstand und deine Statistik bleiben lokal in deinem Browser.' },
] as const;

export const homePeople = [
  { name: 'Philipp Paulik', role: 'Autor', bio: 'Sorgt für das Chaos. Und dafür, dass keine Handlung zu viel Sinn ergibt.', href: '/ueber/philipp-paulik', image: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/ersteller%2Fphilipp-paulik.png?alt=media&token=7e48b706-80fa-45cc-ae51-b6444bd7ccb3' },
  { name: 'Maximilian Reisch', role: 'Autor', bio: 'Meister der Syntax und Satire. Zuständig für Sätze mit gewissen Nebenwirkungen.', href: '/ueber/max-reisch', image: '/max-reisch.png' },
  { name: 'Luin Schiffbauer', role: 'Illustrator', bio: 'Gibt dem Wahnsinn ein Gesicht. Und unseren Geschichten ihren eigenen Strich.', href: '/ueber/luin-schiffbauer', image: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/luin-schiffbauer.png?alt=media&token=61abe644-7d94-4bfc-8164-37447ac9279b' },
] as const;
