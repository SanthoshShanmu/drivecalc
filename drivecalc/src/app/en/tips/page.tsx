import styles from '../../tips/page.module.css';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata = {
  title: 'Fuel Saving Tips | DriveCalc',
  description: 'Effective tips for saving fuel and reducing your driving costs in Norway',
  keywords: 'fuel saving, saving tips, driving tips, economical driving, car maintenance, fuel economy',
  alternates: {
    languages: {
      'en': '/en/tips',
      'no': '/tips',
    },
  },
};

export default function EnglishFuelSavingTips() {
  return (
    <main className={styles.main}>
      {/* This client component handles language switching */}
      <LanguageSwitcher language="en" />
      
      <div className={styles.container}>
        <h1 className={styles.title}>Tips for Saving Fuel</h1>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Driving Style for Lower Consumption</h2>
            <ul className={styles.tipList}>
              <li>
                <strong>Steady speed:</strong> Avoid unnecessary acceleration and braking, 
                use cruise control when available.
              </li>
              <li>
                <strong>Reduce speed:</strong> Drive 10 km/h below the speed limit on highways 
                for significant fuel savings.
              </li>
              <li>
                <strong>Plan acceleration:</strong> Look ahead and accelerate gradually 
                on uphill slopes.
              </li>
              <li>
                <strong>Engine braking:</strong> Release the accelerator well before you need to stop.
              </li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>Car Maintenance</h2>
            <ul className={styles.tipList}>
              <li>
                <strong>Correct tire pressure:</strong> Check tire pressure monthly. Low tire 
                pressure increases fuel consumption.
              </li>
              <li>
                <strong>Regular service:</strong> A well-maintained vehicle uses less fuel.
              </li>
              <li>
                <strong>Remove unnecessary weight:</strong> Empty the trunk of things you do not need.
              </li>
              <li>
                <strong>Aerodynamics:</strong> Remove the roof box when not in use.
              </li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>Trip Planning</h2>
            <ul className={styles.tipList}>
              <li>
                <strong>Route planning:</strong> Use <Link href="/en">DriveCalc</Link> to find 
                the most cost-effective route.
              </li>
              <li>
                <strong>Avoid rush hour:</strong> Drive outside the busiest hours 
                to avoid traffic jams.
              </li>
              <li>
                <strong>Combine errands:</strong> Plan trips to do multiple errands in one go.
              </li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>Calculate Your Costs</h2>
            <p>
              To see how much you save with these tips, use our <Link href="/en">cost calculator</Link> 
              to compare your regular consumption with an optimized consumption.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}