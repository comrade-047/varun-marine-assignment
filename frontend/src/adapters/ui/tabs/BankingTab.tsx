import { useState } from 'react';
import { useBanking } from '../hooks/useBanking';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';

export function BankingTab() {
  const { compliance, loading, error, getCompliance, bankSurplus, applyBankedSurplus } = useBanking();
  const [shipId, setShipId] = useState('R004');
  const [year, setYear] = useState('2025');
  const [applyAmount, setApplyAmount] = useState('1000');

  const handleFetch = () => getCompliance(shipId, Number(year));
  const handleBank = () => bankSurplus(shipId, Number(year));
  const handleApply = () => applyBankedSurplus(shipId, Number(year), Number(applyAmount));

  const currentCB = compliance?.cb_gco2eq ?? 0;
  const isSurplus = currentCB > 0;
  const isDeficit = currentCB < 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#001E2B]">Banking & Compliance</h2>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/90 border border-gray-100 rounded-2xl shadow-sm p-6">
        <InputField label="Ship ID" value={shipId} onChange={setShipId} placeholder="e.g., R004" />
        <InputField label="Year" value={year} onChange={setYear} placeholder="e.g., 2025" />
        <div className="flex items-end">
          <Button
            onClick={handleFetch}
            label={loading ? 'Loading...' : 'Fetch Compliance'}
            disabled={loading}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 text-center text-red-700 bg-red-50 border border-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Compliance Results */}
      {compliance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compliance KPI Card */}
          <div className="space-y-4 p-6 bg-[#F6F8F6] border border-gray-100 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-[#001E2B]">
              Compliance Balance for {compliance.ship_id} ({compliance.year})
            </h3>

            <div
              className={`text-3xl font-bold ${
                isSurplus
                  ? 'text-[#00ED64]'
                  : isDeficit
                  ? 'text-red-600'
                  : 'text-[#001E2B]'
              }`}
            >
              {currentCB.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e
            </div>

            <p className="text-sm text-[#001E2B]/70">
              {isSurplus && 'This is a surplus that can be banked.'}
              {isDeficit && 'This is a deficit. You can apply banked surplus to cover it.'}
              {!isSurplus && !isDeficit && 'The balance is zero.'}
            </p>
          </div>

          {/* Actions Card */}
          <div className="space-y-4 p-6 bg-white/90 border border-gray-100 rounded-2xl shadow-sm">
            {/* Bank Surplus */}
            <div>
              <Button
                onClick={handleBank}
                label={loading ? 'Banking...' : 'Bank Full Surplus'}
                disabled={loading || !isSurplus}
                variant="primary"
              />
            </div>

            {/* Apply Banked Surplus */}
            <div className="space-y-3 pt-5 border-t border-gray-200">
              <InputField
                label="Amount to Apply"
                value={applyAmount}
                onChange={setApplyAmount}
                type="number"
              />
              <Button
                onClick={handleApply}
                label={loading ? 'Applying...' : 'Apply from Bank'}
                disabled={loading || !isDeficit || Number(applyAmount) <= 0}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
