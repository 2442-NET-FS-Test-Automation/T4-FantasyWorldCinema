import { Link } from 'react-router-dom';

export const AnimatedText = ({ to, children }: { to: string; children: string }) => {
  const letters = children.split('');

  return (
    <Link to={to} className="relative group inline-block cursor-pointer">
      
      <span className="flex font-primary oklch(55.1% 0.027 264.364)">
        {letters.map((char, i) => (
          <span
            key={`base-${i}`}
            className="transition-opacity duration-300 ease-in-out group-hover:opacity-0"
            style={{ transitionDelay: `${i * 35}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>

      <span className="absolute top-0 left-0 flex font-secondary oklch(55.1% 0.027 264.364) drop-shadow-oklch(27.5% 0.011 216.9)">
        {letters.map((char, i) => (
          <span
            key={`hover-${i}`}
            className="opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
            style={{ transitionDelay: `${i * 35}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      
    </Link>
  );
};