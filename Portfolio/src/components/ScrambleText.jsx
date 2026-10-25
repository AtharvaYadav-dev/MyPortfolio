import React, { useState, useEffect, useRef } from 'react';

const CIPHER_CHARS = '0123456789ABCDEF!<>-_\\/[]{}—=+*^?#_$%&';

export default function ScrambleText({
  text,
  className = '',
  speed = 35,
  triggerOnHover = true,
  autoStart = true,
  as: Component = 'span',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join('');
      });

      iteration += 1 / 2;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (!autoStart) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          startScramble();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [text, autoStart]);

  return (
    <Component
      ref={elementRef}
      className={`inline-block font-mono select-none ${className}`}
      onMouseEnter={triggerOnHover ? startScramble : undefined}
      {...props}
    >
      {displayText}
    </Component>
  );
}
