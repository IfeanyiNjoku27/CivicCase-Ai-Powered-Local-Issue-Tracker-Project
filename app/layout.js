import './globals.css'; // 
import ApolloWrapper from '@/../components/ApolloWrapper';
import NavBar from '@/../components/layout/Navbar';

export const metadata = {
  title: 'CivicCase: AI-Powered Local Issue Tracker',
  description: 'Report, track, and resolve local community issues with AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <ApolloWrapper>
          <NavBar />
          <main className="grow">{children}</main>
        </ApolloWrapper>
      </body>
    </html>
  );
}