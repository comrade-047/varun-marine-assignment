import { useComparison } from '../hooks/useComparison';
import { SimpleBarChart } from '../components/SimpleBarChart';
import type { ComparisonResult } from '../../../core/domain/types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';

export function CompareTab() {
  const { data, loading, error } = useComparison();

  if (loading) {
    return <LoadingScreen message="Analyzing and comparing routes..." />;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center p-6 text-[#001E2B]/70">No data available.</div>;
  }

  const chartData = data.comparisons.map((c) => ({
    label: c.route.route_id,
    value: c.route.ghgIntensity,
  }));

  chartData.unshift({
    label: `${data.baseline.route_id} (Baseline)`,
    value: data.baseline.ghgIntensity,
  });

  const targetValue = 89.3368;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#001E2B]">Route Comparison</h2>

      {/* Chart Section */}
      <section className="bg-white/90 shadow-sm rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-[#001E2B] mb-2">
          GHG Intensity Comparison (gCO₂e/MJ)
        </h3>
        <p className="text-sm text-[#001E2B]/70 mb-4">
          Target: <strong className="text-[#00ED64]">{targetValue} gCO₂e/MJ</strong>
        </p>
        <SimpleBarChart data={chartData} />
      </section>

      {/* Table Section */}
      <section className="bg-white/90 shadow-sm rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-[#001E2B] mb-3">
          Comparison Details
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-[#F6F8F6]">
              <tr>
                {['Route ID', 'GHG Intensity', '% Diff (from Baseline)', 'Status'].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-[#001E2B]/70 uppercase tracking-wide"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Baseline Row */}
              <tr className="bg-[#E6F4EA]">
                <td className="px-6 py-4 font-medium text-[#001E2B]">
                  {data.baseline.route_id} (Baseline)
                </td>
                <td className="px-6 py-4 text-[#001E2B]/80">{data.baseline.ghgIntensity}</td>
                <td className="px-6 py-4 text-[#001E2B]/60">—</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      data.baseline.ghgIntensity <= targetValue
                        ? 'bg-[#E6F4EA] text-[#00684A]'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {data.baseline.ghgIntensity <= targetValue ? (
                      <>
                        <CheckCircle2 size={14} /> Compliant
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Non-Compliant
                      </>
                    )}
                  </span>
                </td>
              </tr>

              {/* Comparison Rows */}
              {data.comparisons.map((c: ComparisonResult) => (
                <tr
                  key={c.route.id}
                  className="hover:bg-[#F6F8F6] transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium text-[#001E2B]">
                    {c.route.route_id}
                  </td>
                  <td className="px-6 py-4 text-[#001E2B]/80">
                    {c.route.ghgIntensity}
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${
                      c.percentDiff > 0 ? 'text-red-600' : 'text-[#00ED64]'
                    }`}
                  >
                    {c.percentDiff.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        c.compliant
                          ? 'bg-[#E6F4EA] text-[#00684A]'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {c.compliant ? (
                        <>
                          <CheckCircle2 size={14} /> Compliant
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> Non-Compliant
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
