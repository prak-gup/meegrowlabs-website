import Navigation from './components/Navigation'
import Hero from './components/Hero'
import InternshipBanner from './components/InternshipBanner'
import WhatWeDo from './components/WhatWeDo'
import Automations from './components/Automations'
import Industries from './components/Industries'
import HowItWorks from './components/HowItWorks'
import WhoItsFor from './components/WhoItsFor'
import FinalCTA from './components/FinalCTA'

function App() {
  return (
    <div className="relative min-h-screen bg-sage-50">
      <Navigation />
      <main>
        <Hero />
        <InternshipBanner />
        <WhatWeDo />
        <Automations />
        <Industries />
        <HowItWorks />
        <WhoItsFor />
        <FinalCTA />
      </main>
    </div>
  )
}

export default App
