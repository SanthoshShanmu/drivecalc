import styles from './page.module.css';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata = {
  title: 'Drivstoffsparing tips | DriveCalc',
  description: 'Effektive tips for å spare drivstoff og redusere dine kjørekostnader i Norge',
  keywords: 'drivstoffsparing, spareråd, kjøretips, økonomisk kjøring, bilhold, drivstofføkonomi',
  alternates: {
    languages: {
      'en': '/en/tips',
      'no': '/tips',
    },
  },
};

export default function FuelSavingTips() {
  return (
    <main className={styles.main}>
      <LanguageSwitcher language="no" />
      <div className={styles.container}>
        <h1 className={styles.title}>Tips for å spare drivstoff</h1>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Kjørestil for lavere forbruk</h2>
            <ul className={styles.tipList}>
              <li>
                <strong>Jevn hastighet:</strong> Unngå unødvendig akselerasjon og nedbremsing, 
                bruk cruisekontroll når tilgjengelig.
              </li>
              <li>
                <strong>Reduser hastigheten:</strong> Kjør 10 km/t under fartsgrensen på motorvei 
                for betydelig drivstoffbesparelse.
              </li>
              <li>
                <strong>Planlegg akselerasjon:</strong> Se fremover og akselerér gradvis 
                i oppoverbakker.
              </li>
              <li>
                <strong>Motor-brems:</strong> Slipp gasspedalen i god tid før du må stoppe.
              </li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>Bilvedlikehold</h2>
            <ul className={styles.tipList}>
              <li>
                <strong>Riktig dekktrykk:</strong> Sjekk dekktrykket månedlig. For lavt 
                dekktrykk øker drivstofforbruket.
              </li>
              <li>
                <strong>Regelmessig service:</strong> Et velkjørt kjøretøy bruker mindre drivstoff.
              </li>
              <li>
                <strong>Fjern unødvendig vekt:</strong> Tøm bagasjerommet for ting du ikke trenger.
              </li>
              <li>
                <strong>Aerodynamikk:</strong> Fjern takboksen når den ikke er i bruk.
              </li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>Reiseplanlegging</h2>
            <ul className={styles.tipList}>
              <li>
                <strong>Ruteplanlegging:</strong> Bruk <Link href="/">DriveCalc</Link> for å finne 
                den mest kostnadseffektive ruten.
              </li>
              <li>
                <strong>Unngå rushtrafikk:</strong> Kjør utenom de mest trafikkerte timene 
                for å unngå køkjøring.
              </li>
              <li>
                <strong>Kombiner ærender:</strong> Planlegg reiser for å gjøre flere ærender på én tur.
              </li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>Beregn dine kostnader</h2>
            <p>
              For å se hvor mye du sparer med disse tipsene, bruk vår <Link href="/">kostnadskalkulator </Link> 
              for å sammenligne ditt vanlige forbruk med et optimalisert forbruk.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}