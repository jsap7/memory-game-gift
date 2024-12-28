import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  return (
    <Link href="/" className="back-button">
      <ArrowLeft />
      Back to Games
    </Link>
  );
};

export default BackButton; 