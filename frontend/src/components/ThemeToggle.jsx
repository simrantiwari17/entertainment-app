import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldLight = savedTheme === 'light';
    setIsLight(shouldLight);
    document.documentElement.classList.toggle('light-theme', shouldLight);
  }, []);

  const handleToggle = () => {
    const next = !isLight;
    setIsLight(next);
    localStorage.setItem('theme', next ? 'light' : 'dark');
    document.documentElement.classList.toggle('light-theme', next);
  };

  return (
    <button
      onClick={handleToggle}
      className="bg-dark border border-dark-lighter text-white px-3 py-2 rounded transition hover:bg-dark-lighter"
      title="Toggle theme"
      type="button"
    >
      {isLight ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeToggle;
