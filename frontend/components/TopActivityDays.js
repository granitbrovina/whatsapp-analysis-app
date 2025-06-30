export default function TopActivityDays({ busiestDays }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Activity Days</h2>
      <ul className="space-y-2 text-sm">
        {busiestDays.map((day, index) => (
          <li key={index} className="flex justify-between items-center border-b border-gray-200 pb-2 pt-1">
            <div className="flex items-center">
                <span className="text-center font-bold text-gray-400 w-8">#{index + 1}</span>
                <span className="font-semibold text-gray-800">{day.date}</span>
            </div>
            <span className="font-bold text-brand-dark bg-brand-background px-2 py-1 rounded-md">{day.count} msgs</span>
          </li>
        ))}
      </ul>
    </div>
  );
}