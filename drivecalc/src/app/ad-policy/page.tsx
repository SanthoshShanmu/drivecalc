import styles from '../page.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'Advertising Policy | DriveCalc',
  description: 'Learn about how we implement advertisements on DriveCalc'
};

export default function AdPolicy() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>DriveCalc Advertising Policy</h1>
        
        <div className={styles.content}>
          <p>DriveCalc uses advertisements to support our free service that helps users calculate driving costs in Norway.</p>
          
          <h2>Our Advertising Principles</h2>
          <ul>
            <li>We only display relevant, non-intrusive advertisements</li>
            <li>User experience always comes first</li>
            <li>We respect user privacy and follow GDPR guidelines</li>
            <li>We work with reputable ad networks like Google AdSense</li>
          </ul>
          
          <h2>Types of Advertisements</h2>
          <p>The advertisements on DriveCalc may include:</p>
          <ul>
            <li>Display ads related to driving, travel, and automotive services</li>
            <li>Text ads for relevant products and services</li>
            <li>Responsive ads that adapt to different screen sizes</li>
          </ul>
          
          <div className={styles.backLink}>
            <Link href="/">← Back to calculator</Link>
          </div>
        </div>
      </div>
    </main>
  );
}