import React, { useState, useEffect } from 'react';
import dealBg from '../../assets/DealofTheDay/deal-day-bg.jpg';
import basket from '../../assets/DealofTheDay/fruit-basket.png';
import './DealOfDay.css';

const DealOfDay: React.FC = () => {
  const [time, setTime] = useState({ hours: 22, minutes: 33, seconds: 44 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;

        seconds--;

        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }

        if (minutes < 0) {
          minutes = 59;
          hours--;
        }

        if (hours < 0) {
          hours = 23;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="gm-deal-day">
      <img src={dealBg} alt="Deal of the day" className="gm-deal-day-bg" />

      <div className="gm-deal-wrapper">
        <div className="gm-deal-left">
          <span className="gm-deal-badge">🔥 Today Special Offer</span>
          <h2>Deal of the Day</h2>
         
          <div className="gm-countdown">
            <div className="gm-countdown-item">
              <span className="gm-countdown-num">{String(time.hours).padStart(2, '0')}</span>
              <span className="gm-countdown-label">Hours</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 28 }}>:</span>
            <div className="gm-countdown-item">
              <span className="gm-countdown-num">{String(time.minutes).padStart(2, '0')}</span>
              <span className="gm-countdown-label">Mins</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 28 }}>:</span>
            <div className="gm-countdown-item">
              <span className="gm-countdown-num">{String(time.seconds).padStart(2, '0')}</span>
              <span className="gm-countdown-label">Secs</span>
            </div>
          </div>
          <button className="gm-deal-btn">Shop Now</button>
        </div>

        <div className="gm-deal-right">
          <img src={basket} alt="Fruit Basket" />
        </div>

      </div>
    </section>

  );
};

export default DealOfDay;
