export function SectionHeading({ eyebrow, number, title, intro, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div className="eyebrow-row">
        <span className="section-number">{number}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  )
}
