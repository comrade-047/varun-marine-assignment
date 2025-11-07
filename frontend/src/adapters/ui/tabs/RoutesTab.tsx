import { useRoutes } from "../hooks/useRoutes";
import { Button } from "../components/Button";
import { LoadingScreen } from "../components/LoadingScreen";

export function RoutesTab() {
  const { routes, loading, error, setBaseline } = useRoutes();

  if (loading) {
    return <LoadingScreen message="Analyzing and comparing routes..." />;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500 font-semibold">{error}</div>;
  }

  // ✅ Move baseline route to top
  const sortedRoutes = [...routes].sort((a, b) => (a.is_baseline ? -1 : b.is_baseline ? 1 : 0));

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-5 text-[#001E2B] tracking-tight">
        Ship Routes
      </h2>

      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <thead className="bg-[#001E2B] text-gray-100">
          <tr>
            {[
              "Route ID",
              "Vessel Type",
              "Fuel Type",
              "Year",
              "GHG Intensity",
              "Actions",
            ].map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedRoutes.map((route, index) => (
            <tr
              key={route.id}
              className={`transition-all duration-150 ${
                route.is_baseline
                  ? "bg-[#E6F4EA] border-l-4 border-[#00ED64]"
                  : index % 2 === 0
                  ? "bg-white hover:bg-[#F5F7F6]"
                  : "bg-[#F9FBFA] hover:bg-[#F5F7F6]"
              }`}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {route.route_id}
                {route.is_baseline && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#00ED64]/20 text-[#00ED64] font-semibold">
                    Baseline
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{route.vesselType}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{route.fuelType}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{route.year}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {route.ghgIntensity} gCO₂e/MJ
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {route.is_baseline ? (
                  <span className="text-sm font-semibold text-[#00ED64]">Current Baseline</span>
                ) : (
                  <Button
                    onClick={() => setBaseline(route.id)}
                    label="Set as Baseline"
                    variant="primary"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
