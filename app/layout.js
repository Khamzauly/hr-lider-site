import '../src/styles/index.css';

export const metadata = {
  title: 'HR Lider',
  description: 'Backend and content API for HR Lider'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
