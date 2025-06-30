export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>&copy; {currentYear} WhatsApp Chat Analyzer. All rights reserved.</p>
        <p className="mt-1">This is an independent project and is not affiliated with WhatsApp Inc.</p>
      </div>
    </footer>
  );
}