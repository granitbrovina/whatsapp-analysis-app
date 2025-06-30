import { MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    // Using the dark green for the header
    <header className="bg-brand-dark shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* White icon and text for contrast */}
            <MessageCircle className="h-8 w-8 text-white" />
            <span className="ml-3 text-xl font-semibold text-white">Chat Analyzer</span>
          </div>
        </div>
      </div>
    </header>
  );
}