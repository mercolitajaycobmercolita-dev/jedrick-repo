import { useEffect, useRef, useState } from 'react'
import { Icon } from './components/Icon.jsx'
import { SectionHeading } from './components/SectionHeading.jsx'
import {
  education,
  navigationItems,
  projects,
  skillGroups,
  socialLinks,
} from './data/portfolio.js'
import {
  ADMIN_CERTIFICATES_KEY,
  ADMIN_PROJECTS_KEY,
  fetchCertificates,
  fetchProjects,
  removeContent,
  storeCertificate,
  storeProject,
  usePortfolioContent,
} from './data/adminStore.js'
import {
  getCurrentUser,
  isPortfolioAdmin,
  isSupabaseConfigured,
  consumeAuthRedirect,
  signInWithPassword,
  signOut,
  updateCurrentUserPassword,
} from './lib/supabase.js'

const externalLinkProps = {
  target: '_blank',
  rel: 'noreferrer',
}

function Navbar({ activePage }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', isOpen)

    if (!isOpen) return undefined

    const focusableSelector = 'a[href], button:not([disabled])'
    const focusable = () => Array.from(menuRef.current?.querySelectorAll(focusableSelector) ?? [])
    const firstFocusable = focusable()[0]
    const timer = window.setTimeout(() => firstFocusable?.focus(), 0)

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }

      if (event.key !== 'Tab') return
      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('menu-is-open')
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="site-header">
      <a className="brand" href="#/home" aria-label="Jedrick Miclat — return home" onClick={closeMenu}>
        JEDRICK<span className="brand-dot">.</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <a
            className={activePage === item.href.slice(2) ? 'is-active' : ''}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a className="nav-contact-link" href="#/contact" onClick={closeMenu}>
        Let&apos;s connect <Icon name="arrowUpRight" size={16} />
      </a>

      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="menu-toggle"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        <Icon name={isOpen ? 'close' : 'menu'} size={23} />
      </button>

      <div className={`mobile-nav-shell ${isOpen ? 'is-open' : ''}`} id="mobile-navigation" ref={menuRef}>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <span className="eyebrow">Navigate</span>
          {navigationItems.map((item, index) => (
            <a href={item.href} key={item.href} onClick={closeMenu}>
              <span>0{index + 1}</span>
              {item.label}
              <Icon name="arrowUpRight" size={20} />
            </a>
          ))}
        </nav>
        <a className="mobile-email" href={socialLinks.email.href} onClick={closeMenu}>
          {socialLinks.email.value}
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="page-grid hero-grid">
        <div className="hero-copy" data-reveal>
          <div className="hero-kicker">
            <span className="pulse-dot" aria-hidden="true" />
            Open to learning &amp; collaboration
          </div>
          <p className="hero-overline">Aspiring Full-Stack Developer</p>
          <h1 id="hero-title">
            Hello, I&apos;m <span className="hero-highlight">Jedrick</span>
          </h1>
          <p className="hero-intro">
            A BSIT student who enjoys turning ideas into functional digital
            experiences through projects, experimentation, and hands-on learning.
          </p>
          <div className="hero-actions">
          <a className="button button--primary" href="#/projects">
              Explore my projects <Icon name="arrow" size={19} />
            </a>
            <a className="button button--ghost" href="#/about">
              About me <Icon name="arrowUpRight" size={18} />
            </a>
          </div>
          <div className="hero-links" aria-label="Quick links">
            <a href={socialLinks.github.href} {...externalLinkProps}>
              <Icon name="github" size={17} /> GitHub <Icon name="arrowUpRight" size={14} />
            </a>
            <a href={socialLinks.email.href}>
              <Icon name="mail" size={17} /> Email <Icon name="arrowUpRight" size={14} />
            </a>
          </div>
        </div>

        <div className="identity-panel" data-reveal>
          <div className="identity-topline">
            <span>PERSONAL PHOTO</span>
            <span>public/IMAGES/profile.jpg</span>
          </div>
          <img className="identity-photo" src="/IMAGES/profile.jpg" alt="Jedrick Miclat" onLoad={(event) => event.currentTarget.parentElement.classList.add('has-photo')} onError={(event) => event.currentTarget.remove()} />
          <div className="identity-grid" aria-hidden="true" />
          <div className="monogram" aria-label="Jedrick Miclat initials">JM</div>
          <div className="identity-bottomline">
            <div>
              <span className="eyebrow">01</span>
              <p>Create · Learn · Iterate</p>
            </div>
            <Icon name="sparkle" size={28} />
          </div>
          <div className="current-note">
            <span className="current-note__label"><span className="pulse-dot" aria-hidden="true" /> Currently</span>
            <strong>Learning. Building. Growing.</strong>
          </div>
        </div>
      </div>
      <a className="hero-scroll-cue" href="#/about" aria-label="Open the about page">
        <span>Click to explore</span>
        <Icon name="arrow" size={20} />
      </a>
    </section>
  )
}

function About() {
  return (
    <section className="section section--about" id="about" aria-labelledby="about-title" data-reveal>
      <div className="page-grid about-grid">
        <SectionHeading
          eyebrow="The person behind the work"
          number="02"
          title="Curiosity is my starting point."
          intro="I’m building my path one project, one problem, and one lesson at a time."
          titleId="about-title"
          level="h1"
        />
        <div className="about-content">
          <p className="lead-copy">
            I&apos;m developing the foundations to become a thoughtful full-stack developer: learning
            how good software is planned, built, and improved one project at a time.
          </p>
          <p>
            My focus is practical development—making ideas clear, functional, and worth using.
            Every project is an opportunity to grow my technical confidence, solve a real problem,
            and sharpen how I think.
          </p>
          <a className="text-link" href="#/contact">
            Start a conversation <Icon name="arrowUpRight" size={17} />
          </a>
        </div>
        <aside className="education-sheet" aria-label="Education">
          
          <div className="sheet-header">
            <span className="eyebrow">Education / current</span>
            <Icon name="hash" size={19} />
          </div>
          <div className="school-mark">DCT</div>
          <div className="education-details">
            <h3>{education.school}</h3>
            <p>{education.course}</p>
            <div className="education-meta">
              <span>{education.year}</span>
              <span>{education.graduation}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section className="section section--skills" id="skills" aria-labelledby="skills-title" data-reveal>
      <div className="page-grid">
        <SectionHeading
          eyebrow="Toolkit in progress"
          number="04"
          title="Tools I&apos;m growing with."
          intro="These are tools I&apos;m actively practicing and building with—not a claim of mastery."
          titleId="skills-title"
          level="h1"
        />
        <div className="skills-note">
          <Icon name="sparkle" size={18} />
          <span>Progress is part of the craft.</span>
        </div>
        <div className="skill-groups">
          {skillGroups.map((group, index) => (
            <article className="skill-group" key={group.label}>
              <div className="skill-group__index">0{index + 1}</div>
              <div>
                <h3>{group.label}</h3>
                <p>{group.note}</p>
              </div>
              <div className="skill-tags" aria-label={`${group.label} technologies`}>
                {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const isUpcoming = project.status?.toLowerCase().includes('planning')

  return (
    <article className={`project-card ${isUpcoming ? 'project-card--upcoming' : ''}`}>
      <div className={`project-visual project-visual--${index + 1} ${project.image ? 'has-image' : ''}`}>
        {project.image ? (
          <img className="project-visual__image" src={project.image} alt={project.imageAlt || `${project.title} preview`} loading="lazy" />
        ) : (
          <Icon name={isUpcoming ? 'sparkle' : 'code'} size={50} strokeWidth={1.15} aria-hidden="true" />
        )}
        <div className="project-visual__grid" aria-hidden="true" />
        <span className="project-visual__number" aria-hidden="true">0{index + 1}</span>
        <span className="project-visual__mark" aria-hidden="true">{isUpcoming ? 'NEXT' : 'WORK'}</span>
      </div>
      <div className="project-card__body">
        <div className="project-card__topline">
          <span className="eyebrow">{project.category}</span>
          <span className="status-label"><span className="status-mark" aria-hidden="true" />{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <dl className="project-detail-list">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{project.technologies.join(' · ')}</dd>
          </div>
        </dl>
        {(project.githubUrl || project.liveUrl) && (
          <div className="project-actions">
            {project.githubUrl && (
              <a className="text-link" href={project.githubUrl} {...externalLinkProps}>
                GitHub repository <Icon name="arrowUpRight" size={17} />
              </a>
            )}
            {project.liveUrl && (
              <a className="text-link" href={project.liveUrl} {...externalLinkProps}>
                Live site <Icon name="arrowUpRight" size={17} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function Projects() {
  const { items: allProjects, loading, error } = usePortfolioContent(ADMIN_PROJECTS_KEY, projects)
  return (
    <section className="section section--projects" id="projects" aria-labelledby="projects-title" data-reveal>
      <div className="page-grid">
        <div className="projects-heading-row">
          <SectionHeading
            eyebrow="Selected work index"
            number="03"
            title="Projects with purpose."
            intro="Real work, shared honestly—from completed experiments to the next idea taking shape."
            titleId="projects-title"
            level="h1"
          />
          <a className="project-index-link" href={socialLinks.github.href} {...externalLinkProps}>
            <Icon name="github" size={18} /> Explore GitHub <Icon name="arrowUpRight" size={16} />
          </a>
        </div>
        <div className="project-list">
          {loading && <p role="status">Loading published projects…</p>}
          {error && <p role="alert">Projects could not be loaded: {error}</p>}
          {allProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.id || project.title} />)}
        </div>
      </div>
    </section>
  )
}

function Achievements() {
  const { items: certificates, loading, error } = usePortfolioContent(ADMIN_CERTIFICATES_KEY)
  const [activeCertificate, setActiveCertificate] = useState(null)

  useEffect(() => {
    if (!activeCertificate) return undefined
    function closeOnEscape(event) {
      if (event.key === 'Escape') setActiveCertificate(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activeCertificate])

  return (
    <section className="section section--achievements" id="achievements" aria-labelledby="achievements-title" data-reveal>
      <div className="page-grid achievement-layout">
        <SectionHeading
          eyebrow="Credential archive"
          number="06"
          title="Progress worth remembering."
          intro="Certificates and achievements shared as a visual archive. Select a certificate to read its details."
          titleId="achievements-title"
          level="h1"
        />
        {loading ? <p role="status">Loading published certificates…</p> : error ? <p role="alert">Certificates could not be loaded: {error}</p> : certificates.length ? (
          <div className="certificate-grid">
            {certificates.map((certificate) => (
              <button className="certificate-card" key={certificate.id} onClick={() => setActiveCertificate(certificate)} type="button">
                <img src={certificate.image} alt={`${certificate.title} certificate`} />
                <span><strong>{certificate.title}</strong><Icon name="arrowUpRight" size={17} /></span>
              </button>
            ))}
          </div>
        ) : <div className="empty-credentials" role="status">
          <div className="credential-seal" aria-hidden="true"><Icon name="check" size={32} /></div>
          <div>
            <span className="eyebrow">Archive preparing</span>
            <h3>Future certifications will be verified before publication.</h3>
            <p>
              No credentials are listed yet. This space is intentionally reserved for authentic
              certificates, issuing organizations, dates, and verification links.
            </p>
          </div>
        </div>}
      </div>
      {activeCertificate && (
        <div className="equipment-dialog-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget) setActiveCertificate(null)
        }}>
          <section className="certificate-dialog" role="dialog" aria-modal="true" aria-labelledby="certificate-dialog-title">
            <button aria-label="Close dialog" className="dialog-close" onClick={() => setActiveCertificate(null)} type="button">×</button>
            <img src={activeCertificate.image} alt={`${activeCertificate.title} certificate`} />
            <span className="eyebrow">Certificate details</span>
            <h2 id="certificate-dialog-title">{activeCertificate.title}</h2>
            <p>{activeCertificate.description}</p>
          </section>
        </div>
      )}
    </section>
  )
}

const equipmentItems = [
  {
    category: 'Display', title: 'Monitor', image: '/IMAGES/monitor.jpg', summary: 'An external display for workspace tasks.', note: 'Exact model details can be added later.', purpose: 'Coding and study',
  },
  {
    category: 'Input', title: 'Keyboard', image: '/IMAGES/keyboard.jpg', summary: 'A keyboard for everyday computer work.', note: 'Exact model details can be added later.', purpose: 'Typing and development',
  },
  {
    category: 'Input', title: 'Mouse', image: '/IMAGES/mouse.jpg', summary: 'A mouse for navigation and precise interaction.', note: 'Exact model details can be added later.', purpose: 'Everyday computer navigation',
  },
  {
    category: 'Workspace', title: 'Desk chair', image: '/IMAGES/chair.jpg', summary: 'Seating for study and project sessions.', note: 'Exact model details can be added later.', purpose: 'Study and project work',
  },
  { category: 'Workspace', title: 'Table', image: '/IMAGES/table.jpg', summary: 'A surface for my computer and work materials.', note: 'Exact model details can be added later.', purpose: 'Organizing the workspace' },
  { category: 'Workspace', title: 'Monitor desk mount', image: '/IMAGES/Desk%20Mount%20Bracket%20Computer%20Monitor.jpg', summary: 'A mount for positioning a monitor.', note: 'Exact model details can be added later.', purpose: 'Workspace arrangement' },
  { category: 'Audio', title: 'Speaker', image: '/IMAGES/speaker.jpg', summary: 'Audio equipment for the workspace.', note: 'Exact model details can be added later.', purpose: 'Audio playback' },
  { category: 'Camera', title: 'Web camera', image: '/IMAGES/camera.jpg', summary: 'A camera for online sessions and calls.', note: 'Exact model details can be added later.', purpose: 'Video calls and online sessions' },
]

function Equipment() {
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    if (!activeItem) return undefined
    function closeOnEscape(event) {
      if (event.key === 'Escape') setActiveItem(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activeItem])

  return (
    <section className="section section--equipment" id="equipment" aria-labelledby="equipment-title" data-reveal>
      <div className="page-grid">
        <SectionHeading
          eyebrow="My equipment"
          number="05"
          title="The setup behind the work."
          intro="A personal tech profile—not a spec sheet. Exact equipment details will be added as the setup evolves."
          titleId="equipment-title"
          level="h1"
        />
        <div className="equipment-grid">
          {equipmentItems.map((item, index) => (
            <article className="equipment-card" key={item.title}>
              <span className="equipment-card__index">0{index + 1}</span>
              <button className="equipment-card__image-button" onClick={() => setActiveItem(item)} type="button" aria-label={`View ${item.title} image and details`}>
                <img className="equipment-card__image" src={item.image} alt={item.title} loading="lazy" />
              </button>
              <span className="eyebrow">{item.category}</span>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <button className="text-link" onClick={() => setActiveItem(item)} type="button">
                View details <Icon name="arrowUpRight" size={17} />
              </button>
            </article>
          ))}
        </div>
      </div>
      {activeItem && (
        <div className="equipment-dialog-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget) setActiveItem(null)
        }}>
          <section className="equipment-dialog" role="dialog" aria-modal="true" aria-labelledby="equipment-dialog-title">
            <div className="equipment-dialog__topline">
              <span className="eyebrow">Detail view</span>
              <button aria-label="Close dialog" className="dialog-close" onClick={() => setActiveItem(null)} type="button">×</button>
            </div>
            <span className="eyebrow">{activeItem.category}</span>
            <h2 id="equipment-dialog-title">{activeItem.title}</h2>
            <img className="equipment-dialog__image" src={activeItem.image} alt={activeItem.title} />
            <p>{activeItem.summary} {activeItem.note}</p>
            <span className="eyebrow">Purpose</span>
            <strong>{activeItem.purpose}</strong>
          </section>
        </div>
      )}
    </section>
  )
}

const journeyChapters = [
  { title: 'Learning', detail: 'Strengthening core programming, frontend, and database concepts.' },
  { title: 'Projects', detail: 'Applying new skills through coursework, experiments, and personal projects.' },
  { title: 'Current development', detail: 'Exploring full-stack development through practical work and iteration.' },
  { title: 'Future goal', detail: 'Grow into a well-rounded developer who builds accessible, useful digital experiences.' },
]

function Journey() {
  const [activeChapter, setActiveChapter] = useState(0)

  return (
    <section className="section section--journey" id="journey" aria-labelledby="journey-title" data-reveal>
      <div className="page-grid journey-layout">
        <div>
          <SectionHeading
            eyebrow="Learning journey"
            number="07"
            title="Always a work in progress."
            intro="The path isn’t linear. Every new concept adds another piece to how I think, design, and build."
            titleId="journey-title"
            level="h1"
          />
          <div className="journey-year">
            <span className="eyebrow">Year</span>
            <strong>2026</strong>
            <span>Current chapter</span>
          </div>
        </div>
        <div className="journey-chapters" aria-label="Learning journey chapters">
          {journeyChapters.map((chapter, index) => {
            const isActive = activeChapter === index
            return (
              <button
                aria-expanded={isActive}
                className={`journey-chapter ${isActive ? 'is-active' : ''}`}
                key={chapter.title}
                onClick={() => setActiveChapter(isActive ? -1 : index)}
                type="button"
              >
                <span className="journey-chapter__index">0{index + 1}</span>
                <span className="journey-chapter__content">
                  <strong>{chapter.title}</strong>
                  {isActive && <span>{chapter.detail}</span>}
                </span>
                <span className="journey-chapter__toggle" aria-hidden="true">{isActive ? '−' : '+'}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const [sendState, setSendState] = useState('idle')

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(socialLinks.email.value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2300)
    } catch {
      window.location.href = socialLinks.email.href
    }
  }

  async function prepareEmail(event) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    setSendState('sending')

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${socialLinks.email.value}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: fields.get('name'),
          email: fields.get('email'),
          message: fields.get('message'),
          _replyto: fields.get('email'),
          _subject: `Portfolio message from ${fields.get('name')}`,
          _template: 'table',
        }),
      })
      const result = await response.json()
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error('Message could not be sent.')
      }

      form.reset()
      setSendState('sent')
    } catch {
      setSendState('error')
    }
  }

  const secondaryLinks = [socialLinks.facebook, socialLinks.instagram, socialLinks.tiktok]

  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-title" data-reveal>
      <div className="page-grid contact-layout">
        <div className="contact-copy">
          <div className="eyebrow-row">
            <span className="section-number">08</span>
            <span className="eyebrow">Contact</span>
          </div>
          <h1 id="contact-title">Let&apos;s make something click.</h1>
          <p>
            Have an idea, a learning opportunity, or simply want to say hello? My inbox is open.
          </p>
          <a className="contact-email" href={socialLinks.email.href}>
            <span>{socialLinks.email.value}</span>
            <Icon name="arrowUpRight" size={25} />
          </a>
          <button className="copy-button" onClick={copyEmail} type="button">
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            {copied ? 'Email copied' : 'Copy email address'}
          </button>
          <form className="contact-form" onSubmit={prepareEmail}>
            <label>
              <span>Your name</span>
              <input autoComplete="name" name="name" placeholder="Your name" required />
            </label>
            <label>
              <span>Email address</span>
              <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
            </label>
            <label>
              <span>Your message</span>
              <textarea name="message" placeholder="Write your message" required rows="5" />
            </label>
            <button className="button button--primary" disabled={sendState === 'sending'} type="submit">
              {sendState === 'sending' ? 'Sending…' : sendState === 'sent' ? 'Message sent' : 'Send message'}
              {sendState !== 'sending' && <Icon name={sendState === 'sent' ? 'check' : 'arrowUpRight'} size={17} />}
            </button>
            <p aria-live="polite" className="contact-form__note">
              {sendState === 'sent'
                ? 'Thanks! Your message was sent. You can reply directly from the email in your inbox.'
                : sendState === 'error'
                  ? 'Could not send your message. Please try again or email me directly.'
                  : 'Your message will be sent to my inbox. I can reply directly to your email.'}
            </p>
          </form>
        </div>
        <div className="contact-directory">
          <div className="directory-heading">
            <span className="eyebrow">Find me online</span>
            <span>Selected links</span>
          </div>
          <div className="primary-socials">
            {[socialLinks.github, socialLinks.linkedin].map((social) => (
              social.href ? (
                <a className="social-row" href={social.href} key={social.label} {...externalLinkProps}>
                  <span className="social-row__icon"><Icon name={social.icon} size={20} /></span>
                  <span><strong>{social.label}</strong><small>{social.value}</small></span>
                  <Icon name="arrowUpRight" size={18} />
                </a>
              ) : (
                <div className="social-row social-row--pending" key={social.label}>
                  <span className="social-row__icon"><Icon name={social.icon} size={20} /></span>
                  <span><strong>{social.label}</strong><small>{social.note}</small></span>
                  <span className="pending-label">Coming soon</span>
                </div>
              )
            ))}
          </div>
          <div className="secondary-socials">
            {secondaryLinks.map((social) => (
              <a href={social.href} key={social.label} {...externalLinkProps} aria-label={`${social.label}: ${social.value} (opens in a new tab)`}>
                <Icon name={social.icon} size={18} />
                <span>{social.label}</span>
                <Icon name="arrowUpRight" size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function navigateAdmin(path, replace = false) {
  window.history[replace ? 'replaceState' : 'pushState']({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteFlow, setInviteFlow] = useState(() => new URLSearchParams(window.location.search).get('invite') === '1')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    if (inviteFlow) {
      getCurrentUser().then((user) => {
        if (!user) setError('This invitation link is invalid or has expired. Request a new invite.')
      }).catch((authError) => setError(authError.message))
      return
    }
    getCurrentUser().then(async (user) => {
      if (user && await isPortfolioAdmin()) navigateAdmin('/admin/dashboard', true)
    }).catch(() => {})
  }, [inviteFlow])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (inviteFlow) {
        if (password.length < 8) throw new Error('Use a password with at least 8 characters.')
        if (password !== confirmPassword) throw new Error('The passwords do not match.')
        if (!await isPortfolioAdmin()) throw new Error('This account is not authorized to manage this portfolio.')
        await updateCurrentUserPassword(password)
        setInviteFlow(false)
        navigateAdmin('/admin/dashboard', true)
        return
      }
      await signInWithPassword(email, password)
      if (!await isPortfolioAdmin()) {
        await signOut()
        throw new Error('This account is not authorized to manage this portfolio.')
      }
      navigateAdmin('/admin/dashboard', true)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <a className="brand" href="/#/home">JEDRICK<span className="brand-dot">.</span></a>
        <span className="eyebrow">{inviteFlow ? 'Admin invitation' : 'Private area'}</span>
        <h1>{inviteFlow ? 'Set your password' : 'Admin sign in'}</h1>
        <p>{inviteFlow ? 'Choose a password to finish setting up your administrator account.' : 'Sign in using the administrator account authorized for this portfolio.'}</p>
        {!isSupabaseConfigured && <p className="admin-auth-error" role="alert">Add the Supabase project URL and anon key to <code>.env.local</code> before signing in.</p>}
        <form className="admin-form admin-auth-form" onSubmit={submit}>
          {!inviteFlow && <label><span>Email</span><input autoComplete="username" name="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /> </label>}
          <label><span>{inviteFlow ? 'New password' : 'Password'}</span><input autoComplete={inviteFlow ? 'new-password' : 'current-password'} minLength={inviteFlow ? 8 : undefined} name="password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          {inviteFlow && <label><span>Confirm password</span><input autoComplete="new-password" minLength={8} name="confirm-password" onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} /></label>}
          {error && <p className="admin-auth-error" role="alert">{error}</p>}
          <button className="button button--primary" disabled={busy || !isSupabaseConfigured} type="submit">{busy ? (inviteFlow ? 'Saving…' : 'Signing in…') : (inviteFlow ? 'Set password' : 'Sign in')} <Icon name="arrowUpRight" size={17} /></button>
        </form>
        <a className="text-link" href="/#/home">Return to portfolio</a>
      </section>
    </main>
  )
}

function AdminGate() {
  const [access, setAccess] = useState({ status: 'checking', user: null, error: '' })

  useEffect(() => {
    let active = true
    async function verify() {
      try {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Set up .env.local first.')
        const user = await getCurrentUser()
        if (!user) {
          navigateAdmin('/admin/login', true)
          return
        }
        if (!await isPortfolioAdmin()) {
          await signOut()
          setAccess({ status: 'denied', user: null, error: 'This account is not authorized for the admin dashboard.' })
          return
        }
        if (active) setAccess({ status: 'allowed', user, error: '' })
      } catch (error) {
        if (active) setAccess({ status: 'error', user: null, error: error.message })
      }
    }
    verify()
    return () => { active = false }
  }, [])

  if (access.status === 'checking') return <main className="admin-auth-shell"><p role="status">Checking administrator access…</p></main>
  if (access.status !== 'allowed') {
    return <main className="admin-auth-shell"><section className="admin-auth-card"><span className="eyebrow">Access denied</span><h1>Admin access unavailable</h1><p className="admin-auth-error" role="alert">{access.error}</p><a className="text-link" href="/admin/login">Return to sign in</a></section></main>
  }
  return <AdminDashboard user={access.user} />
}

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('projects')
  const [projectsList, setProjectsList] = useState([])
  const [certificatesList, setCertificatesList] = useState([])
  const [editingProject, setEditingProject] = useState(null)
  const [editingCertificate, setEditingCertificate] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function refresh() {
    const [nextProjects, nextCertificates] = await Promise.all([fetchProjects({ admin: true }), fetchCertificates({ admin: true })])
    setProjectsList(nextProjects)
    setCertificatesList(nextCertificates)
  }

  useEffect(() => {
    refresh().catch((loadError) => setError(loadError.message))
  }, [])

  async function submitProject(event) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const file = fields.get('image')
    if (file?.size > 5 * 1024 * 1024) return setError('Image must be 5 MB or smaller.')
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await storeProject({
        id: editingProject?.id,
        title: String(fields.get('title')).trim(),
        description: String(fields.get('description')).trim(),
        category: String(fields.get('category')).trim(),
        role: String(fields.get('role')).trim(),
        technologies: String(fields.get('technologies')).split(',').map((item) => item.trim()).filter(Boolean),
        githubUrl: String(fields.get('githubUrl')).trim(),
        liveUrl: String(fields.get('liveUrl')).trim(),
        status: String(fields.get('status')).trim(),
        displayOrder: fields.get('displayOrder'),
        isPublished: fields.get('isPublished') === 'on',
      }, file?.size ? file : null, editingProject?.imagePath)
      await refresh()
      form.reset()
      setEditingProject(null)
      setNotice('Project saved to Supabase.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setBusy(false)
    }
  }

  async function submitCertificate(event) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const file = fields.get('image')
    if (!editingCertificate && !file?.size) return setError('Choose a certificate image.')
    if (file?.size > 5 * 1024 * 1024) return setError('Image must be 5 MB or smaller.')
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await storeCertificate({
        id: editingCertificate?.id,
        title: String(fields.get('title')).trim(),
        description: String(fields.get('description')).trim(),
        issuer: String(fields.get('issuer')).trim(),
        earnedAt: String(fields.get('earnedAt')).trim(),
        verificationUrl: String(fields.get('verificationUrl')).trim(),
        displayOrder: fields.get('displayOrder'),
        isPublished: fields.get('isPublished') === 'on',
      }, file?.size ? file : null, editingCertificate?.imagePath)
      await refresh()
      form.reset()
      setEditingCertificate(null)
      setNotice('Certificate saved to Supabase.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setBusy(false)
    }
  }

  async function removeItem(table, item) {
    if (!window.confirm(`Delete “${item.title}” permanently?`)) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await removeContent(table, item)
      await refresh()
      if (editingProject?.id === item.id) setEditingProject(null)
      if (editingCertificate?.id === item.id) setEditingCertificate(null)
      setNotice('Item deleted.')
    } catch (removeError) {
      setError(removeError.message)
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    await signOut()
    navigateAdmin('/admin/login', true)
  }

  return (
    <main className="section section--admin">
      <div className="page-grid">
        <div className="admin-dashboard-top">
          <div className="admin-heading">
            <div className="eyebrow-row"><span className="section-number">A</span><span className="eyebrow">Private portfolio CMS</span></div>
            <h1>Admin panel</h1>
            <p>Signed in as {user.email}. Changes save to Supabase and appear publicly when published.</p>
          </div>
          <button className="text-link admin-logout" onClick={logout} type="button">Sign out</button>
        </div>
        <div className="admin-tabs" role="tablist" aria-label="Content type">
          <button aria-selected={activeTab === 'projects'} onClick={() => setActiveTab('projects')} role="tab" type="button">Projects ({projectsList.length})</button>
          <button aria-selected={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')} role="tab" type="button">Certificates ({certificatesList.length})</button>
        </div>
        {activeTab === 'projects' ? (
          <>
            <form className="admin-form" key={editingProject?.id || 'new-project'} onSubmit={submitProject}>
              <h2>{editingProject ? 'Edit project' : 'Add project'}</h2>
              <label><span>Project title</span><input defaultValue={editingProject?.title || ''} name="title" required /></label>
              <label><span>Category</span><input defaultValue={editingProject?.category || ''} name="category" placeholder="Web development" /></label>
              <label><span>Role</span><input defaultValue={editingProject?.role || ''} name="role" placeholder="Individual developer" /></label>
              <label><span>Status</span><input defaultValue={editingProject?.status || 'Published'} name="status" /></label>
              <label><span>Description</span><textarea defaultValue={editingProject?.description || ''} name="description" required rows="4" /></label>
              <label><span>Technologies (comma separated)</span><input defaultValue={editingProject?.technologies.join(', ') || ''} name="technologies" placeholder="React, CSS, JavaScript" /></label>
              <label><span>Repository link</span><input defaultValue={editingProject?.githubUrl || ''} name="githubUrl" type="url" placeholder="https://github.com/..." /></label>
              <label><span>Live link</span><input defaultValue={editingProject?.liveUrl || ''} name="liveUrl" type="url" placeholder="https://..." /></label>
              <label><span>Image {editingProject ? '(leave blank to keep current)' : ''}</span><input accept="image/jpeg,image/png,image/webp" name="image" required={!editingProject} type="file" /></label>
              <label><span>Display order</span><input defaultValue={editingProject?.displayOrder ?? projectsList.length + 1} min="0" name="displayOrder" type="number" /></label>
              <label className="admin-checkbox"><input defaultChecked={editingProject?.isPublished ?? true} name="isPublished" type="checkbox" /><span>Published on public portfolio</span></label>
              <div className="admin-form-actions"><button className="button button--primary" disabled={busy} type="submit">{busy ? 'Saving…' : editingProject ? 'Save project' : 'Add project'}</button>{editingProject && <button className="button button--ghost" onClick={() => setEditingProject(null)} type="button">Cancel edit</button>}</div>
            </form>
            <div className="admin-saved-list"><h2>Projects</h2>
              {projectsList.map((item) => <div className="admin-saved-item" key={item.id}><span>{item.isPublished ? 'Published' : 'Draft'}</span><strong>{item.title}</strong><button className="text-link" onClick={() => { setEditingProject(item); setError(''); window.scrollTo(0, 0) }} type="button">Edit</button><button className="text-link" disabled={busy} onClick={() => removeItem(ADMIN_PROJECTS_KEY, item)} type="button">Delete</button></div>)}
              {!projectsList.length && <p>No projects in Supabase yet. Run the SQL seed section first.</p>}
            </div>
          </>
        ) : (
          <>
            <form className="admin-form" key={editingCertificate?.id || 'new-certificate'} onSubmit={submitCertificate}>
              <h2>{editingCertificate ? 'Edit certificate' : 'Add certificate'}</h2>
              <label><span>Certificate / achievement title</span><input defaultValue={editingCertificate?.title || ''} name="title" required /></label>
              <label><span>Issuing organization</span><input defaultValue={editingCertificate?.issuer || ''} name="issuer" /></label>
              <label><span>Date earned</span><input defaultValue={editingCertificate?.earnedAt || ''} name="earnedAt" type="date" /></label>
              <label><span>Verification link</span><input defaultValue={editingCertificate?.verificationUrl || ''} name="verificationUrl" type="url" placeholder="https://..." /></label>
              <label><span>Description</span><textarea defaultValue={editingCertificate?.description || ''} name="description" required rows="4" /></label>
              <label><span>Certificate image {editingCertificate ? '(leave blank to keep current)' : ''}</span><input accept="image/jpeg,image/png,image/webp" name="image" required={!editingCertificate} type="file" /></label>
              <label><span>Display order</span><input defaultValue={editingCertificate?.displayOrder ?? certificatesList.length + 1} min="0" name="displayOrder" type="number" /></label>
              <label className="admin-checkbox"><input defaultChecked={editingCertificate?.isPublished ?? true} name="isPublished" type="checkbox" /><span>Published on public portfolio</span></label>
              <div className="admin-form-actions"><button className="button button--primary" disabled={busy} type="submit">{busy ? 'Saving…' : editingCertificate ? 'Save certificate' : 'Add certificate'}</button>{editingCertificate && <button className="button button--ghost" onClick={() => setEditingCertificate(null)} type="button">Cancel edit</button>}</div>
            </form>
            <div className="admin-saved-list"><h2>Certificates</h2>
              {certificatesList.map((item) => <div className="admin-saved-item" key={item.id}><span>{item.isPublished ? 'Published' : 'Draft'}</span><strong>{item.title}</strong><button className="text-link" onClick={() => { setEditingCertificate(item); setError(''); window.scrollTo(0, 0) }} type="button">Edit</button><button className="text-link" disabled={busy} onClick={() => removeItem(ADMIN_CERTIFICATES_KEY, item)} type="button">Delete</button></div>)}
              {!certificatesList.length && <p>No certificates yet.</p>}
            </div>
          </>
        )}
        {error && <p className="admin-auth-error" role="alert">{error}</p>}
        {notice && <p className="admin-feedback" role="status">{notice}</p>}
      </div>
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-grid footer-grid">
        <p>© 2026 Jedrick Relshey Miclat. All Rights Reserved.</p>
        <div className="footer-links">
          <a href={socialLinks.github.href} {...externalLinkProps}>GitHub</a>
          <a href="#/home">Home <Icon name="arrowUpRight" size={14} /></a>
        </div>
      </div>
    </footer>
  )
}

const pageComponents = {
  home: Hero,
  about: About,
  projects: Projects,
  skills: Skills,
  equipment: Equipment,
  achievements: Achievements,
  journey: Journey,
  contact: Contact,
}

function getPageFromHash() {
  const route = window.location.hash.match(/^#\/([a-z-]+)/i)?.[1]?.toLowerCase()
  return route && pageComponents[route] ? route : 'home'
}

export default function App() {
  const [activePage, setActivePage] = useState(getPageFromHash)
  const [pathname, setPathname] = useState(window.location.pathname)
  const routePath = pathname.replace(/\/+$/, '') || '/'

  useEffect(() => {
    function syncPage() {
      setActivePage(getPageFromHash())
      setPathname(window.location.pathname)
    }
    window.addEventListener('hashchange', syncPage)
    window.addEventListener('popstate', syncPage)
    return () => {
      window.removeEventListener('hashchange', syncPage)
      window.removeEventListener('popstate', syncPage)
    }
  }, [])

  useEffect(() => {
    if (consumeAuthRedirect()) navigateAdmin('/admin/login?invite=1', true)
  }, [])

  useEffect(() => {
    if (routePath.startsWith('/admin')) {
      document.title = routePath === '/admin/dashboard' ? 'Admin Dashboard | Jedrick Miclat' : 'Admin Sign In | Jedrick Miclat'
      return
    }
    window.scrollTo(0, 0)
    const pageLabel = navigationItems.find((item) => item.href === `#/${activePage}`)?.label ?? 'Home'
    document.title = `${pageLabel} | Jedrick Miclat`
  }, [activePage, routePath])

  useEffect(() => {
    if (routePath.startsWith('/admin')) return undefined
    const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    revealTargets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [activePage, routePath])

  if (routePath.startsWith('/admin')) {
    return routePath === '/admin/dashboard' ? <AdminGate /> : <AdminLogin />
  }

  const Page = pageComponents[activePage] ?? Hero

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar activePage={activePage} />
      <main id="main-content">
        <Page key={activePage} />
      </main>
      <Footer />
    </>
  )
}
