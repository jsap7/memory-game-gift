import './globals.css';
import PasswordProtection from '@/components/PasswordProtection';

export const metadata = {
  title: 'Memory Game Gift',
  description: 'A collection of fun games',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PasswordProtection>
          {children}
        </PasswordProtection>
      </body>
    </html>
  );
}
