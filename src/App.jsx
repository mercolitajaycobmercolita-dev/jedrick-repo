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

const externalLinkProps = {
  target: '_blank',
  rel: 'noreferrer',
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main section[id]'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry) setActiveSection(visibleEntry.target.id)
      },
      { rootMargin: '-22% 0px -58% 0px', threshold: [0.05, 0.2, 0.45] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

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
      <a className="brand" href="#home" aria-label="Jedrick Miclat — return home" onClick={closeMenu}>
        JEDRICK<span className="brand-dot">.</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <a
            className={activeSection === item.href.slice(1) ? 'is-active' : ''}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a className="nav-contact-link" href="#contact">
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
            Available to learn, build &amp; collaborate
          </div>
          <p className="hero-overline">Aspiring Full-Stack Developer · DCT / BSIT</p>
          <h1 id="hero-title">
            Jedrick
            <span>Relshey Miclat</span>
          </h1>
          <p className="hero-tagline">Building ideas into purposeful digital experiences.</p>
          <p className="hero-intro">
            I&apos;m a BSIT student at Dominican College of Tarlac with a growing passion for web
            development and software development. I enjoy turning ideas into functional digital
            experiences while learning through hands-on work.
          </p>
          <div className="hero-actions">
            <a className="button button--primary" href="#projects">
              View my projects <Icon name="arrow" size={19} />
            </a>
            <a className="button button--ghost" href="#contact">
              Let&apos;s connect <Icon name="arrowUpRight" size={18} />
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
            <span>DEVELOPER PROFILE</span>
            <span>01 / 01</span>
          </div>
          <div className="identity-grid" aria-hidden="true" />
          <div className="monogram" aria-label="Jedrick Miclat initials">JM</div>
          <div className="identity-corner identity-corner--top" aria-hidden="true" />
          <div className="identity-corner identity-corner--bottom" aria-hidden="true" />
          <div className="identity-bottomline">
            <div>
              <span className="eyebrow">Portrait slot</span>
              <p>Ready for a photo, built to stand on its own.</p>
            </div>
            <Icon name="sparkle" size={28} />
          </div>
          <div className="current-note">
            <span className="current-note__label"><span className="pulse-dot" aria-hidden="true" /> Currently exploring</span>
            <strong>Pickleball Website</strong>
            <span>Planning stage</span>
          </div>
        </div>
      </div>
      <a className="hero-scroll-cue" href="#about" aria-label="Scroll to the about section">
        <span>Scroll to explore</span>
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
          number="01"
          title="Learning in public. Building with intention."
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
          <a className="text-link" href="#contact">
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
          number="02"
          title="Technologies I&apos;m learning by making."
          intro="These are tools I&apos;m actively practicing and building with—not a claim of mastery."
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
      <div className={`project-visual project-visual--${index + 1}`} aria-hidden="true">
        <div className="project-visual__grid" />
        <span className="project-visual__number">0{index + 1}</span>
        <span className="project-visual__mark">{isUpcoming ? 'NEXT' : 'WORK'}</span>
        <Icon name={isUpcoming ? 'sparkle' : 'code'} size={50} strokeWidth={1.15} />
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
  return (
    <section className="section section--projects" id="projects" aria-labelledby="projects-title" data-reveal>
      <div className="page-grid">
        <div className="projects-heading-row">
          <SectionHeading
            eyebrow="Selected work index"
            number="03"
            title="A record of what I&apos;m building."
            intro="Real work, shared honestly—from completed experiments to the next idea taking shape."
          />
          <a className="project-index-link" href={socialLinks.github.href} {...externalLinkProps}>
            <Icon name="github" size={18} /> Explore GitHub <Icon name="arrowUpRight" size={16} />
          </a>
        </div>
        <div className="project-list">
          {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}
        </div>
        <div className="project-footnote">
          <Icon name="code" size={19} />
          <p>
            This work index grows as projects are documented. Each entry will link to its own
            source code or live experience when it is ready to share.
          </p>
        </div>
      </div>
    </section>
  )
}

function Achievements() {
  return (
    <section className="section section--achievements" id="achievements" aria-labelledby="achievements-title" data-reveal>
      <div className="page-grid achievement-layout">
        <SectionHeading
          eyebrow="Credential archive"
          number="04"
          title="Recognition belongs to the work."
          intro="Verified certificates and achievements will live here when they are ready to be shared."
        />
        <div className="empty-credentials" role="status">
          <div className="credential-seal" aria-hidden="true"><Icon name="check" size={32} /></div>
          <div>
            <span className="eyebrow">Archive preparing</span>
            <h3>Future certifications will be verified before publication.</h3>
            <p>
              No credentials are listed yet. This space is intentionally reserved for authentic
              certificates, issuing organizations, dates, and verification links.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(socialLinks.email.value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2300)
    } catch {
      window.location.href = socialLinks.email.href
    }
  }

  const secondaryLinks = [socialLinks.facebook, socialLinks.instagram, socialLinks.tiktok]

  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-title" data-reveal>
      <div className="page-grid contact-layout">
        <div className="contact-copy">
          <div className="eyebrow-row">
            <span className="section-number">05</span>
            <span className="eyebrow">Let&apos;s make something useful</span>
          </div>
          <h2 id="contact-title">Have an idea worth exploring?</h2>
          <p>
            I&apos;m always open to meaningful conversations, new learning opportunities, and projects
            that challenge me to grow.
          </p>
          <a className="contact-email" href={socialLinks.email.href}>
            <span>{socialLinks.email.value}</span>
            <Icon name="arrowUpRight" size={25} />
          </a>
          <button className="copy-button" onClick={copyEmail} type="button">
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            {copied ? 'Email copied' : 'Copy email address'}
          </button>
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

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-grid footer-grid">
        <a className="brand" href="#home" aria-label="Back to top">
          JEDRICK<span className="brand-dot">.</span>
        </a>
        <p>© 2026 Jedrick Relshey Miclat. All Rights Reserved.</p>
        <div className="footer-links">
          <a href={socialLinks.github.href} {...externalLinkProps}>GitHub</a>
          <a href={socialLinks.email.href}>Email</a>
          <a href="#home">Back to top <Icon name="arrowUpRight" size={14} /></a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useEffect(() => {
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
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
