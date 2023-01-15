import { useState, useEffect } from 'react';
import RetroHitCounter from 'react-retro-hit-counter';

function HitCounter({ slug }) {
  const [hits, setHits] = useState(undefined);

  useEffect(() => {
    if (process.env.NODE !== 'production') {
      return;
    }

    fetch(`/api/register-hit?slug=${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (typeof json.hits === 'numbers') {
          setHits(json.hits);
        }
      });
  }, [slug]);

  if (typeof hits === 'undefined') {
    return null;
  }

  return <RetroHitCounter hits={hits} />;
}

export default HitCounter;