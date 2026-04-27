export type Scenario = {
  id: string;
  title: string;
  questions: string[];
  funFact: string;
};

export const scenarios: Scenario[] = [
  {
    id: "S1",
    title: "🎭 Co by było, gdyby Pinokio prowadził program w szkolnej telewizji?",
    questions: [
      "Czy jego nos rósłby na wizji przed kamerą?",
      "Jak prowadziłby wywiad — czy musiałby mówić tylko prawdę?",
      "Co by się stało, gdyby skłamał podczas audycji na cały rok szkolny?",
    ],
    funFact:
      "Pierwszą książkę o Pinokiu napisał Carlo Collodi we Włoszech — ponad 140 lat temu!",
  },
  {
    id: "S2",
    title: "🧭 Co by było, gdyby Czerwony Kapturek miał GPS w telefonie?",
    questions: [
      "Czy wilk miałby jakiekolwiek szanse?",
      "Czy babcia mogłaby wysłać lokalizację?",
      "Co by zrobiła policja widząc wilka w lesie?",
    ],
    funFact:
      "Prawdziwe wilki są bardzo płochliwe i zazwyczaj unikają ludzi w lesie.",
  },
  {
    id: "S3",
    title: "🧱 Co by było, gdyby Harry Potter był genialnym konstruktorem LEGO zamiast używać magii?",
    questions: [
      "Jakich maszyn z klocków użyłby na bazyliszka?",
      "Czy zbudowałby Hogwart?",
      "Ile klocków potrzeba na cały zamek?",
    ],
    funFact: "Największe zestawy LEGO mają ponad 10 000 elementów!",
  },
  {
    id: "S4",
    title: "🍯 Co by było, gdyby Kubuś Puchatek przeszedł na dietę bez miodu?",
    questions: [
      "Co stałoby się jego ulubionym przysmakiem?",
      "Czy byłby równie radosny?",
      "Czy Prosiaczek próbowałby go zachęcić do czegoś nowego?",
    ],
    funFact:
      "Prawdziwe niedźwiedzie jedzą miód, ale najbardziej lubią larwy pszczół — są bogatsze w białko!",
  },
  {
    id: "S5",
    title: "🍦 Co by było, gdyby Elza z Krainy Lodu mogła zamrażać tylko lody w wafelku?",
    questions: [
      "Czy jej zamek byłby jadalny?",
      "Jakie smaki by wybrała?",
      "Czy lato w Arendelle byłoby najlepszą porą roku?",
    ],
    funFact:
      "Największa porcja lodów na świecie ważyła ponad 1300 kg — tyle co dorosły słoń!",
  },
  {
    id: "S6",
    title: "🖊️ Co by było, gdyby Pan Kleks stracił magiczny atrament i musiał uczyć jak zwykły nauczyciel?",
    questions: [
      "Czy dzieci chciałyby chodzić do jego szkoły bez magii?",
      "Jak wyglądałyby zwykłe lekcje — matematyka, plastyka?",
      "Czy Pan Kleks byłby dobrym zwykłym nauczycielem?",
    ],
    funFact:
      "Książki o Panu Kleksie napisał Jan Brzechwa ponad 80 lat temu — do dziś są wznawiane i kochane przez polskie dzieci!",
  },
];

export function shuffledScenarios(): Scenario[] {
  const arr = [...scenarios];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
