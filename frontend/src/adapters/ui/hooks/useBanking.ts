import { useState } from "react";
import type {
  ShipCompliance,
  BankResult,
  BankEntry,
} from "../../../core/domain/types";
import { api } from "../../infrastructure/AxiosApi";
import { AxiosError } from "axios";

type BankingState = {
  compliance: ShipCompliance | null;
  lastBankResult: BankEntry | null;
  lastApplyResult: BankResult | null;
  loading: boolean;
  error: string | null;
};

export function useBanking() {
  const [state, setState] = useState<BankingState>({
    compliance: null,
    lastBankResult: null,
    lastApplyResult: null,
    loading: false,
    error: null,
  });

  const getCompliance = async (shipId: string, year: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await api.computeCb(shipId, year);
      setState((s) => ({ ...s, loading: false, compliance: data }));
    } catch (err) {
      console.error(err);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Failed to compute compliance balance.",
      }));
    }
  };

  const bankSurplus = async (shipId: string, year: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = await api.bankSurplus(shipId, year);

      const refreshedData = await api.getAdjustedCb(shipId, year);
      setState((s) => ({
        ...s,
        loading: false,
        lastBankResult: result,
        compliance: refreshedData,
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

  const applyBankedSurplus = async (
    shipId: string,
    year: number,
    amount: number
  ) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = await api.applyBankedSurplus(shipId, year, amount);

      const refreshedData = await api.getAdjustedCb(shipId, year);
      setState((s) => ({
        ...s,
        loading: false,
        lastApplyResult: result,
        compliance: refreshedData,
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

  return { ...state, getCompliance, bankSurplus, applyBankedSurplus };
}
