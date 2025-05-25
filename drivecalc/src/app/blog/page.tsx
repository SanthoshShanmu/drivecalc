import styles from '../page.module.css';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata = {
  title: 'Driving in Norway Blog | DriveCalc',
  description: 'Expert articles, guides, and insights about driving in Norway, toll systems, fuel efficiency, and travel planning',
  keywords: 'Norway driving blog, road trips Norway, Norwegian toll system, fuel efficiency Norway',
};

export default function BlogPage() {
  return (
    <main className={styles.main}>
      <LanguageSwitcher language="no" />
      
      <div className={styles.container}>
        <h1 className={styles.title}>DriveCalc Blog: Driving in Norway</h1>
        
        <div className={styles.blogPosts}>
          <div className={styles.blogPost}>
            <h2>Complete Guide to Electric Vehicle Charging in Norway</h2>
            <div className={styles.blogMeta}>Published: May 15, 2023 | 12 min read</div>
            <p className={styles.blogExcerpt}>
              With the highest percentage of electric vehicles per capita in the world, Norway has built an extensive charging infrastructure. This guide covers everything from charging networks to payment systems, pricing, and planning long EV trips across Norway&#39;s scenic routes.
            </p>
            <Link href="/blog/ev-charging-norway" className={styles.readMore}>
              Read full article &rarr;
            </Link>
          </div>
          
          <div className={styles.blogPost}>
            <h2>Norway&#39;s Most Expensive and Cheapest Toll Routes</h2>
            <div className={styles.blogMeta}>Published: March 22, 2023 | 9 min read</div>
            <p className={styles.blogExcerpt}>
              Some routes in Norway can accumulate significant toll costs, while others offer scenic drives with minimal fees. We analyze the cost differences between major routes and provide alternatives that can save you money without sacrificing the Norwegian experience.
            </p>
            <Link href="/blog/toll-cost-comparison" className={styles.readMore}>
              Read full article &rarr;
            </Link>
          </div>
          
          <div className={styles.blogPost}>
            <h2>Seasonal Fuel Price Fluctuations in Norway: When to Fill Up</h2>
            <div className={styles.blogMeta}>Published: February 8, 2023 | 8 min read</div>
            <p className={styles.blogExcerpt}>
              Norwegian fuel prices follow predictable patterns throughout the year and even within each week. Understanding these fluctuations can save you significant money. This comprehensive analysis shows the best times to refuel and how to find the cheapest stations.
            </p>
            <Link href="/blog/fuel-price-patterns" className={styles.readMore}>
              Read full article &rarr;
            </Link>
          </div>
          
          <div className={styles.blogPost}>
            <h2>Winter Driving in Norway: Essential Safety Guide</h2>
            <div className={styles.blogMeta}>Published: January 5, 2023 | 15 min read</div>
            <p className={styles.blogExcerpt}>
              Norway&#39;s winter conditions present unique challenges for drivers, especially those from warmer climates. From tire requirements to emergency preparations and understanding road closures, this guide covers everything you need to know to drive safely during Norwegian winters.
            </p>
            <Link href="/blog/winter-driving-safety" className={styles.readMore}>
              Read full article &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}