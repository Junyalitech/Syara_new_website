import React from 'react'
import AboutHero from '../components/AboutPage/AboutHero';
import VisionSection from '../components/AboutPage/VisionSection';
import FAQSection from '../components/AboutPage/FAQSection';
import TeamSection from '../components/AboutPage/TeamSection';
import TrustBadges from '../components/AboutPage/TrustBadeges';
import DirectorSection from '../components/AboutPage/DirectorSection';

const AboutPage = () => {
    return (
        <div>
            <main style={{padding:'20px'}}>
                <AboutHero />
                <TrustBadges />
                <VisionSection />
                <DirectorSection/>
                {/* <PromoSection />
                <TestimonialsSection /> */}
                <TeamSection />
                <FAQSection />
            </main>
        </div>
    )
}

export default AboutPage