"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Language = 'no' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Default context value
const LanguageContext = createContext<LanguageContextType>({
  language: 'no',
  setLanguage: () => {},
  t: (key) => key
});

// Translation dictionary
export const translations: Record<string, Record<string, string>> = {
  // Navigation
  'nav.calculator': {
    no: 'Kalkulator',
    en: 'Calculator'
  },
  'nav.tips': {
    no: 'Sparetips',
    en: 'Saving Tips'
  },
  'nav.faq': {
    no: 'FAQ',
    en: 'FAQ'
  },
  
  // Vehicle Selector
  'vehicle.title': {
    no: 'Velg kjøretøy',
    en: 'Select Vehicle'
  },
  'vehicle.type': {
    no: 'Kjøretøytype:',
    en: 'Vehicle type:'
  },
  'vehicle.car': {
    no: 'Personbil',
    en: 'Car'
  },
  'vehicle.truck': {
    no: 'Lastebil',
    en: 'Truck'
  },
  'vehicle.fuelType': {
    no: 'Drivstofftype:',
    en: 'Fuel type:'
  },
  'vehicle.petrol': {
    no: 'Bensin',
    en: 'Petrol'
  },
  'vehicle.diesel': {
    no: 'Diesel',
    en: 'Diesel'
  },
  'vehicle.electric': {
    no: 'Elbil',
    en: 'Electric'
  },
  'vehicle.hybrid': {
    no: 'Hybrid',
    en: 'Hybrid'
  },
  'vehicle.roundTrip': {
    no: 'Tur-retur',
    en: 'Round trip'
  },
  'vehicle.passengers': {
    no: 'Antall passasjerer:',
    en: 'Number of passengers:'
  },
  
  // Route Selector
  'route.from': {
    no: 'Fra:',
    en: 'From:'
  },
  'route.to': {
    no: 'Til:',
    en: 'To:'
  },
  'route.fromPlaceholder': {
    no: 'Skriv inn startsted',
    en: 'Enter starting point'
  },
  'route.toPlaceholder': {
    no: 'Skriv inn destinasjon',
    en: 'Enter destination'
  },
  
  // Stop List
  'stops.title': {
    no: 'Mellomstopp',
    en: 'Stopovers'
  },
  'stops.searchPlaceholder': {
    no: 'Søk etter sted...',
    en: 'Search for a place...'
  },
  'stops.add': {
    no: '+ Legg til mellomstopp',
    en: '+ Add stopover'
  },
  'stops.remove': {
    no: 'Fjern stopp',
    en: 'Remove stop'
  },
  
  // Map
  'map.start': {
    no: 'Start',
    en: 'Start'
  },
  'map.stop': {
    no: 'Mellomstopp',
    en: 'Stopover'
  },
  'map.destination': {
    no: 'Mål',
    en: 'Destination'
  },
  'map.tollStation': {
    no: 'Bomstasjon',
    en: 'Toll station'
  },
  'map.fee': {
    no: 'Avgift',
    en: 'Fee'
  },
  
  // Cost Results
  'results.title': {
    no: 'Kostnadsberegning',
    en: 'Cost Calculation'
  },
  'results.roundTrip': {
    no: 'Tur-retur',
    en: 'Round trip'
  },
  'results.distance': {
    no: 'Avstand',
    en: 'Distance'
  },
  'results.time': {
    no: 'Estimert kjøretid',
    en: 'Estimated driving time'
  },
  'results.consumption': {
    no: 'Forbruk',
    en: 'Consumption'
  },
  'results.fuelCosts': {
    no: 'Drivstoffkostnader',
    en: 'Fuel costs'
  },
  'results.consumption.word': {
    no: 'Forbruk:',
    en: 'Consumption:'
  },
  'results.price': {
    no: 'Pris:',
    en: 'Price:'
  },
  'results.calculatedFor': {
    no: 'Beregnet for:',
    en: 'Calculated for:'
  },
  'results.tollCosts': {
    no: 'Bomkostnader',
    en: 'Toll costs'
  },
  'results.tollStation': {
    no: 'Bomstasjon',
    en: 'Toll station'
  },
  'results.fee': {
    no: 'Avgift',
    en: 'Fee'
  },
  'results.noTolls': {
    no: 'Ingen bomstasjoner på denne ruten',
    en: 'No toll stations on this route'
  },
  'results.pricesIncludeReturn': {
    no: 'Prisene inkluderer retur',
    en: 'Prices include return trip'
  },
  'results.totalCosts': {
    no: 'Totale kjørekostnader',
    en: 'Total driving costs'
  },
  'results.persons': {
    no: 'personer',
    en: 'people'
  },
  'results.costPerPerson': {
    no: 'DriveCalc kostnad per person:',
    en: 'DriveCalc cost per person:'
  },
  'results.stopovers': {
    no: 'Mellomstoppesteder',
    en: 'Stopover locations'
  },
  
  // Main page
  'main.title': {
    no: 'DriveCalc - Beregn kjørekostnader i Norge',
    en: 'DriveCalc - Calculate Driving Costs in Norway'
  },
  'main.calculate': {
    no: 'Beregn kostnader',
    en: 'Calculate costs'
  },
  'main.calculating': {
    no: 'Beregner...',
    en: 'Calculating...'
  },
  'main.seo.heading1': {
    no: 'Beregn kjørekostnader og bomavgifter i Norge',
    en: 'Calculate Driving Costs and Toll Fees in Norway'
  },
  'main.seo.paragraph1': {
    no: 'DriveCalc er Norges mest nøyaktige bompenge kalkulator og verktøy for å beregne kjørekostnad på norske veier. Vi oppdaterer kontinuerlig våre drivstoffpriser og bomavgifter for å sikre at du alltid får de mest nøyaktige beregningene.',
    en: 'DriveCalc is Norway\'s most accurate toll calculator and tool for calculating driving costs on Norwegian roads. We continuously update our fuel prices and toll fees to ensure you always get the most accurate calculations.'
  },
  'main.feature1.title': {
    no: 'Nøyaktige beregninger',
    en: 'Accurate calculations'
  },
  'main.feature1.text': {
    no: 'Få detaljerte kostnadsberegninger basert på din spesifikke rute, biltype og drivstoff.',
    en: 'Get detailed cost calculations based on your specific route, vehicle type and fuel.'
  },
  'main.feature2.title': {
    no: 'Bompenger inkludert',
    en: 'Tolls included'
  },
  'main.feature2.text': {
    no: 'Alle bomstasjoner langs ruten beregnes automatisk med korrekte priser for din biltype.',
    en: 'All toll stations along the route are automatically calculated with correct prices for your vehicle type.'
  },
  'main.feature3.title': {
    no: 'Del kostnadene',
    en: 'Share the costs'
  },
  'main.feature3.text': {
    no: 'Enkelt å fordele kjørekostnadene mellom flere passasjerer for samkjøring og turer.',
    en: 'Easy to distribute driving costs among multiple passengers for carpooling and trips.'
  },
  'main.feature4.title': {
    no: 'Reiseruter i hele Norge',
    en: 'Travel routes throughout Norway'
  },
  'main.feature4.text': {
    no: 'Fra Oslo til Bergen, Stavanger til Tromsø, eller hvor som helst i Norge - vi beregner alle kostnader.',
    en: 'From Oslo to Bergen, Stavanger to Tromsø, or anywhere in Norway - we calculate all costs.'
  },
  'main.whyUs.title': {
    no: 'Hvorfor velge vår bompenge kalkulator?',
    en: 'Why choose our toll calculator?'
  },
  'main.whyUs.text': {
    no: 'Vår avanserte bompenge kalkulator tar hensyn til alle bomstasjoner langs ruten din, inkludert rabatter for elbil, AutoPASS og tidspunkter på døgnet. Vi oppdaterer kontinuerlig våre data for å sikre at du alltid får de mest nøyaktige beregningene.',
    en: 'Our advanced toll calculator takes into account all toll stations along your route, including discounts for electric vehicles, AutoPASS and times of day. We continuously update our data to ensure you always get the most accurate calculations.'
  },
  'main.fuelCosts.title': {
    no: 'Oppdaterte drivstoffkostnader',
    en: 'Updated fuel costs'
  },
  'main.fuelCosts.text': {
    no: 'DriveCalc henter daglig oppdaterte bensinpriser, dieselpriser og el-priser fra hele Norge. Vår kalkulator beregner nøyaktig drivstofforbruk basert på distanse, kjøretøytype og kjøremønster.',
    en: 'DriveCalc retrieves daily updated petrol prices, diesel prices and electricity prices from all over Norway. Our calculator calculates exact fuel consumption based on distance, vehicle type and driving pattern.'
  },
  'main.routes.title': {
    no: 'Populære ruter i Norge',
    en: 'Popular routes in Norway'
  },
  'main.routes.oslo-bergen': {
    no: 'Oslo - Bergen: En av Norges mest kjørte strekninger',
    en: 'Oslo - Bergen: One of Norway\'s most driven routes'
  },
  'main.routes.oslo-trondheim': {
    no: 'Oslo - Trondheim: Beregn kostnader for turen langs E6',
    en: 'Oslo - Trondheim: Calculate costs for the trip along E6'
  },
  'main.routes.stavanger-kristiansand': {
    no: 'Stavanger - Kristiansand: Kystveien med alle bomstasjoner',
    en: 'Stavanger - Kristiansand: The coastal road with all toll stations'
  },
  'main.routes.tromso-bodo': {
    no: 'Tromsø - Bodø: Lang kjøretur i Nord-Norge',
    en: 'Tromsø - Bodø: Long drive in Northern Norway'
  },
  'main.routes.oslo-lillehammer': {
    no: 'Oslo - Lillehammer: Populær helgetur med oppdaterte bompriser',
    en: 'Oslo - Lillehammer: Popular weekend trip with updated toll prices'
  },
  'main.about.title': {
    no: 'Om kjørekostnader i Norge',
    en: 'About driving costs in Norway'
  },
  'main.about.paragraph1': {
    no: 'Norge har et omfattende nettverk av bomstasjoner og noen av Europas høyeste drivstoffpriser. Å beregne de faktiske kostnadene for en bilreise kan være komplisert med bomavgifter som varierer basert på kjøretøytype, tidspunkt og om du har brikke.',
    en: 'Norway has an extensive network of toll stations and some of Europe\'s highest fuel prices. Calculating the actual costs for a car journey can be complicated with toll fees that vary based on vehicle type, time of day, and whether you have a toll tag.'
  },
  'main.about.paragraph2': {
    no: 'DriveCalc er utviklet for å gi deg de mest nøyaktige beregningene for alle typer reiser i Norge, enten du kjører elbil, hybrid, bensin eller diesel.',
    en: 'DriveCalc is developed to provide you with the most accurate calculations for all types of trips in Norway, whether you drive an electric car, hybrid, petrol or diesel.'
  },
  'main.about.paragraph3': {
    no: 'Vår DriveCalc-kalkulator lar deg raskt beregne alle kostnader for din reise, med alternativer for kjøretøytype, drivstofftype, antall passasjerer, og om du planlegger en enveis- eller rundtur.',
    en: 'Our DriveCalc calculator allows you to quickly calculate all costs for your journey, with options for vehicle type, fuel type, number of passengers, and whether you plan a one-way or round trip.'
  },
  'main.howItWorks.title': {
    no: 'Slik fungerer DriveCalc',
    en: 'How DriveCalc Works'
  },
  'main.howItWorks.description': {
    no: 'DriveCalc bruker avanserte algoritmer for å beregne nøyaktige kjørekostnader basert på distanse, drivstoffpriser, bomavgifter og kjøretøytype. Vår kalkulator oppdateres kontinuerlig med de nyeste prisene fra bensinstasjoner og bomselskaper over hele Norge.',
    en: 'DriveCalc uses advanced algorithms to calculate accurate driving costs based on distance, fuel prices, toll fees, and vehicle type. Our calculator is continuously updated with the latest prices from gas stations and toll companies across Norway.'
  },
  'main.routeExample.title': {
    no: 'Detaljerte ruteberegninger',
    en: 'Detailed Route Calculations'
  },
  'main.routeExample.description': {
    no: 'For hver rute gir vi en fullstendig oversikt over distanse, kjøretid, drivstofforbruk, bomstasjoner langs veien og totale kostnader. Du kan enkelt justere innstillinger som kjøretøytype, passasjerantall og om du planlegger en rundtur.',
    en: 'For each route, we provide a complete overview of distance, driving time, fuel consumption, toll stations along the way, and total costs. You can easily adjust settings such as vehicle type, number of passengers, and whether you\'re planning a round trip.'
  },
  'main.popularTollRoutes.title': {
    no: 'Populære ruter med bompenger',
    en: 'Popular routes with toll fees'
  },
  'main.popularTollRoutes.osloTrondheim': {
    no: 'Oslo - Trondheim: 7-10 bomstasjoner, ca. 500-700 kr totalt',
    en: 'Oslo - Trondheim: 7-10 toll stations, approx. 500-700 NOK total'
  },
  'main.popularTollRoutes.osloBergen': {
    no: 'Oslo - Bergen: 8-12 bomstasjoner, ca. 600-800 kr totalt',
    en: 'Oslo - Bergen: 8-12 toll stations, approx. 600-800 NOK total'
  },
  'main.popularTollRoutes.kristiansandStavanger': {
    no: 'Kristiansand - Stavanger: 5-7 bomstasjoner, ca. 350-450 kr totalt',
    en: 'Kristiansand - Stavanger: 5-7 toll stations, approx. 350-450 NOK total'
  },
  'main.fuelTable.type': {
    no: 'Drivstofftype',
    en: 'Fuel Type'
  },
  'main.fuelTable.averagePrice': {
    no: 'Gjennomsnittspris',
    en: 'Average Price'
  },
  'main.fuelTable.petrol': {
    no: 'Bensin (95)',
    en: 'Petrol (95)'
  },
  'main.fuelTable.diesel': {
    no: 'Diesel',
    en: 'Diesel'
  },
  'main.fuelTable.electricity': {
    no: 'Elektrisitet',
    en: 'Electricity'
  },
  'main.roadGuides.title': {
    no: 'Veiguider for Norge',
    en: 'Road Guides for Norway'
  },
  'main.roadGuides.scenic.title': {
    no: 'Nasjonale turistveier',
    en: 'Scenic Routes'
  },
  'main.roadGuides.scenic.description': {
    no: 'Norge har 18 nasjonale turistveier med spektakulær natur og arkitektur:',
    en: 'Norway has 18 national tourist routes with spectacular nature and architecture:'
  },
  'main.roadGuides.winter.title': {
    no: 'Vinterkjøring i Norge',
    en: 'Winter Driving in Norway'
  },
  'main.roadGuides.winter.description': {
    no: 'Vinterkjøring i Norge krever spesielle forberedelser:',
    en: 'Winter driving in Norway requires special preparations:'
  },
  'main.roadGuides.winter.tires': {
    no: 'Vinterdekk er påbudt fra november til april',
    en: 'Winter tires are mandatory from November to April'
  },
  'main.roadGuides.winter.chains': {
    no: 'Ha kjettinger tilgjengelig i fjellområder',
    en: 'Have chains available in mountain areas'
  },
  'main.roadGuides.winter.closures': {
    no: 'Sjekk veistatusen - mange fjelloverganger stenges',
    en: 'Check road status - many mountain passes close'
  },
  'main.roadGuides.winter.emergency': {
    no: 'Ha med ekstra klær, mat og varme tepper',
    en: 'Bring extra clothes, food and warm blankets'
  },

  // Tips page
  'tips.title': {
    no: 'Tips for å spare drivstoff',
    en: 'Tips for saving fuel'
  },
  'tips.drivingStyle.title': {
    no: 'Kjørestil for lavere forbruk',
    en: 'Driving style for lower consumption'
  },
  'tips.drivingStyle.tip1': {
    no: 'Jevn hastighet: Unngå unødvendig akselerasjon og nedbremsing, bruk cruisekontroll når tilgjengelig.',
    en: 'Steady speed: Avoid unnecessary acceleration and braking, use cruise control when available.'
  },
  'tips.drivingStyle.tip2': {
    no: 'Reduser hastigheten: Kjør 10 km/t under fartsgrensen på motorvei for betydelig drivstoffbesparelse.',
    en: 'Reduce speed: Drive 10 km/h below the speed limit on highways for significant fuel savings.'
  },
  'tips.drivingStyle.tip3': {
    no: 'Planlegg akselerasjon: Se fremover og akselerér gradvis i oppoverbakker.',
    en: 'Plan acceleration: Look ahead and accelerate gradually on uphill slopes.'
  },
  'tips.drivingStyle.tip4': {
    no: 'Motor-brems: Slipp gasspedalen i god tid før du må stoppe.',
    en: 'Engine braking: Release the accelerator well before you need to stop.'
  },
  
  'tips.maintenance.title': {
    no: 'Bilvedlikehold',
    en: 'Car maintenance'
  },
  'tips.maintenance.tip1': {
    no: 'Riktig dekktrykk: Sjekk dekktrykket månedlig. For lavt dekktrykk øker drivstofforbruket.',
    en: 'Correct tire pressure: Check tire pressure monthly. Low tire pressure increases fuel consumption.'
  },
  'tips.maintenance.tip2': {
    no: 'Regelmessig service: Et velkjørt kjøretøy bruker mindre drivstoff.',
    en: 'Regular service: A well-maintained vehicle uses less fuel.'
  },
  'tips.maintenance.tip3': {
    no: 'Fjern unødvendig vekt: Tøm bagasjerommet for ting du ikke trenger.',
    en: 'Remove unnecessary weight: Empty the trunk of things you don\'t need.'
  },
  'tips.maintenance.tip4': {
    no: 'Aerodynamikk: Fjern takboksen når den ikke er i bruk.',
    en: 'Aerodynamics: Remove the roof box when not in use.'
  },
  
  'tips.planning.title': {
    no: 'Reiseplanlegging',
    en: 'Trip planning'
  },
  'tips.planning.tip1': {
    no: 'Ruteplanlegging: Bruk DriveCalc for å finne den mest kostnadseffektive ruten.',
    en: 'Route planning: Use DriveCalc to find the most cost-effective route.'
  },
  'tips.planning.tip2': {
    no: 'Unngå rushtrafikk: Kjør utenom de mest trafikkerte timene for å unngå køkjøring.',
    en: 'Avoid rush hour: Drive outside the busiest hours to avoid traffic jams.'
  },
  'tips.planning.tip3': {
    no: 'Kombiner ærender: Planlegg reiser for å gjøre flere ærender på én tur.',
    en: 'Combine errands: Plan trips to do multiple errands in one go.'
  },
  
  'tips.calculate.title': {
    no: 'Beregn dine kostnader',
    en: 'Calculate your costs'
  },
  'tips.calculate.text': {
    no: 'For å se hvor mye du sparer med disse tipsene, bruk vår kostnadskalkulator for å sammenligne ditt vanlige forbruk med et optimalisert forbruk.',
    en: 'To see how much you save with these tips, use our cost calculator to compare your regular consumption with an optimized consumption.'
  },
  
  // FAQ page
  'faq.title': {
    no: 'Vanlige spørsmål om kjørekostnader',
    en: 'Frequently asked questions about driving costs'
  },
  'faq.q1': {
    no: 'Hvordan beregner DriveCalc drivstoffkostnadene?',
    en: 'How does DriveCalc calculate fuel costs?'
  },
  'faq.a1': {
    no: 'Vi bruker gjennomsnittlig drivstofforbruk for ulike kjøretøytyper og kombinerer dette med oppdaterte drivstoffpriser fra norske bensinstasjoner. For elbiler beregner vi strømforbruk basert på gjennomsnittlige kWh-priser.',
    en: 'We use average fuel consumption for different vehicle types and combine this with updated fuel prices from Norwegian gas stations. For electric cars, we calculate power consumption based on average kWh prices.'
  },
  'faq.q2': {
    no: 'Er alle bomstasjoner i Norge inkludert i beregningene?',
    en: 'Are all toll stations in Norway included in the calculations?'
  },
  'faq.a2': {
    no: 'Ja, vi bruker oppdatert data fra norske bomselskaper for å inkludere alle bomstasjoner langs den valgte ruten. Vi tar også hensyn til rabatter for ulike kjøretøytyper og tidspunkter på døgnet.',
    en: 'Yes, we use updated data from Norwegian toll companies to include all toll stations along the chosen route. We also take into account discounts for different vehicle types and times of day.'
  },
  'faq.q3': {
    no: 'Får jeg rabatt på bomavgifter med elbil?',
    en: 'Do I get a discount on toll fees with an electric car?'
  },
  'faq.a3': {
    no: 'Ja, elbiler har reduserte takster i de fleste bomstasjoner i Norge. Dette er inkludert automatisk i DriveCalc når du velger "elbil" som kjøretøytype.',
    en: 'Yes, electric cars have reduced rates at most toll stations in Norway. This is included automatically in DriveCalc when you select "electric" as the vehicle type.'
  },
  'faq.q4': {
    no: 'Hvor nøyaktige er kostnadsberegningene?',
    en: 'How accurate are the cost calculations?'
  },
  'faq.a4': {
    no: 'Vi streber etter maksimal nøyaktighet ved å bruke sanntidsdata for drivstoffpriser og bomavgifter. Vær oppmerksom på at faktisk drivstofforbruk kan variere basert på kjørestil, vær og trafikkforhold.',
    en: 'We strive for maximum accuracy by using real-time data for fuel prices and toll fees. Please note that actual fuel consumption may vary based on driving style, weather and traffic conditions.'
  },
  'faq.q5': {
    no: 'Kan jeg beregne kostnader for bilferier i Norge?',
    en: 'Can I calculate costs for car holidays in Norway?'
  },
  'faq.a5': {
    no: 'Absolutt! DriveCalc er perfekt for å planlegge bilferier i Norge. Legg inn hele reiseruten med flere stopp, og få en nøyaktig beregning av alle kjørekostnader.',
    en: 'Absolutely! DriveCalc is perfect for planning car holidays in Norway. Enter the entire travel route with multiple stops and get an accurate calculation of all driving costs.'
  },
  'faq.q6': {
    no: 'Hvorfor varierer bomavgiftene i Norge?',
    en: 'Why do toll fees vary in Norway?'
  },
  'faq.a6': {
    no: 'Bomavgifter i Norge kan variere basert på:',
    en: 'Toll fees in Norway can vary based on:'
  },
  'faq.list6.item1': {
    no: 'Kjøretøytype (elbil, hybrid, diesel, bensin)',
    en: 'Vehicle type (electric, hybrid, diesel, petrol)'
  },
  'faq.list6.item2': {
    no: 'Tidspunkt (rushtidsavgift i større byer)',
    en: 'Time (rush hour fees in larger cities)'
  },
  'faq.list6.item3': {
    no: 'AutoPASS-brikke (gir ofte rabatt)',
    en: 'AutoPASS tag (often gives discount)'
  },
  'faq.list6.item4': {
    no: 'Region og veiprosjekt (ulike priser i forskjellige deler av landet)',
    en: 'Region and road project (different prices in different parts of the country)'
  },
  'faq.a6.2': {
    no: 'DriveCalc tar hensyn til disse faktorene i beregningene våre.',
    en: 'DriveCalc takes these factors into account in our calculations.'
  },
  'faq.q7': {
    no: 'Når oppdaterer dere drivstoffprisene?',
    en: 'When do you update the fuel prices?'
  },
  'faq.a7': {
    no: 'Vi oppdaterer drivstoffprisene i sanntid basert på data fra de største bensinstasjonskjedene i Norge.',
    en: 'We update fuel prices in real-time based on data from the largest gas station chains in Norway.'
  },
  'faq.backLink': {
    no: '← Tilbake til kalkulatoren',
    en: '← Back to calculator'
  },
  
  // Footer
  'footer.home': {
    no: 'Hjem',
    en: 'Home'
  },
  'footer.tips': {
    no: 'Sparetips',
    en: 'Saving Tips'
  },
  'footer.faq': {
    no: 'Vanlige spørsmål',
    en: 'FAQ'
  },
  'footer.copyright': {
    no: 'Alle rettigheter reservert.',
    en: 'All rights reserved.'
  },
  
  // Theme toggle
  'theme.light': {
    no: 'Bytt til lys modus',
    en: 'Switch to light mode'
  },
  'theme.dark': {
    no: 'Bytt til mørk modus',
    en: 'Switch to dark mode'
  },
  
  // Time units
  'time.days': {
    no: 'dager',
    en: 'days'
  },
  'time.hours': {
    no: 'timer',
    en: 'hours'
  },
  'time.minutes': {
    no: 'minutter',
    en: 'minutes'
  }
};

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('no');

  useEffect(() => {
    // Check if the user has a language preference stored
    const storedLang = localStorage.getItem('language') as Language;
    
    if (storedLang && (storedLang === 'no' || storedLang === 'en')) {
      setLanguageState(storedLang);
    } else {
      // If no stored preference, try to detect from browser
      const browserLang = navigator.language.substring(0, 2);
      setLanguageState(browserLang === 'en' ? 'en' : 'no');
    }
  }, []);

  // Update localStorage when language changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update the html lang attribute
    document.documentElement.lang = lang;
  };

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;