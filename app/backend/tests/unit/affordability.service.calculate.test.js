const { createAffordabilityService } = require('../../src/services/affordability.service');

function makeRecords() {
  return [
    { month: '2024-01', town: 'TAMPINES', flat_type: '4 ROOM', resale_price: 500000, floor_area_sqm: 90 },
    { month: '2024-03', town: 'TAMPINES', flat_type: '4 ROOM', resale_price: 540000, floor_area_sqm: 95 },
  ];
}

describe('affordabilityService.calculate', () => {
  it('returns a full result shape derived from comparable transactions', async () => {
    const resaleService = { fetchAllRecords: jest.fn().mockResolvedValue(makeRecords()) };
    const service = createAffordabilityService({ resaleService });

    const result = await service.calculate({
      income: 7000,
      savings: 100000,
      towns: 'TAMPINES',
      flatType: '4 ROOM',
    });

    expect(resaleService.fetchAllRecords).toHaveBeenCalledWith({
      town: 'TAMPINES',
      flat_type: '4 ROOM',
    });
    expect(result.medianPrice).toBe(520000);
    expect(result.downpaymentRequired).toBe(104000);
    expect(result.loanAmount).toBe(416000);
    expect(result.verdict).toMatch(/affordable|borderline|unaffordable/);
    expect(result.comparables).toHaveLength(2);
    expect(result.comparables[0].month).toBe('2024-03'); // most recent first
    expect(result.comparables[0].psm).toBeCloseTo(540000 / 95, 5);
  });

  it('caps comparables at 20 most recent transactions', async () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      month: `2024-${String((i % 12) + 1).padStart(2, '0')}`,
      town: 'TAMPINES',
      flat_type: '4 ROOM',
      resale_price: 500000 + i,
      floor_area_sqm: 90,
    }));
    const resaleService = { fetchAllRecords: jest.fn().mockResolvedValue(many) };
    const service = createAffordabilityService({ resaleService });

    const result = await service.calculate({
      income: 7000,
      savings: 0,
      towns: 'TAMPINES',
      flatType: '4 ROOM',
    });

    expect(result.comparables).toHaveLength(20);
  });

  it('marks grant ineligible applicants with an unchanged effective loan amount', async () => {
    const resaleService = { fetchAllRecords: jest.fn().mockResolvedValue(makeRecords()) };
    const service = createAffordabilityService({ resaleService });

    const result = await service.calculate({
      income: 9500,
      savings: 100000,
      towns: 'TAMPINES',
      flatType: '4 ROOM',
    });

    expect(result.grantEligibility.eligible).toBe(false);
    expect(result.grantEligibility.effectiveLoanAmount).toBe(result.loanAmount);
  });

  it('uses savings as the downpayment when it exceeds the 20% minimum, reducing the loan', async () => {
    const resaleService = { fetchAllRecords: jest.fn().mockResolvedValue(makeRecords()) };
    const service = createAffordabilityService({ resaleService });

    // medianPrice = 520000, 20% minimum = 104000, savings of 200000 exceeds it
    const result = await service.calculate({
      income: 7000,
      savings: 200000,
      towns: 'TAMPINES',
      flatType: '4 ROOM',
    });

    expect(result.downpaymentRequired).toBe(200000);
    expect(result.loanAmount).toBe(320000);
  });

  it('falls back to the 20% minimum downpayment when savings are insufficient', async () => {
    const resaleService = { fetchAllRecords: jest.fn().mockResolvedValue(makeRecords()) };
    const service = createAffordabilityService({ resaleService });

    const result = await service.calculate({
      income: 7000,
      savings: 50000,
      towns: 'TAMPINES',
      flatType: '4 ROOM',
    });

    expect(result.downpaymentRequired).toBe(104000);
    expect(result.loanAmount).toBe(416000);
  });

  it('handles no comparable transactions gracefully', async () => {
    const resaleService = { fetchAllRecords: jest.fn().mockResolvedValue([]) };
    const service = createAffordabilityService({ resaleService });

    const result = await service.calculate({
      income: 7000,
      savings: 0,
      towns: 'SEMBAWANG',
      flatType: '2 ROOM',
    });

    expect(result.medianPrice).toBe(0);
    expect(result.comparables).toEqual([]);
  });
});
