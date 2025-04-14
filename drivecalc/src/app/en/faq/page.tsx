import React from 'react';
import Link from 'next/link';
import styles from '../../faq/page.module.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// You can export metadata here because this is now a server component
export const metadata = {
  title: 'FAQ - Frequently Asked Questions About Driving Costs in Norway | DriveCalc',
  description: 'Answers to common questions about calculating fuel, tolls and other driving costs for car trips in Norway.',
  keywords: 'driving costs FAQ, toll questions, fuel prices Norway, car trip costs',
  alternates: {
    languages: {
      'en': '/en/faq',
      'no': '/faq',
    },
  },
};

export default function EnglishFaqPage() {
  return (
    <main className={styles.main}>
      {/* This client component handles language switching */}
      <LanguageSwitcher language="en" />
      
      <div className={styles.container}>
        <h1 className={styles.title}>Frequently Asked Questions About Driving Costs</h1>
        
        <div className={styles.content}>
          <div className={styles.faqItem}>
            <h2>How does DriveCalc calculate fuel costs?</h2>
            <p>
              We use average fuel consumption for different vehicle types and combine this with updated fuel prices 
              from Norwegian gas stations. For electric cars, we calculate power consumption based on average kWh prices.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Are all toll stations in Norway included in the calculations?</h2>
            <p>
              Yes, we use updated data from Norwegian toll companies to include all toll stations along the chosen route. 
              We also take into account discounts for different vehicle types and times of day.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Do I get a discount on toll fees with an electric car?</h2>
            <p>
              Yes, electric cars have reduced rates at most toll stations in Norway. 
              This is included automatically in DriveCalc when you select &quot;electric&quot; as the vehicle type.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>How accurate are the cost calculations?</h2>
            <p>
              We strive for maximum accuracy by using real-time data for fuel prices and toll fees. 
              Please note that actual fuel consumption may vary based on driving style, weather and traffic conditions.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Can I calculate costs for car holidays in Norway?</h2>
            <p>
              Absolutely! DriveCalc is perfect for planning car holidays in Norway. 
              Enter the entire travel route with multiple stops and get an accurate calculation of all driving costs.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>Why do toll fees vary in Norway?</h2>
            <p>
              Toll fees in Norway can vary based on:
            </p>
            <ul>
              <li>Vehicle type (electric, hybrid, diesel, petrol)</li>
              <li>Time (rush hour fees in larger cities)</li>
              <li>AutoPASS tag (often gives discount)</li>
              <li>Region and road project (different prices in different parts of the country)</li>
            </ul>
            <p>
              DriveCalc takes these factors into account in our calculations.
            </p>
          </div>
          
          <div className={styles.faqItem}>
            <h2>When do you update the fuel prices?</h2>
            <p>
              We update fuel prices in real-time based on data from the largest gas station chains in Norway.
            </p>
          </div>

          <div className={styles.backLink}>
            <Link href="/en">← Back to calculator</Link>
          </div>
        </div>
      </div>
    </main>
  );
}