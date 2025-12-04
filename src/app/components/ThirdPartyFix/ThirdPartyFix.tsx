'use client';

import { useEffect } from 'react';

export default function ThirdPartyFix() {
  useEffect(() => {
    const enable = () => { };
    const options = { once: true, passive: true };

    document.body.addEventListener('click', enable, options);
    document.body.addEventListener('touchstart', enable, options);
    document.body.addEventListener('keydown', enable, options);
    document.body.addEventListener('scroll', enable, options); // бонус: скролл тоже считается взаимодействием
  }, []);

  // Ничего не рендерит — просто фикс
  return null;
}