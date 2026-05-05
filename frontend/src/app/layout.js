import './globals.css';

export const metadata = {
  title: 'VidVault',
  description: 'Your personal video library',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
