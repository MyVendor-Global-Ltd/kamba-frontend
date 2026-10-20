import { BrandMark } from './BrandMark.jsx';

export function Loader({ visible }) {
  return (
    <div className={`site-loader${visible ? ' is-visible' : ' is-leaving'}`} aria-hidden="true">
      <div className="loader-content">
        <div className="loader-mark-wrap">
          <BrandMark size="large" />
          <svg className="loader-draw" viewBox="0 0 44 44" aria-hidden="true">
            <path d="M14 12v20m15-20L15 21l15 11" />
            <path d="M28.5 9.5c4.4 0 7.8 3.2 7.8 7.2 0 5.8-7.8 12.8-7.8 12.8s-7.8-7-7.8-12.8c0-4 3.4-7.2 7.8-7.2Z" />
          </svg>
        </div>
        <span className="loader-word">KAMBA <span>·</span> NIGERIA</span>
        <div className="loader-track"><span /></div>
        <span className="loader-caption">A closer way to shop local</span>
      </div>
    </div>
  );
}
