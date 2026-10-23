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
  ['How do we start?', 'Start with a conversation. Tell us what you sell, who you want to reach, and what you have tried. We will look at where your brand is visible today and agree on a practical next step.'],
]

function TalkLink() {
  return <a className="home-button" href={TALLY} target="_blank" rel="noopener noreferrer">Talk to us <span aria-hidden="true">↗</span><span className="sr-only"> (opens in new tab)</span></a>
}

function Screen({ title, description, children, className = '' }: { title: string; description: string; children: ReactNode; className?: string }) {
  return <><p className="sr-only">{description}</p><div className={`antidote-screen ${className}`} aria-hidden="true">
    <div className="screen-bar"><span className="screen-brand"><span aria-hidden="true">✳</span> Antidote</span><span>{title}</span></div>
    {children}
    <div className="screen-caption">Sample data · Smile Studio, Jaipur · Fictional clinic</div>
  </div></>
}

function MorningBrief() {
  return <Screen title="Morning brief" description="Sample morning brief for fictional Jaipur dental clinic Smile Studio, with drafts, search opportunities, and a competitor website update." className="brief-screen">
    <div className="brief-heading"><span className="home-mono">This morning</span><div className="brief-title">A little clarity.<br />Before the day begins.</div><p>Good morning, Smile Studio. Here’s what needs you.</p></div>
    <div className="brief-metrics"><div><strong>03</strong><span>Drafts to review</span></div><div><strong>02</strong><span>Search opportunities</span></div><div><strong>01</strong><span>Competitor update</span></div></div>
    <div className="brief-note"><span className="note-icon" aria-hidden="true">↗</span><div><strong>Your next opportunity</strong><p>Patients are asking about clear aligners. Your treatment guide could answer that.</p></div></div>
    <div className="brief-task"><span className="status-dot" /> A new guide is ready for your review <span aria-hidden="true">→</span></div>
  </Screen>
}

function VisibilityScreen() {
  return <Screen title="AI visibility" description="Sample AI visibility for fictional Smile Studio: cited in two of three tracked patient questions, a rounded score of 67 out of 100." >
    <div className="screen-body"><div className="visibility-score"><div><span className="home-mono">Patient questions tracked</span><strong>2 <small>of 3 cited</small></strong></div><span className="score-ring">67<span>/ 100</span></span></div>
      <p className="screen-subtitle">Is your brand part of the answer?</p>
      <div className="question-row"><span>“Best dentist for a root canal in Jaipur?”<small>ChatGPT · Google</small></span><span className="home-pill">Cited</span></div>
      <div className="question-row"><span>“Are clear aligners worth it?”<small>Perplexity</small></span><span className="home-pill">Cited</span></div>
      <div className="question-row"><span>“Painless tooth extraction near me”<small>ChatGPT · Perplexity</small></span><span className="home-pill muted">Opportunity</span></div>
      <p className="screen-footnote">Example score: share of tracked questions with a citation, rounded.</p>
    </div>
  </Screen>
}

function ApprovalScreen() {
  return <Screen title="Content review" description="Sample content approval for fictional Smile Studio: a clear aligner guide with draft feedback and approval actions." className="approval-screen">
    <div className="screen-body"><div className="draft-meta"><span className="home-pill amber">Awaiting your approval</span><span className="home-mono">WordPress</span></div>
      <div className="draft-document"><span className="home-mono">Guide · Draft 01</span><div className="draft-title">Are clear aligners<br />right for you?</div><p>Smile Studio’s guide to clear aligners in Jaipur: questions to discuss with your dentist before choosing a treatment.</p><div className="draft-rule" /><div className="draft-rule short" /></div>
      <div className="review-comment"><span className="avatar">A</span><p>“Can we add a section on aftercare?”<small>Dr. A · Smile Studio</small></p></div>
      <div className="approval-actions"><span>Ask for a change</span><span className="approval-label">Approve & schedule <span aria-hidden="true">✓</span></span></div>
    </div>
  </Screen>
}

function CompetitorScreen() {
  return <Screen title="Competitor watch" description="Sample competitor website and blog updates for fictional Smile Studio, including a braces price guide from Northside Dental." ><div className="screen-body"><span className="home-mono">Your market, in view</span><div className="screen-title">Know what changed.</div>
    {[['Northside Dental', 'Published a new braces price guide', 'Website · Today'], ['Lakeview Dental', 'Published a guide to dental implants', 'Blog · Yesterday'], ['Smile Studio', 'Clear aligner guide ready to review', 'Your next move']].map(([name, update, source]) => <div className="competitor-row" key={name}><span className="competitor-icon" aria-hidden="true">{name[0]}</span><div><strong>{name}</strong><p>{update}</p><small>{source}</small></div></div>)}
  </div></Screen>
}

function CalendarScreen() {
  const days = [['Mon', '26', 'Instagram', 'Before/after whitening (with consent)', 'approved'], ['Tue', '27', 'Facebook', 'Meet Dr. A — our new orthodontist', 'approved'], ['Wed', '28', 'Google Business Profile', 'Root canal care in Jaipur', 'review'], ['Thu', '29', 'LinkedIn', 'Inside Smile Studio’s patient care', 'review']]
  return <Screen title="Publishing calendar" description="Sample publishing week for fictional Smile Studio, with a consented whitening post, an orthodontist introduction, and two drafts in review." ><div className="screen-body"><div className="calendar-heading"><div className="calendar-title">One week. Every channel.</div><span className="home-mono">October</span></div><div className="calendar-grid">{days.map(([day, date, platform, title, state]) => <div className="calendar-day" key={day}><span className="home-mono">{day}</span><strong>{date}</strong><div className={`calendar-post ${state}`}><span>{platform}</span><p>{title}</p><small>{state === 'approved' ? '✓ Approved' : '○ In review'}</small></div></div>)}</div><p className="screen-footnote">Only approved posts enter the publishing queue.</p></div></Screen>
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
        <div className="feature-approval"><div className="feature-copy"><span className="home-step">02 / Make it yours</span><h3>You approve.<br />It ships.</h3><p>A blog, a social post, a business update. Review the actual draft, leave feedback, and give the go-ahead. Nothing goes live without your approval.</p><a className="home-text-link" href="/antidote/">Meet Antidote <span aria-hidden="true">↗</span></a></div><ApprovalScreen /></div>
        <div className="feature-pair"><article><CompetitorScreen /><h3>Keep an eye on the market.</h3><p>See what changes on competitors’ websites and blogs. Turn a useful signal into your next move.</p><a className="home-text-link" href="/research/">Explore Antidote Research <span aria-hidden="true">↗</span></a></article><article><CalendarScreen /><h3>Show up consistently.</h3><p>Bring Instagram, Facebook, Google Business Profile, and LinkedIn into one calm publishing rhythm.</p><a className="home-text-link" href="/social/">Explore Meegrow Social <span aria-hidden="true">↗</span></a></article></div>
      </section>
      <section className="home-learn home-wrap"><span className="learn-mark" aria-hidden="true">&gt;_</span><div><p className="home-eyebrow">A little knowledge goes a long way</p><h2>New to AI? Start here.</h2><p>Free, bite-sized lessons in <span lang="hi">हिंदी</span> and English. Learn at your pace.</p></div><a className="home-text-link" href="/learn/">Take the free course <span aria-hidden="true">↗</span></a></section>
      <section className="home-faq home-wrap" aria-labelledby="faq-title"><div><p className="home-eyebrow">A few things you might be wondering</p><h2 id="faq-title">Good questions.<br />Straight answers.</h2></div><div className="faq-list">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      <section className="home-closing home-wrap"><div><p className="home-eyebrow">Your next chapter starts with a conversation</p><h2>Let’s make you<br />impossible to ignore.</h2><p>Tell us what you sell and who you sell it to.<br />We’ll work out where to go next.</p><TalkLink /></div><span className="closing-mark" aria-hidden="true">✳</span></section>
    </main>
    <SiteFooter />
  </div>
}
