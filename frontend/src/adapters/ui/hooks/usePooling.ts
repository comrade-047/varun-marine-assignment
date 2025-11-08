import { useState, useMemo } from "react";
import type { ShipCompliance, Pool } from "../../../core/domain/types";
import { api } from "../../infrastructure/AxiosApi";
import { AxiosError } from "axios";

type PoolingState = {
  stagedShips: ShipCompliance[];
  loading: boolean;
  error: string | null;
  success: Pool | null;
};

export function usePooling() {
  const [state, setState] = useState<PoolingState>({
    stagedShips: [],
    loading: false,
    error: null,
    success: null,
  });

  // Calculate the total balance whenever the staged ships change
  const totalPoolBalance = useMemo(() => {
    return state.stagedShips.reduce((sum, ship) => sum + ship.cb_gco2eq, 0);
  }, [state.stagedShips]);

  // Fetch a ship's CB and add it to the staging list
  const addShipToPool = async (shipId: string, year: number) => {
    let shipAlreadyExists = false;

    setState((s) => {
      shipAlreadyExists = !!s.stagedShips.find(
        (ship) => ship.ship_id === shipId && ship.year === year
      );

      if (shipAlreadyExists) {
        // If ship exists, set error and stop loading
        return { ...s, error: "Ship is already in the pool.", loading: false };
      }
      // If not, set loading to true and clear errors
      return { ...s, loading: true, error: null, success: null };
    });
    if (shipAlreadyExists) return;

    try {
      const data = await api.computeCb(shipId, year);
      setState((s) => ({
        ...s,
        loading: false,
        stagedShips: [...s.stagedShips, data],
      }));
    } catch (err) {
      console.error(err);

      let errorMsg = "Failed to bank surplus.";

      if (err instanceof AxiosError) {
        errorMsg = err.response?.data?.error || errorMsg;
      }

      setState((s) => ({ ...s, loading: false, error: errorMsg }));
    }
  };

  const removeShipFromPool = (shipId: string) => {
    setState((s) => ({
      ...s,
      stagedShips: s.stagedShips.filter((ship) => ship.ship_id !== shipId),
    }));
  };

  const createPool = async (year: number) => {
    setState((s) => ({ ...s, loading: true, error: null, success: null }));
    try {
      const shipIds = state.stagedShips.map((ship) => ship.ship_id);
      const newPool = await api.createPool(shipIds, year);
      setState((s) => ({
        ...s,
        loading: false,
        success: newPool,
        stagedShips: [], // Clear the pool on success
      }));
    } catch (err) {
      console.error(err);

      let errorMsg = "Failed to bank surplus.";

      if (err instanceof AxiosError) {
        errorMsg = err.response?.data?.error || errorMsg;
      }

      setState((s) => ({ ...s, loading: false, error: errorMsg }));
    }
  };

  return {
    ...state,
    totalPoolBalance,
    addShipToPool,
    removeShipFromPool,
    createPool,
  };
}
