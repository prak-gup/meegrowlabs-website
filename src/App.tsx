import { Suspense, lazy } from 'react'

import CompanyHome from './components/CompanyHome'

// Gated course platform (client-only; landing stays prerendered for SEO).
const CourseApp = lazy(() => import('./app/CourseApp'))
const Login = lazy(() => import('./pages/Login'))

function App() {
  const raw = typeof window !== 'undefined' ? window.location.pathname : '/'
  // /login/ and /app/ are routed to index.html too — treat them as /login and /app.
  const path = raw.length > 1 ? raw.replace(/\/+$/, '') : raw
  if (path === '/login') {
    return <Suspense fallback={null}><Login /></Suspense>
  }
  if (path.startsWith('/app')) {
    return <Suspense fallback={null}><CourseApp /></Suspense>
  }
  return <CompanyHome />
}

export default App
