export type Question = {
  id: string;
  category: string;
  text: string;
  explanation: string;
  isTrue: boolean;
};

export const trueQuestions: Question[] = [
  { id: "P1", category: "🦎 Przyroda", text: "Język kameleonów jest dłuższy niż całe ich ciało.", explanation: "Potrafią go wystrzelić z ogromną prędkością, by złapać owada!", isTrue: true },
  { id: "P2", category: "🌿 Polska", text: "W Polsce żyją drapieżne rośliny, które jedzą owady — np. rosiczka.", explanation: "Można je spotkać na torfowiskach.", isTrue: true },
  { id: "P3", category: "🧠 Uczenie się", text: "Twój mózg produkuje tyle energii, że mógłby zaświecić małą żarówkę LED.", explanation: "Przesyła tysiące sygnałów elektrycznych co sekundę!", isTrue: true },
  { id: "P4", category: "🐙 Przyroda", text: "Ośmiornice mają aż trzy serca i niebieską krew.", explanation: "Dwa serca pompują krew do skrzeli, jedno do reszty ciała.", isTrue: true },
  { id: "P5", category: "🇵🇱 Polska", text: "Na Pustyni Błędowskiej w Polsce można było kiedyś zobaczyć fatamorganę.", explanation: "Zjawisko optyczne typowe dla Afryki — ale zdarzyło się w Polsce!", isTrue: true },
  { id: "P6", category: "🚀 Kosmos", text: "Na Wenus jeden dzień trwa dłużej niż cały rok na tej planecie.", explanation: "Wenus kręci się wokół osi tak wolno, że rok jest krótszy niż doba!", isTrue: true },
  { id: "P7", category: "🐕 Zwierzęta", text: "Psy mają unikalne odciski nosa — żadne dwa psy nie mają takiego samego.", explanation: "Zupełnie jak ludzkie odciski palców!", isTrue: true },
  { id: "P8", category: "🏫 Szkoła", text: "Najstarsza szkoła na świecie, wciąż działająca, ma ponad 1400 lat i jest w Chinach.", explanation: "Nazywa się Shishi High School!", isTrue: true },
  { id: "P9", category: "🛝 Plac zabaw", text: "Pierwsze zjeżdżalnie na placach zabaw były tak wysokie jak dwupiętrowy dom.", explanation: "Dawniej place zabaw wyglądały jak tory przeszkód dla kaskaderów!", isTrue: true },
  { id: "P10", category: "❤️ Relacje", text: "Kiedy dwoje ludzi patrzy sobie w oczy przez chwilę, ich serca mogą zacząć bić w tym samym rytmie.", explanation: "To zjawisko nazywa się synchronizacją!", isTrue: true },
  { id: "P11", category: "🍇 Jedzenie", text: "Jedna malina to tak naprawdę 30 małych owoców — każda kuleczka to osobny owoc!", explanation: "Każda z soczystych kuleczek ma własną skórkę i pestkę.", isTrue: true },
  { id: "P12", category: "🚂 Pojazdy", text: "Najszybszy pociąg na świecie (Maglev) unosi się nad torami dzięki magnesom.", explanation: "Z braku tarcia, pociąg może rozpędzić się nawet do 700 km/h!", isTrue: true },
  { id: "P13", category: "🔬 Nauka", text: "Diamenty i ołówkowy grafit zrobione są z tego samego pierwiastka — węgla.", explanation: "Różni je tylko ułożenie cząsteczek!", isTrue: true },
  { id: "P14", category: "🧊 Klimat", text: "Antarktyda jest oficjalnie nazywana największą pustynią na Ziemi.", explanation: "Pada tam tak mało śniegu, że spełnia definicję pustyni!", isTrue: true },
  { id: "P15", category: "🏙️ Miasto", text: "W Japonii istnieją podziemne farmy, gdzie warzywa rosną przy sztucznym świetle.", explanation: "Rolnictwo pionowe pod ziemią — przyszłość jedzenia!", isTrue: true },
  { id: "P16", category: "🚀 Kosmos", text: "Specjalny 'Kosmiczny Długopis', który potrafi pisać w rakiecie lecącej na Księżyc w warunkach bez grawitacji — potrafi również działać pod wodą.", explanation: "Prawda! Choć wymyślono go dla astronautów, działa niemal wszędzie: w ogromnym mrozie, w wielkim upale, a nawet głęboko pod wodą!", isTrue: true },
];

export const falseQuestions: Question[] = [
  { id: "F1", category: "🐂 Przyroda", text: "Byki nienawidzą koloru czerwonego i dlatego atakują płachtę matadora.", explanation: "FAŁSZ! Byki nie widzą czerwieni — drażni je ruch materiału, nie barwa.", isTrue: false },
  { id: "F2", category: "🇵🇱 Polska", text: "Warszawa jest najstarszym miastem w Polsce.", explanation: "FAŁSZ! Dużo starsze są np. Kalisz i Gniezno.", isTrue: false },
  { id: "F3", category: "📚 Uczenie się", text: "Czytanie po ciemku psuje wzrok na zawsze.", explanation: "FAŁSZ! Oczy się tylko męczą — wzrok trwale się nie psuje.", isTrue: false },
  { id: "F4", category: "🐻 Przyroda", text: "Niedźwiedzie polarne mają białą skórę pod futrem.", explanation: "FAŁSZ! Ich skóra jest czarna — lepiej pochłania ciepło słoneczne.", isTrue: false },
  { id: "F5", category: "🇵🇱 Polska", text: "Smok Wawelski to postać historyczna, która żyła 100 lat temu.", explanation: "FAŁSZ! To piękna legenda — smoki nie istnieją.", isTrue: false },
  { id: "F6", category: "🚀 Kosmos", text: "Słońce to gigantyczna kula ognia, płonąca jak ognisko.", explanation: "FAŁSZ! W kosmosie nie ma tlenu. Słońce świeci dzięki reakcjom jądrowym.", isTrue: false },
  { id: "F7", category: "🐱 Zwierzęta", text: "Koty zawsze lądują na czterech łapach, nawet z bardzo niskiej wysokości.", explanation: "FAŁSZ! Przy bardzo małej wysokości nie zdążą się obrócić.", isTrue: false },
  { id: "F9", category: "🛝 Plac zabaw", text: "Guma na placach zabaw robi się z przetworzonych skórek bananów.", explanation: "FAŁSZ! Robi się ją z recyklingu starych opon samochodowych.", isTrue: false },
  { id: "F10", category: "❤️ Relacje", text: "Ziewanie jest zaraźliwe tylko dla ludzi — zwierzęta nigdy tego nie robią.", explanation: "FAŁSZ! Psy i szympansy też ziewają widząc ziewającego opiekuna!", isTrue: false },
  { id: "F11", category: "🥕 Jedzenie", text: "Marchewka od zawsze była pomarańczowa.", explanation: "FAŁSZ! Pierwsze marchewki były fioletowe i żółte — pomarańczową wyhodowano kilkaset lat temu.", isTrue: false },
  { id: "F12", category: "✈️ Pojazdy", text: "Samoloty pasażerskie mają klaksony do ostrzegania ptaków w chmurach.", explanation: "FAŁSZ! Piloci używają radia, a ptaki odstraszają silniki i światła.", isTrue: false },
  { id: "F13", category: "🧠 Nauka", text: "Ludzie używają tylko 10% swojego mózgu.", explanation: "FAŁSZ! Używamy prawie całego mózgu każdego dnia, nawet podczas snu.", isTrue: false },
  { id: "F14", category: "⛈️ Klimat", text: "Piorun nigdy nie uderza dwa razy w to samo miejsce.", explanation: "FAŁSZ! Pioruny często uderzają wielokrotnie w te same wysokie obiekty.", isTrue: false },
  { id: "F15", category: "🏙️ Miasto", text: "Budując najwyższy wieżowiec na świecie Burj Khalifa, wylewano beton na najwyższe piętra helikopterami.", explanation: "FAŁSZ! Beton by wysechł w locie. Użyto najpotężniejszych pomp na świecie.", isTrue: false },
];

export const jokes: string[] = [
  "Dlaczego zeszyt do matematyki był smutny? Bo miał za dużo problemów.",
  "Dlaczego ryby nie lubią komputerów? Bo boją się sieci!",
  "Jaki samochód jest najbardziej leniwy? Porsche... bo zawsze prosi: Porsze, jeszcze pięć minut!",
  "Dlaczego pies nosi kokardkę? Bo chce być psistojny!",
  "Dlaczego huśtawka nie ma kolegów? Bo zawsze ma wahania nastroju.",
  "Co mówi jedna chmura do drugiej? Kto ostatni, ten deszcz!",
  "Pani pyta Jasia: wymień 5 zwierząt z Afryki. — 2 słonie i 3 lwy, proszę pani!",
  "Co robi bałwan gdy jest mu za gorąco? Zamienia się w kałużę i idzie popływać!",
  "Dlaczego bociany lecą do ciepłych krajów? Bo na piechotę byłoby za daleko.",
  "Jak nazywa się krowa grająca na instrumencie? Muuuu-zykantka!",
  "Synek pyta tatę: czy marchewka jest dobra na wzrok? — Widziałeś zająca w okularach?",
  "Kelner! W zupie jest mucha! — Spokojnie, ile taka mała mucha może zjeść?",
  "Dlaczego zero szuka paska? Bo chce zostać ósemką!",
  "Co jest na końcu słowa tęcza? Litera a!",
  "Mama mysz i mała myszka spacerują. Nagle widzą kota. Mama mysz krzyczy: – Hau! Hau! Hau! Kot ucieka przerażony. Mama mówi do dziecka: – Widzisz synku? Warto uczyć się języków obcych!",
  "Dlaczego komputer poszedł do lekarza? Bo miał wirusa!",
  "Co mówi herbata do łyżeczki? Kręcisz mi się w głowie!",
  "Dlaczego kaczki chodzą w kółko? Bo nie mogą chodzić w kwadrat!",
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildGameSet(): Question[] {
  const t = shuffle(trueQuestions).slice(0, 5);
  const f = shuffle(falseQuestions).slice(0, 5);
  return shuffle([...t, ...f]);
}

export function randomJoke(): string {
  return jokes[Math.floor(Math.random() * jokes.length)];
}
