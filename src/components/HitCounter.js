import { useState, useEffect } from 'react';
import RetroHitCounter from 'react-retro-hit-counter';

export function HitCounter({ slug }) {
  const [hits, setHits] = useState(undefined);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    fetch(`/api/register-hit?slug=${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (typeof json.hits === 'number') {
          setHits(json.hits);
        }
      });
  }, [slug]);

  if (typeof hits === 'undefined') {
    return null;
  }

  return <RetroHitCounter hits={hits} />;
}
