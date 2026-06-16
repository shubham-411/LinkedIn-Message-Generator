import { useState } from 'react';
import './index.css';

/* ── helpers ── */
const STYLES = [
  { key: 'style-1', label: '🎓 Curious Learner',       badge: 'badge-1' },
  { key: 'style-2', label: '💼 Career Advice Seeker',  badge: 'badge-2' },
  { key: 'style-3', label: '🚀 Opportunity Explorer',  badge: 'badge-3' },
];

/**
 * Split the raw response into up to 3 individual messages.
 * Handles numbered lists like "1.", "2.", "3." or blank-line separation.
 */
function parseMessages(raw) {
  const numbered = raw.split(/\n\s*(?=\d\.\s)/);
  if (numbered.length >= 2) {
    return numbered
      .map(s => s.replace(/^\d\.\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 3);
  }
  return raw
    .split(/\n{2,}/)
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

/* ── Skeleton loader ── */
function SkeletonCards() {
  return (
    <div className="skeleton-cards">
      {[0, 1, 2].map(i => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-line h-badge" />
          <div className="skeleton-line w-full" />
          <div className="skeleton-line w-full" />
          <div className="skeleton-line w-4o5" />
          <div className="skeleton-line w-1o3" style={{ marginTop: 14 }} />
        </div>
      ))}
    </div>
  );
}

/* ── Single message card ── */
function MessageCard({ text, styleInfo, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const charCount = text.length;
  const isOver = charCount > 280;

  return (
    <div className={`message-card ${styleInfo.key}`} style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="message-card-header">
        <span className={`message-style-badge ${styleInfo.badge}`}>
          {styleInfo.label}
        </span>
      </div>

      <p className="message-text">{text}</p>

      <div className="message-card-footer">
        <span className={`char-info ${isOver ? 'over' : ''}`}>
          {isOver ? '⚠️' : '✅'} {charCount} / 280 chars
        </span>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          id={`copy-btn-${index}`}
          aria-label="Copy message to clipboard"
        >
          {copied ? '✓ Copied!' : '⧉ Copy'}
        </button>
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  const [form, setForm] = useState({
    targetName:     '',
    targetRole:     '',
    profileContext: '',
    studentGoal:    '',
  });

  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    form.targetName.trim() &&
    form.targetRole.trim() &&
    form.profileContext.trim() &&
    form.studentGoal.trim();

  /* ── original route unchanged ── */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');
    setMessages([]);

    try {
      const res = await fetch('https://linkedin-message-generator-fq4r.onrender.com/generate-message', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const parsed = parseMessages(data.message || '');

      if (parsed.length === 0) throw new Error('No messages returned. Please try again.');
      setMessages(parsed);
    } catch (err) {
      setError(
        err.message.includes('fetch')
          ? 'Could not connect to the server. Make sure the Spring Boot backend is running on port 8080.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">in</div>
          <span className="header-name">LinkedIn<span className="header-name-accent">AI</span></span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          AI-Powered Connection Requests
        </div>
        <h1>
          Craft the perfect<br />
          <span className="hero-highlight">LinkedIn connection</span>
        </h1>
        <p className="hero-sub">
          Stop sending generic requests. Generate personalised, professional
          outreach messages in seconds — tailored to every person you want to connect with.
        </p>
      </section>

      {/* ── Main ── */}
      <main className="main">
        <div className="card">

          {/* Form header */}
          <div className="section-label">
            <div>
              <h2 className="section-title">Message details</h2>
              <p className="section-sub">Fill in the context and let AI do the rest</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">

              {/* Target Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="targetName">
                  Target name <span className="required">*</span>
                </label>
                <input
                  id="targetName"
                  name="targetName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sundar Pichai"
                  value={form.targetName}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              {/* Target Role */}
              <div className="form-group">
                <label className="form-label" htmlFor="targetRole">
                  Their role <span className="required">*</span>
                </label>
                <input
                  id="targetRole"
                  name="targetRole"
                  type="text"
                  className="form-input"
                  placeholder="e.g. CEO of Google"
                  value={form.targetRole}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              {/* Profile Context */}
              <div className="form-group full">
                <label className="form-label" htmlFor="profileContext">
                  Profile context <span className="required">*</span>
                </label>
                <textarea
                  id="profileContext"
                  name="profileContext"
                  className="form-textarea"
                  placeholder="Paste key highlights from their LinkedIn profile — recent posts, projects, achievements, career path,etc that matter…"
                  value={form.profileContext}
                  onChange={handleChange}
                  required
                />
                <span className="char-count">{form.profileContext.length} characters</span>
              </div>

              {/* Student Goal */}
              <div className="form-group full">
                <label className="form-label" htmlFor="studentGoal">
                  Your goal <span className="required">*</span>
                </label>
                <textarea
                  id="studentGoal"
                  name="studentGoal"
                  className="form-textarea"
                  style={{ minHeight: 80 }}
                  placeholder="What do you want from this connection? e.g. mentorship, referral, career advice, interview insights…"
                  value={form.studentGoal}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="error-banner" role="alert">
                <span className="error-icon">⚠️</span>
                <p className="error-text">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="generate-btn"
              type="submit"
              className="btn-generate"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Generating messages…
                </>
              ) : (
                <>
                  <span className="btn-icon">✦</span>
                  Generate 3 message variations
                </>
              )}
            </button>
          </form>

        </div>

        {/* ── Results ── */}
        {(loading || messages.length > 0) && (
          <>
            <div className="divider">
              <div className="divider-line" />
              <span className="divider-label">Generated messages</span>
              <div className="divider-line" />
            </div>

            <div className="results-section">
              {loading ? (
                <SkeletonCards />
              ) : (
                <>
                  <div className="results-header">
                    <span className="results-title" style={{ fontFamily: 'Times New Roman' }}>Your personalised messages are ready.</span>
                    <span className="results-count">{messages.length} variations</span>
                  </div>

                  <div className="message-cards">
                    {messages.map((text, i) => (
                      <MessageCard
                        key={i}
                        index={i}
                        text={text}
                        styleInfo={STYLES[i] || STYLES[0]}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

    </div>
  );
}