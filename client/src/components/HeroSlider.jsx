import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/hero.css';

const DELAY = 5000; // 5 seconds per slide
const isExternal = (url) => /^https?:\/\//.test(url);

// Shows admin-managed slides. With no slides, shows whatever is inside <HeroSlider>...</HeroSlider>.
const HeroSlider = ({ children }) => {
  const [slides, setSlides] = useState(null); // null while loading
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    api.get('/hero')
      .then(({ data }) => setSlides(data))
      .catch(() => setSlides([])); // on error, fall back to the standard hero
  }, []);

  const count = slides?.length || 0;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Auto-play. Restarts after every change, so a click always gets a full 5 seconds.
  useEffect(() => {
    if (count < 2 || paused || reduceMotion) return undefined;
    const timer = setTimeout(next, DELAY);
    return () => clearTimeout(timer);
  }, [count, paused, reduceMotion, next, index]);

  if (slides === null) return <section className="hero-slider" aria-hidden="true" />;
  if (count === 0) return children;

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const distance = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 50) (distance < 0 ? next : prev)(); // swipe left = next
    touchStartX.current = null;
  };

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide._id}
            className={`hero-slide ${active ? 'is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
          >
            <img src={slide.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="wrap hero-slide-content">
              {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
              <h2>{slide.headline}</h2>
              {slide.text && <p className="hero-slide-text">{slide.text}</p>}
              {isExternal(slide.buttonLink) ? (
                <a className="btn solid" href={slide.buttonLink} target="_blank" rel="noreferrer"
                  tabIndex={active ? 0 : -1}>
                  {slide.buttonText}
                </a>
              ) : (
                <Link className="btn solid" to={slide.buttonLink} tabIndex={active ? 0 : -1}>
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button className="hero-arrow prev" onClick={prev} aria-label="Previous slide">‹</button>
          <button className="hero-arrow next" onClick={next} aria-label="Next slide">›</button>
          <div className="hero-dots">
            {slides.map((slide, i) => (
              <button
                key={slide._id}
                className={i === index ? 'active' : ''}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;