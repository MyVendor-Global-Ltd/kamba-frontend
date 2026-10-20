export function SectionHeading({ eyebrow, title, copy, id, action }) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="section-title">{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
      {action && <div className="section-heading-action">{action}</div>}
    </div>
  );
}
