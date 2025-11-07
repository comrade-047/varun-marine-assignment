import { PoolService, PoolMemberInput } from "./PoolService";

describe("PoolService", () => {
  let poolService: PoolService;

  beforeEach(() => {
    poolService = new PoolService();
  });

  it("should throw an error if the total pool balance is negative", () => {
    const members: PoolMemberInput[] = [
      { ship_id: "R001", cb_before: 1000 },
      { ship_id: "R002", cb_before: -2000 },
    ];

    expect(() => poolService.allocatePool(members)).toThrow(
      "Invalid pool: Total balance is negative."
    );
  });

  it("should correctly allocate surplus to cover a deficit", () => {
    const members: PoolMemberInput[] = [
      { ship_id: "R001", cb_before: 1000 },
      { ship_id: "R002", cb_before: -500 },
    ];

    const result = poolService.allocatePool(members);

    const member1 = result.find((m) => m.ship_id === "R001");
    const member2 = result.find((m) => m.ship_id === "R002");

    expect(member2?.cb_after).toBe(0);
    expect(member1?.cb_after).toBe(500);
  });

  it("should use the richest surplus ship first to cover the poorest deficit ship", () => {
    const members: PoolMemberInput[] = [
      { ship_id: "DEFICIT_POOR", cb_before: -1000 },
      { ship_id: "SURPLUS_RICH", cb_before: 2000 },
      { ship_id: "DEFICIT_SMALL", cb_before: -100 },
      { ship_id: "SURPLUS_SMALL", cb_before: 500 },
    ];

    const result = poolService.allocatePool(members);

    expect(result.find((m) => m.ship_id === "DEFICIT_POOR")?.cb_after).toBe(0);
    expect(result.find((m) => m.ship_id === "DEFICIT_SMALL")?.cb_after).toBe(0);

    expect(result.find((m) => m.ship_id === "SURPLUS_RICH")?.cb_after).toBe(
      900
    );
    expect(result.find((m) => m.ship_id === "SURPLUS_SMALL")?.cb_after).toBe(
      500
    );
  });

  it('should throw an error for a pool that sums to negative', () => {
  const members: PoolMemberInput[] = [
    { ship_id: 'SURPLUS_A', cb_before: 100 },
    { ship_id: 'DEFICIT_B', cb_before: -1000 },
    { ship_id: 'SURPLUS_C', cb_before: 100 },
  ];
  expect(() => poolService.allocatePool(members)).toThrow(
    'Invalid pool: Total balance is negative.'
  );
  });
});
