import type { ReactNode } from 'react'
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'
import { TALLY } from '../lib/site'

const PLATFORMS = ['WordPress', 'Google Business Profile', 'Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'ChatGPT', 'Perplexity', 'Google']
const FAQ = [
  ['What is GEO?', 'Generative engine optimisation helps your brand become a useful, credible source for AI answers. We work on your content, site structure, and online presence so tools like ChatGPT, Perplexity, and Google can find and cite you. Citations are earned, never guaranteed.'],
  ['How is this different from an SEO agency?', 'Search visibility is only part of the job. We connect research, content, social publishing, and competitor monitoring through Antidote, our own software. You get a team to do the work and a clear view of what needs your approval.'],
  ['Do I need to approve everything?', 'Yes. Nothing ships without your approval. You can review the copy, request changes, and approve the final version before anything is published to your website or social channels.'],
  ['Which platforms do you work with?', 'We work with WordPress, Google Business Profile, Instagram, Facebook, LinkedIn, and YouTube. Our search and AI visibility work covers Google, ChatGPT, and Perplexity. We agree on the right channels for your business before we start.'],
  ['Do you work outside India?', 'Yes. We work with brands in India and beyond. Tell us about your market, audience, and time zone so we can work out the right fit.'],
  ['How do we start?', 'Start with a conversation. Tell us what you sell, who you want to reach, and what you have tried. We will look at where your brand is visible today and agree on a practical next step.'],
]

function TalkLink() {
  return <a className="home-button" href={TALLY} target="_blank" rel="noopener noreferrer">Talk to us <span aria-hidden="true">↗</span></a>
}

function Screen({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <div className={`antidote-screen ${className}`}>
    <div className="screen-bar"><span className="screen-brand"><span aria-hidden="true">✳</span> Antidote</span><span>{title}</span></div>
    {children}
    <div className="screen-caption">Illustrative workspace · Sample data</div>
  </div>
}

function MorningBrief() {
  return <Screen title="Morning brief" className="brief-screen">
    <div className="brief-heading"><span className="home-mono">Friday, 23 October · 9:00 AM</span><h2>A little clarity.<br />Before the day begins.</h2><p>Good morning, Alex. Here’s what needs you.</p></div>
    <div className="brief-metrics"><div><strong>03</strong><span>Drafts to review</span></div><div><strong>02</strong><span>Search opportunities</span></div><div><strong>01</strong><span>Competitor update</span></div></div>
    <div className="brief-note"><span className="note-icon" aria-hidden="true">↗</span><div><strong>Your next opportunity</strong><p>Buyers are asking how to choose a workspace. Your comparison guide could answer that.</p></div></div>
    <div className="brief-task"><span className="status-dot" /> A new guide is ready for your review <span aria-hidden="true">→</span></div>
  </Screen>
}

function VisibilityScreen() {
  return <Screen title="AI visibility">
    <div className="screen-body"><div className="visibility-score"><div><span className="home-mono">Buyer questions tracked</span><strong>3 <small>of 5 cited</small></strong></div><span className="score-ring">60<span>/ 100</span></span></div>
      <p className="screen-subtitle">Is your brand part of the answer?</p>
      <div className="question-row"><span>“Best workspace for a small team?”<small>ChatGPT · Google</small></span><span className="home-pill">Cited</span></div>
      <div className="question-row"><span>“What should a flexible office include?”<small>Perplexity</small></span><span className="home-pill">Cited</span></div>
      <div className="question-row"><span>“Coworking or a private office?”<small>ChatGPT · Perplexity</small></span><span className="home-pill muted">Opportunity</span></div>
      <p className="screen-footnote">Example score: share of tracked questions with a citation.</p>
    </div>
  </Screen>
}

function ApprovalScreen() {
  return <Screen title="Content review">
    <div className="screen-body"><div className="draft-meta"><span className="home-pill amber">Awaiting your approval</span><span className="home-mono">WordPress</span></div>
      <div className="draft-document"><span className="home-mono">Guide · Draft 01</span><h3>A workspace that works<br />for your whole team.</h3><p>Great work starts with the right space. Here’s what to look for before you choose your next office.</p><div className="draft-rule" /><div className="draft-rule short" /></div>
      <div className="review-comment"><span className="avatar">A</span><p>“Can we add a section on meeting rooms?”<small>Alex · Your feedback stays with the draft</small></p></div>
      <div className="approval-actions"><span>Request changes</span><span className="approval-label">Approve & schedule <span aria-hidden="true">✓</span></span></div>
    </div>
  </Screen>
}

function CompetitorScreen() {
  return <Screen title="Competitor watch"><div className="screen-body"><span className="home-mono">Your market, in view</span><h3 className="screen-title">Know what changed.</h3>
    {[['North Studio', 'Published a new pricing guide', 'Website · Today'], ['Fieldwork Co.', 'Added a second location', 'Google Business Profile · Yesterday'], ['Your brand', 'Comparison guide ready to review', 'Your next move']].map(([name, update, source]) => <div className="competitor-row" key={name}><span className="competitor-icon" aria-hidden="true">{name[0]}</span><div><strong>{name}</strong><p>{update}</p><small>{source}</small></div></div>)}
  </div></Screen>
}

function CalendarScreen() {
  const days = [['Mon', '26', 'Instagram', 'A look inside', 'approved'], ['Tue', '27', 'Facebook', 'Meet the team', 'approved'], ['Wed', '28', 'Google Business Profile', 'Location update', 'review'], ['Thu', '29', 'LinkedIn', 'A better workday', 'review']]
  return <Screen title="Publishing calendar"><div className="screen-body"><div className="calendar-heading"><h3>One week. Every channel.</h3><span className="home-mono">October</span></div><div className="calendar-grid">{days.map(([day, date, platform, title, state]) => <div className="calendar-day" key={day}><span className="home-mono">{day}</span><strong>{date}</strong><div className={`calendar-post ${state}`}><span>{platform}</span><p>{title}</p><small>{state === 'approved' ? '✓ Approved' : '○ In review'}</small></div></div>)}</div><p className="screen-footnote">Only approved posts enter the publishing queue.</p></div></Screen>
}

export default function CompanyHome() {
  return <div className="company-home">
    <SiteNav />
    <main>
      <section className="home-hero home-wrap" aria-labelledby="home-title">
        <div className="hero-copy"><p className="home-eyebrow">The growth lab for the AI era</p><h1 id="home-title">We make brands impossible to ignore.</h1><p className="hero-description">Your next customer is searching. Asking AI. Scrolling their feed. Let’s make sure they find you.</p><TalkLink /><p className="hero-aside">Strategy, software, and the people to make it happen.</p></div>
        <div className="hero-product"><MorningBrief /><div className="product-signature"><span className="signature-line" /> Meet Antidote. Your marketing, moving.</div></div>
      </section>
      <section className="home-platforms home-wrap" aria-label="Platforms we work with"><p className="home-mono">Where your customers look. Where we work.</p><div>{PLATFORMS.map(platform => <span key={platform}>{platform}</span>)}</div></section>
      <section className="home-work home-wrap" aria-labelledby="work-title">
        <div className="section-intro"><p className="home-eyebrow">From invisible to in the conversation</p><h2 id="work-title">Good marketing is a rhythm.<br />Not a pile of tasks.</h2><p>Antidote connects the dots. Our team turns them into work that gets your brand found, remembered, and chosen.</p></div>
        <div className="feature-row"><div className="feature-copy"><span className="home-step">01 / Get found</span><h3>Be the answer.<br />Wherever they ask.</h3><p>We find the questions your buyers are asking, then build the useful content and credible presence that help your brand show up in search and AI answers.</p><a className="home-text-link" href="/seo-geo/">Explore SEO & GEO <span aria-hidden="true">↗</span></a></div><VisibilityScreen /></div>
        <div className="feature-row reverse"><div className="feature-copy"><span className="home-step">02 / Make it yours</span><h3>You approve.<br />It ships.</h3><p>A blog, a social post, a business update. Review the actual draft, leave feedback, and give the go-ahead. Nothing goes live without your approval.</p><a className="home-text-link" href="/antidote/">Meet Antidote <span aria-hidden="true">↗</span></a></div><ApprovalScreen /></div>
        <div className="feature-pair"><article><CompetitorScreen /><h3>Keep an eye on the market.</h3><p>See what competitors publish and where they show up. Turn a useful signal into your next move.</p><a className="home-text-link" href="/research/">Explore Antidote Research <span aria-hidden="true">↗</span></a></article><article><CalendarScreen /><h3>Show up consistently.</h3><p>Bring Instagram, Facebook, Google Business Profile, and LinkedIn into one calm publishing rhythm.</p><a className="home-text-link" href="/social/">Explore Meegrow Social <span aria-hidden="true">↗</span></a></article></div>
      </section>
      <section className="home-learn home-wrap"><span className="learn-mark" aria-hidden="true">&gt;_</span><div><p className="home-eyebrow">A little knowledge goes a long way</p><h2>New to AI? Start here.</h2><p>Free, bite-sized lessons in हिंदी and English. Learn at your pace.</p></div><a className="home-text-link" href="/learn/">Take the free course <span aria-hidden="true">↗</span></a></section>
      <section className="home-faq home-wrap" aria-labelledby="faq-title"><div><p className="home-eyebrow">A few things you might be wondering</p><h2 id="faq-title">Good questions.<br />Straight answers.</h2></div><div className="faq-list">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      <section className="home-closing home-wrap"><div><p className="home-eyebrow">Your next chapter starts with a conversation</p><h2>Let’s make you<br />impossible to ignore.</h2><p>Tell us what you sell and who you sell it to.<br />We’ll work out where to go next.</p><TalkLink /></div><span className="closing-mark" aria-hidden="true">✳</span></section>
    </main>
    <SiteFooter />
  </div>
}
