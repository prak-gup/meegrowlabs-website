import { Suspense, lazy } from 'react'

import Navigation from './components/Navigation'
import Hero from './components/Hero'

const WhatWeDo = lazy(() => import('./components/WhatWeDo'))
const Automations = lazy(() => import('./components/Automations'))
const Industries = lazy(() => import('./components/Industries'))
const HowItWorks = lazy(() => import('./components/HowItWorks'))
const WhoItsFor = lazy(() => import('./components/WhoItsFor'))
const Platforms = lazy(() => import('./components/Platforms'))
const FAQ = lazy(() => import('./components/FAQ'))
const FinalCTA = lazy(() => import('./components/FinalCTA'))

// Gated course platform (client-only; landing stays prerendered for SEO).
const CourseApp = lazy(() => import('./app/CourseApp'))
const Login = lazy(() => import('./pages/Login'))

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  if (path === '/login') {
    return <Suspense fallback={null}><Login /></Suspense>
  }
  if (path.startsWith('/app')) {
    return <Suspense fallback={null}><CourseApp /></Suspense>
  }
  return (
    <div className="relative min-h-screen bg-sage-50">
      <Navigation />
      <main>
        <Hero />
        <Suspense fallback={<div className="py-10 text-center text-slate-500">Loading...</div>}>
          <WhatWeDo />
          <Automations />
          <Industries />
          <HowItWorks />
          <WhoItsFor />
          <Platforms />
          <FAQ />
          <FinalCTA />
        </Suspense>
      </main>
    </div>
  )
}

export default App
