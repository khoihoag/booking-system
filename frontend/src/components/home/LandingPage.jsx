import CTASection from './CTASection'
import FeaturedPitches from './FeaturedPitches'
import HowItWorks from './HowItWorks'
import HeroSection from './HeroSection'

export default function() {
    return (
        <div className='landing-page-container'>
            <HeroSection />
            <FeaturedPitches />
            <HowItWorks />
            <CTASection />
        </div>
    )
}