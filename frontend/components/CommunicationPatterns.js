import { MessageCircle, Smile, HelpCircle } from 'lucide-react';

const PatternCard = ({ icon, title, data }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
            <div className="text-blue-600 mr-2">{icon}</div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        </div>
        <ul className="space-y-1 text-sm">
            {data.map(item => (
                <li key={item.label} className="flex justify-between">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default function CommunicationPatterns({ patternsData }) {
    const { conversation_starters, emoji_usage, question_ratio } = patternsData;

    const starters_data = Object.entries(conversation_starters).map(([author, count]) => ({ label: author, value: count }));
    const emoji_data = Object.entries(emoji_usage).map(([author, count]) => ({ label: author, value: `${count} emojis` }));
    const question_data = Object.entries(question_ratio).map(([author, data]) => ({
        label: author,
        value: `${data.questions} (${(data.questions / data.total * 100).toFixed(0)}%)`
    }));

    return (
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Communication Patterns</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PatternCard icon={<MessageCircle />} title="Conversation Starters" data={starters_data} />
                <PatternCard icon={<Smile />} title="Emoji Usage" data={emoji_data} />
                <PatternCard icon={<HelpCircle />} title="Question Ratio" data={question_data} />
            </div>
        </div>
    );
}