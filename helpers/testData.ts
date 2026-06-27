export function generateUsername(): string {
  return `testuser_${Date.now().toString(36)}`;
}

export function generatePassword(): string {
  return `Pass_${Date.now().toString(36)}`;
}

export const TEST_PRODUCTS = {
  SAMSUNG_GALAXY_S6: 1,
  NOKIA_LUMIA: 2,
  NEXUS_6: 3,
  SAMSUNG_GALAXY_S7: 4,
  IPHONE_6_32GB: 5,
  SONY_VAIO_I5: 6,
};

export const ORDER_DATA = {
  name: 'Test User',
  country: 'Russia',
  city: 'Moscow',
  card: '4111111111111111',
  month: '12',
  year: '2026',
};
