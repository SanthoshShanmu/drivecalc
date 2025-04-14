import Link from 'next/link';
import styles from './page.module.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata = {
  title: 'FAQ - Vanlige spørsmål om kjørekostnader i Norge | DriveCalc',
  description: 'Svar på vanlige spørsmål om beregning av drivstoff, bompenger og andre kjørekostnader for bilturer i Norge.',
  keywords: 'kjørekostnader FAQ, bompenger spørsmål, drivstoffpriser Norge, biltur kostnader',
  alternates: {
    languages: {
      'en': '/en/faq',
      'no': '/faq',
    },
  },
};

export default function FAQPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <LanguageSwitcher language="no" />
        <h1 className={styles.title}>Vanlige spørsmål om kjørekostnader</h1>
        
        <div className={styles.content}>
          <div className={styles.faqItem}>
            <h2>Hvordan beregner DriveCalc drivstoffkostnadene?</h2>
            <p>
              Vi bruker gjennomsnittlig drivstofforbruk for ulike kjøretøytyper og kombinerer dette med 
              oppdaterte drivstoffpriser fra norske bensinstasjoner. For elbiler beregner vi strømforbruk 
              basert på gjennomsnittlige kWh-priser.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Er alle bomstasjoner i Norge inkludert i beregningene?</h2>
            <p>
              Ja, vi bruker oppdatert data fra norske bomselskaper for å inkludere alle bomstasjoner 
              langs den valgte ruten. Vi tar også hensyn til rabatter for ulike kjøretøytyper og 
              tidspunkter på døgnet.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Får jeg rabatt på bomavgifter med elbil?</h2>
            <p>
              Ja, elbiler har reduserte takster i de fleste bomstasjoner i Norge. Dette er 
              inkludert automatisk i DriveCalc når du velger &quot;elbil&quot; som kjøretøytype.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Hvor nøyaktige er kostnadsberegningene?</h2>
            <p>
              Vi streber etter maksimal nøyaktighet ved å bruke sanntidsdata for drivstoffpriser 
              og bomavgifter. Vær oppmerksom på at faktisk drivstofforbruk kan variere basert på 
              kjørestil, vær og trafikkforhold.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Kan jeg beregne kostnader for bilferier i Norge?</h2>
            <p>
              Absolutt! DriveCalc er perfekt for å planlegge bilferier i Norge. Legg inn hele 
              reiseruten med flere stopp, og få en nøyaktig beregning av alle kjørekostnader.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Hvorfor varierer bomavgiftene i Norge?</h2>
            <p>
              Bomavgifter i Norge kan variere basert på:
            </p>
            <ul>
              <li>Kjøretøytype (elbil, hybrid, diesel, bensin)</li>
              <li>Tidspunkt (rushtidsavgift i større byer)</li>
              <li>AutoPASS-brikke (gir ofte rabatt)</li>
              <li>Region og veiprosjekt (ulike priser i forskjellige deler av landet)</li>
            </ul>
            <p>
              DriveCalc tar hensyn til disse faktorene i beregningene våre.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Når oppdaterer dere drivstoffprisene?</h2>
            <p>
              Vi oppdaterer drivstoffprisene i sanntid basert på data fra de største bensinstasjonskjedene i Norge.
            </p>
          </div>

          <div className={styles.backLink}>
            <Link href="/">← Tilbake til kalkulatoren</Link>
          </div>
        </div>
      </div>
    </main>
  );
}