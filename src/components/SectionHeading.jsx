export function SectionHeading({ eyebrow, number, title, intro, align = 'left', titleId, level = 'h2' }) {
  const Heading = level

  return (
    <div className={`section-heading section-heading--${align}`}>
      <div className="eyebrow-row">
        <span className="section-number">{number}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <Heading className="section-heading__title" id={titleId}>{title}</Heading>
      {intro && <p>{intro}</p>}
    </div>
  )
}
