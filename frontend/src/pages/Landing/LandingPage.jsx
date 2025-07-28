import Hero from './components/Hero'
import Features from './components/Features'
import SignupForm from './components/SignupForm'
import Footer from './components/Footer'

export default function LandingPage() {
    return (
        <div className="bg-cream text-bee font-sans">
            <Hero />
            <Features />
            <SignupForm />
            <Footer />
        </div>
    );
}