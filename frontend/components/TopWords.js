'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Cloud, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TopWords({ wordsData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const showWordcloud = (author) => {
    setModalImage(wordsData.wordclouds[author]);
    setModalTitle(`${author}'s Word Cloud`);
    setModalOpen(true);
  };

  const hideWordcloud = () => {
    setModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Words & Word Clouds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(wordsData.top_words).map(([author, words]) => (
          <div key={author} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{author}</h3>
            <ul className="space-y-2 text-sm">
              {words.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b border-gray-200 pb-1">
                  <span className="text-gray-600">{item.word}</span>
                  <span className="font-semibold text-gray-800">{item.count}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => showWordcloud(author)}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-semibold"
            >
              <Cloud className="w-4 h-4 mr-2" />
              View Word Cloud
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full relative">
            <button onClick={hideWordcloud} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold mb-4">{modalTitle}</h3>
            <Image src={`${API_URL}${modalImage}`} alt={modalTitle} width={800} height={400} unoptimized />
          </div>
        </div>
      )}
    </div>
  );
}