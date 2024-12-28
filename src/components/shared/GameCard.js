import Link from 'next/link';

const GameCard = ({ href, title, description }) => {
  return (
    <Link href={href} className="game-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  );
};

export default GameCard; 