export type CbCalculationInput = {
  ghgIntensity: number;
  fuelConsumption: number;
};

export class ComplianceService {
  public static readonly TARGET_INTENSITY_2025 = 89.3368;
  public static readonly ENERGY_CONVERSION_FACTOR_MJ_PER_T = 41000;

  /**
   * Calculates the Compliance Balance (CB)
   * Positive CB -> Surplus ; Negative -> Deficit
   */
  calculateCB(input: CbCalculationInput): number {
    const energyInScope =
      input.fuelConsumption *
      ComplianceService.ENERGY_CONVERSION_FACTOR_MJ_PER_T;

    const complianceBalance =
      (ComplianceService.TARGET_INTENSITY_2025 - input.ghgIntensity) *
      energyInScope;

    return complianceBalance;
  }
}