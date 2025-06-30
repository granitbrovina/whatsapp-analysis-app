export default function DetailedStatistics({ statsData }) {
  const { day_of_week, response_time } = statsData;
  const authors = Object.keys(day_of_week);
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Detailed Statistics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Messages by Day of Week */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-gray-800">Messages by Day of Week</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Author</th>
                  {weekDays.map(day => <th key={day} className="p-2 text-center">{day.slice(0, 3)}</th>)}
                </tr>
              </thead>
              <tbody>
                {authors.map(author => (
                  <tr key={author} className="border-b">
                    <td className="p-2 font-semibold">{author}</td>
                    {weekDays.map(day => <td key={day} className="p-2 text-center">{day_of_week[author][day] || 0}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Response Times */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-gray-800">Response Times (mins)</h3>
           <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Author</th>
                  <th className="p-2 text-center">Mean</th>
                  <th className="p-2 text-center">Median</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response_time).map(([author, stats]) => (
                  <tr key={author} className="border-b">
                    <td className="p-2 font-semibold">{author}</td>
                    <td className="p-2 text-center">{stats.mean.toFixed(1)}</td>
                    <td className="p-2 text-center">{stats.median.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}