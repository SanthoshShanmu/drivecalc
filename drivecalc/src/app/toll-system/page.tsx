import styles from '../page.module.css';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata = {
  title: 'Norwegian Toll System Explained | DriveCalc',
  description: 'Comprehensive guide to Norway&#39;s toll system, including AutoPASS, pricing structures, discounts, and payment methods',
  keywords: 'Norway toll system, AutoPASS, toll roads Norway, toll fees, toll payment Norway, bomstasjoner',
  alternates: {
    languages: {
      'en': '/en/toll-system',
      'no': '/toll-system',
    },
  },
};

export default function TollSystemPage() {
  return (
    <main className={styles.main}>
      <LanguageSwitcher language="no" />
      
      <div className={styles.container}>
        <h1 className={styles.title}>Norwegian Toll System Explained</h1>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>How Norway&#39;s Toll System Works</h2>
            <p>
              Norway has one of the world&#39;s most advanced and extensive road toll systems. Unlike many countries where tolls are limited to certain highways or bridges, Norway employs a comprehensive network of toll stations (bomstasjoner) throughout its road infrastructure.
            </p>
            <p>
              These toll stations serve two main purposes: financing road infrastructure projects and managing traffic, particularly in urban areas where congestion and environmental concerns are significant factors.
            </p>
            
            <h3>Types of Toll Stations</h3>
            <ul>
              <li><strong>Project Financing Tolls</strong> - Fund specific road projects like tunnels, bridges, and highway improvements</li>
              <li><strong>Urban Toll Rings</strong> - Encircle major cities like Oslo, Bergen, and Trondheim to manage traffic and fund local infrastructure</li>
              <li><strong>Environmental Differentiated Tolls</strong> - Vary based on vehicle emissions to encourage cleaner transportation</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>AutoPASS System</h2>
            <p>
              AutoPASS is Norway&#39;s electronic toll collection system that allows for seamless passage through toll stations without stopping. The system uses transponders (brikker) installed in vehicles that communicate with receivers at toll stations.
            </p>
            
            <h3>Benefits of AutoPASS</h3>
            <ul>
              <li><strong>Discounts</strong> - Users typically receive a 20% discount on toll fees</li>
              <li><strong>Convenience</strong> - No need to stop at toll stations</li>
              <li><strong>Simplified Billing</strong> - Monthly invoices instead of individual payments</li>
              <li><strong>International Compatibility</strong> - Works with EasyGo service for travel in Scandinavia</li>
            </ul>
            
            <p>
              Foreign vehicles can either rent an AutoPASS transponder, register their license plate for automatic billing, or use the AutoPASS Visitor service for temporary travel.
            </p>
          </section>
          
          <section className={styles.section}>
            <h2>Pricing Structure</h2>
            <p>
              Toll rates in Norway vary based on several factors:
            </p>
            
            <h3>Vehicle Type and Environmental Class</h3>
            <table className={styles.tollTable}>
              <thead>
                <tr>
                  <th>Vehicle Category</th>
                  <th>Typical Price Range</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Electric vehicles</td>
                  <td>0-50% of full rate</td>
                  <td>Discounts vary by location</td>
                </tr>
                <tr>
                  <td>Hydrogen vehicles</td>
                  <td>0-50% of full rate</td>
                  <td>Similar discounts to EVs</td>
                </tr>
                <tr>
                  <td>Plug-in hybrids</td>
                  <td>50-90% of full rate</td>
                  <td>Discount varies by emission level</td>
                </tr>
                <tr>
                  <td>Petrol/diesel passenger cars</td>
                  <td>Full rate</td>
                  <td>Euro 6 engines may receive discounts in some areas</td>
                </tr>
                <tr>
                  <td>Heavy vehicles (&gt;3.5t)</td>
                  <td>2-3x passenger car rate</td>
                  <td>Based on weight class</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Time of Day (Rush Hour Pricing)</h3>
            <p>
              In urban areas, toll rates typically increase during rush hours:
            </p>
            <ul>
              <li><strong>Morning rush hour:</strong> Usually 6:30-9:00</li>
              <li><strong>Evening rush hour:</strong> Usually 15:00-17:00</li>
              <li><strong>Rush hour surcharge:</strong> Typically 10-40% higher than standard rates</li>
            </ul>
          </section>
        </div>
        
        <div className={styles.ctaSection}>
          <h2>Calculate Your Exact Toll Costs</h2>
          <p>
            Now that you understand how Norway&#39;s toll system works, use DriveCalc to calculate the precise toll costs for your specific journey.
          </p>
          <Link href="/" className={styles.ctaButton}>
            Calculate Driving Costs Now
          </Link>
        </div>
      </div>
    </main>
  );
}