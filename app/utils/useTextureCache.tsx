import { useState, useEffect, useRef } from 'react';
import { TextureLoader } from 'three';

const textureCache = new Map();

export function useTextureCache(url: string) {
  const [texture, setTexture] = useState(() => textureCache.get(url) || null);
  const loader = new TextureLoader();

  useEffect(() => {
    if (!url) return;

    if (textureCache.has(url)) {
      setTexture(textureCache.get(url));
      return;
    }

    loader.load(
      url,
      (loadedTexture) => {
        textureCache.set(url, loadedTexture);
        setTexture(loadedTexture);
      },
      undefined,
      (err) => console.error('Texture load error', err)
    );
  }, [url]);

  return texture;
}
