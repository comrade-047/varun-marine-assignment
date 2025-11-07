type ChartDataItem = {
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  data: ChartDataItem[];
};

export function SimpleBarChart({ data }: SimpleBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-[#001E2B]/70 text-sm bg-[#F6F8F6] rounded-lg p-4 text-center">
        No data for chart.
      </div>
    );
  }

  const baseline = data[0].value;
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const chartHeight = 288;

  const getBarHeight = (value: number) => {
    if (maxValue === minValue) return chartHeight;
    const normalized = (value - minValue) / (maxValue - minValue);
    return 60 + normalized * (chartHeight - 60); 
  };

  return (
    <div className="w-full p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex items-end justify-around h-74 space-x-6">
        {data.map((item) => {
          const barHeight = getBarHeight(item.value);
          const isBetter = item.value <= baseline;

          return (
            <div key={item.label} className="flex-1 flex flex-col items-center justify-end relative group">
              <div
                className={`w-3/5 rounded-t-xl shadow-md transition-all duration-300 ${
                  isBetter ? 'bg-[#00ED64] hover:bg-[#00C755]' : 'bg-[#FFB100]/80 hover:bg-[#FFAF00]'
                }`}
                style={{ height: `${barHeight}px` }}
              >
                <div className="absolute bottom-full mb-2 hidden group-hover:flex items-center justify-center">
                  <span className="bg-[#001E2B] text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                    {item.label}: {item.value.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#001E2B]/80 mt-2 font-medium text-center truncate w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-4 text-xs text-[#001E2B]/60">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-[#00ED64] rounded-sm"></span>
          <span>Better than baseline</span>
          <span className="mx-4">|</span>
          <span className="w-3 h-3 bg-[#FFB100]/80 rounded-sm"></span>
          <span>Worse than baseline</span>
        </div>
      </div>
    </div>
  );
}


