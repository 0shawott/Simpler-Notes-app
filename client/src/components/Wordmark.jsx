import './Wordmark.css';

// The one deliberate flourish in the whole app — a hand-drawn-style ink
// stroke under the wordmark. Everything else in the UI stays quiet.
function Wordmark({ size = 'md' }) {
  return (
    <div className={`wordmark wordmark--${size}`}>
      <span className="wordmark__text">hi there</span>
      <svg
        className="wordmark__stroke"
        viewBox="0 0 120 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 6.5C20 3, 40 8.5, 60 5.5S100 2, 118 6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default Wordmark;