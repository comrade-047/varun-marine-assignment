import { useState } from 'react';
import { usePooling } from '../hooks/usePooling';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { SimpleBarChart } from '../components/SimpleBarChart';

export function PoolingTab() {
  const { stagedShips, loading, error, success, totalPoolBalance, addShipToPool, removeShipFromPool, createPool } = usePooling();
  const [shipId, setShipId] = useState('R005');
  const [year, setYear] = useState('2025');

  const handleAddShip = () => {
    addShipToPool(shipId, Number(year));
  };

  const handleCreatePool = () => {
    createPool(Number(year));
  };

  const isPoolValid = totalPoolBalance >= 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#001E2B] tracking-tight">
        Create Compliance Pool
      </h2>

      {/* Add Ship Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <InputField
          label="Ship ID"
          value={shipId}
          onChange={setShipId}
          placeholder="e.g., R005"
        />
        <InputField
          label="Year"
          value={year}
          onChange={setYear}
          placeholder="e.g., 2025"
        />
        <div className="md:mt-6">
          <Button
            onClick={handleAddShip}
            label={loading ? 'Adding...' : 'Add Ship to Pool'}
            disabled={loading}
            variant="primary"
          />
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 text-center text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 text-center text-[#00ED64] bg-[#00ED64]/10 border border-[#00ED64]/30 rounded-xl font-medium">
          Pool created successfully! (ID: {success.id})
        </div>
      )}

      {/*Staging + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pool Members */}
        <div className="lg:col-span-2 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h3 className="text-lg font-medium text-[#001E2B] mb-3">
            Pool Members ({stagedShips.length})
          </h3>

          {stagedShips.length === 0 ? (
            <p className="text-sm text-gray-500">
              No ships added to the pool yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stagedShips.map((ship) => (
                <li
                  key={ship.ship_id}
                  className="flex items-center justify-between py-3 transition-all hover:bg-[#F5F7F6] rounded-lg px-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ship.ship_id} ({ship.year})
                    </p>
                    <p
                      className={`text-sm ${
                        ship.cb_gco2eq < 0
                          ? 'text-red-500'
                          : 'text-[#00ED64]'
                      }`}
                    >
                      {ship.cb_gco2eq.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{' '}
                      gCO₂e
                    </p>
                  </div>
                  <button
                    onClick={() => removeShipFromPool(ship.ship_id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Summary Card */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-[#001E2B]">Pool Summary</h3>
            <p className="text-sm text-gray-600 mt-2">Total Pool Balance:</p>
            <div
              className={`text-3xl font-bold my-3 ${
                isPoolValid ? 'text-[#00ED64]' : 'text-red-600'
              }`}
            >
              {totalPoolBalance.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{' '}
              gCO₂e
            </div>
            {!isPoolValid && (
              <p className="text-sm text-red-500">
                Pool balance is negative. Add more surplus ships.
              </p>
            )}
          </div>

          <Button
            onClick={handleCreatePool}
            label={loading ? 'Creating...' : 'Create Pool'}
            disabled={loading || !isPoolValid || stagedShips.length === 0}
            variant="primary"
          />
        </div>
      </div>

      {/* Chart visualization */}
      {stagedShips.length > 0 && (
        <div className="mt-6">
          <SimpleBarChart
            data={stagedShips.map((ship) => ({
              label: ship.ship_id,
              value: ship.cb_gco2eq,
            }))}
          />
        </div>
      )}
    </div>
  );
}
