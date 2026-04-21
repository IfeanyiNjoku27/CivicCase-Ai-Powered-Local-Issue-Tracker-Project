import './globals.css'; // 

export const metadata = {
  title: 'CivicCase: AI-Powered Local Issue Tracker',
  description: 'Report, track, and resolve local community issues with AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* can add a global Navigation Bar here later if needed */}
        <main>{children}</main>
      </body>
    </html>
  );
}