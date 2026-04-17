import { ShieldCheck, Lock, Truck, RotateCcw } from 'lucide-react';
import './TrustBadges.css';

const badges = [
  { icon: ShieldCheck, title: 'Certified', desc: 'Available certificates of authenticity' },
  { icon: Lock, title: 'Secure', desc: 'Certified marketplace since 2024' },
  { icon: Truck, title: 'Shipping', desc: 'Free, fast and reliable worldwide' },
  { icon: RotateCcw, title: 'Transparent', desc: 'Hassle-free return policy' },
];

const TrustBadges = () => (
  <section className="trust-badges">
    {badges.map((b) => (
      <div className="trust-badge" key={b.title}>
        <b.icon className="trust-badge__icon" strokeWidth={1.5} />
        <h3 className="trust-badge__title">{b.title}</h3>
        <p className="trust-badge__desc">{b.desc}</p>
      </div>
    ))}
  </section>
);

export default TrustBadges;
