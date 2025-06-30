import { Users, MessageSquare, CalendarDays, Clock } from 'lucide-react';
import Plot from './Plot';
import TopWords from './TopWords';
import DetailedStatistics from './DetailedStatistics';
import TopActivityDays from './TopActivityDays';
import CommunicationPatterns from './CommunicationPatterns';

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-brand-background text-brand-dark p-3 rounded-full mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Insight = ({ title, children }) => (
    <div className="mt-4 bg-brand-background border-l-4 border-brand-medium p-4 rounded-r-lg text-gray-700">
        <p><span className="font-bold text-brand-dark">{title}:</span> {children}</p>
    </div>
);

export default function Dashboard({ data, onReset }) {
    const { metadata, insights, tables, patterns, plots, words } = data;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Analysis Dashboard</h1>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-brand-dark text-white rounded-md hover:bg-brand-medium font-semibold"
                >
                    Analyze Another File
                </button>
            </div>

            {/* --- Row 1: Key Stats --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<MessageSquare />} label="Total Messages" value={metadata.total_messages.toLocaleString()} />
                <StatCard icon={<CalendarDays />} label="Days Analyzed" value={metadata.period_days} />
                <StatCard icon={<Users />} label="Participants" value={metadata.participants.length} />
                <StatCard icon={<Clock />} label="Avg. Messages/Day" value={metadata.avg_messages_per_day} />
            </div>

            {/* --- Row 2: Message Distribution --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Plot data={plots.message_distribution} />
                <Insight title="Key Insight">
                    The most active participant is <strong>{insights.message_distribution.most_active_author}</strong> with {insights.message_distribution.most_active_count.toLocaleString()} messages ({insights.message_distribution.most_active_percent}% of total conversation).
                </Insight>
            </div>
            
            {/* --- Row 3: Hourly Activity --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Plot data={plots.hourly_heatmap} />
                 <Insight title="Activity Analysis">
                    Peak messaging hour is <strong>{insights.hourly_activity.peak_hour}</strong> with {insights.hourly_activity.peak_msg_count} messages.
                </Insight>
            </div>

            {/* --- Row 4: Sentiment Analysis --- */}
            {plots.sentiment_pies && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Plot data={plots.sentiment_pies} />
                    <Insight title="Emotional Tone">
                        Overall conversation maintains a generally positive and neutral atmosphere.
                    </Insight>
                </div>
            )}


            {/* --- Row 5: Conversation Timeline --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Plot data={plots.timeline} />
                <Insight title="Conversation Evolution">
                    Analysis period from <strong>{metadata.date_range.start}</strong> to <strong>{metadata.date_range.end}</strong>. The conversation shows consistent engagement with notable peaks.
                </Insight>
            </div>

            {/* --- Row 6: Love Words Analysis --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Plot data={plots.love_words} />
                <Insight title="Affection Metrics">
                    <strong>{insights.love_words.leader}</strong> uses the most affectionate language with {insights.love_words.count} love words.
                </Insight>
            </div>

            {/* --- Row 7: Top Words --- */}
            <TopWords wordsData={words} />
            
            {/* --- Row 8: Detailed Statistics --- */}
            <DetailedStatistics statsData={tables} />

            {/* --- Row 9: Top Activity Days --- */}
            <TopActivityDays busiestDays={tables.busiest_days} />

            {/* --- Row 10: Communication Patterns --- */}
            <CommunicationPatterns patternsData={patterns} />
            
        </div>
    );
}