const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const temaer = [
  "Beste stromleverandor for elbil-eiere i 2026",
  "Slik leser du stromregningen komplett guide",
  "Spotpris vs fastpris hva lonner seg i 2026",
  "10 stromspartips som faktisk virker",
  "Varmepumpe og strom slik sparer du mest",
  "Tibber vs Fjordkraft hvem er billigst",
  "Stromstotte 2026 hvem far hva og hvor mye",
  "Slik bytter du stromleverandor steg for steg",
  "Beste stromleverandor for leilighet 2026",
  "Hvorfor varierer stromprisene sa mye",
  "Slik sparer du strom om vinteren",
  "Beste varmepumpe 2026 test og rangering",
  "Smart stromstyring med app verdt det",
  "Strom til elbil billigste losning i 2026",
  "Nettleie forklart hva betaler du egentlig",
  "Jaerkraft vs Cheap Energy hvem er billigst",
  "Hafslund strom er det et godt valg",
  "NTE strom passer det for deg",
  "Strompris prognose 2026 hva venter ekspertene",
  "Solceller og strom lonnsomt i Norge",
];

const temaerNorsk = [
  "Beste strømleverandør for elbil-eiere i 2026",
  "Slik leser du strømregningen – komplett guide",
  "Spotpris vs fastpris – hva lønner seg i 2026?",
  "10 strømspartips som faktisk virker",
  "Varmepumpe og strøm – slik sparer du mest",
  "Tibber vs Fjordkraft – hvem er billigst?",
  "Strømstøtte 2026 – hvem får hva og hvor mye?",
  "Slik bytter du strømleverandør steg for steg",
  "Beste strømleverandør for leilighet 2026",
  "Hvorfor varierer strømprisene så mye?",
  "Slik sparer du strøm om vinteren",
  "Beste varmepumpe 2026 – test og rangering",
  "Smart strømstyring med app – verdt det?",
  "Strøm til elbil – billigste løsning i 2026",
  "Nettleie forklart – hva betaler du egentlig?",
  "Jærkraft vs Cheap Energy – hvem er billigst?",
  "Hafslund strøm – er det et godt valg?",
  "NTE strøm – passer det for deg?",
  "Strømpris prognose 2026 – hva venter ekspertene?",
  "Solceller og strøm – lønnsomt i Norge?",
];

async function genererArtikkel() {
  const ukenummer = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const idx = ukenummer % temaer.length;
  const tema = temaerNorsk[idx];
  const filbase = temaer[idx];
  const dato = new Date().toLocaleDateString("no-NO", {
    day: "numeric", month: "long", year: "numeric",
  });

  console.log(`\n Wattguiden Artikkelgenerator`);
  console.log(`Dato: ${dato}`);
  console.log(`Tema: ${tema}`);
  console.log(`Genererer artikkel...`);

  const melding = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4000,
    messages: [{
      role: "user",
      content: `Du er ekspertredaktoeren for wattguiden.no - Norges mest palitelige stromguide.

Skriv en fullstendig SEO-optimalisert HTML-side om: "${tema}"
Dato: ${dato}

KRAV:
- Komplett HTML-dokument med DOCTYPE html, head og body
- Skriv paa norsk bokmal, profesjonell og hjelpsom tone
- Minst 800 ord genuint nyttig innhold
- H1, minst 3x H2, noen H3 der det passer
- Nevn konkrete leverandoerer: Tibber, Cheap Energy, Fjordkraft, Jaerkraft, NTE, Hafslund
- Inkluder en faktaboks med 3-5 noekkelpunkter tidlig i artikkelen
- Avslutt med en CTA som lenker til index.html#kalkulator

DESIGN (bruk eksakt disse CSS-verdiene):
- Font: Plus Jakarta Sans fra Google Fonts
- Bakgrunn: #0b0f17
- Tekst: #f0f4fc
- Muted: #8d97b0
- Gull-aksent: #e8b84b
- Kort-bakgrunn: #131720
- Border: rgba(255,255,255,0.07)
- Nav logo: Watt + guiden i gull
- Footer med: Wattguiden kan motta provisjon ved klikk paa leverandoerlenker.

SEO i head:
- Tittel: [Tema] | Wattguiden.no
- Meta description 150-160 tegn
- meta robots index follow

Returner KUN gyldig komplett HTML. Ingen markdown, ingen forklaringer utenfor HTML.`
    }]
  });

  const html = melding.content[0].text;

  const filnavn = filbase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") + ".html";

  if (!fs.existsSync("artikler")) {
    fs.mkdirSync("artikler", { recursive: true });
  }

  const filsti = path.join("artikler", filnavn);
  fs.writeFileSync(filsti, html, "utf8");

  const loggFil = path.join("artikler", "logg.json");
  let logg = [];
  try { logg = JSON.parse(fs.readFileSync(loggFil, "utf8")); } catch {}
  logg.unshift({ dato, tema, filnavn, tidspunkt: new Date().toISOString() });
  fs.writeFileSync(loggFil, JSON.stringify(logg, null, 2), "utf8");

  console.log(`\nFerdig! Artikkel lagret: artikler/${filnavn}`);
}

genererArtikkel().catch(err => {
  console.error("Feil:", err.message);
  process.exit(1);
});
