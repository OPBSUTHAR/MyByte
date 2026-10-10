// SplitType-style text splitter — produces the same word > char span output
// as SplitType (inline-block words with overflow-hidden masks, per-char spans)
// without the extra dependency. Used by the hero headline reveal.
// Memoized: headline words never change, so never re-split on parent renders
// (e.g. the hero typewriter ticking every ~90ms).
import { memo } from 'react';

export default memo(function SplitChars({ text, className = '', wordClass = 'ht-word', charClass = 'ht-char' }) {
  const words = text.split(' ');
  return (
    <span className={className} role="text" aria-label={text}>
      {words.map((w, i) => (
        <span className={wordClass} key={i}>
          {w.split('').map((c, j) => (
            <span className={charClass} key={j}>{c}</span>
          ))}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
});
