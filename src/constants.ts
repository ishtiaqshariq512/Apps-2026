export interface Unit {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Factor relative to 1 Square Meter
  category: 'metric' | 'imperial' | 'regional';
}

export const UNITS: Unit[] = [
  // Metric
  { id: 'sqm', name: 'Square Meters', symbol: 'm²', factor: 1, category: 'metric' },
  { id: 'sqkm', name: 'Square Kilometers', symbol: 'km²', factor: 1000000, category: 'metric' },
  { id: 'hectare', name: 'Hectares', symbol: 'ha', factor: 10000, category: 'metric' },
  
  // Imperial
  { id: 'sqft', name: 'Square Feet', symbol: 'ft²', factor: 0.092903, category: 'imperial' },
  { id: 'sqyd', name: 'Square Yards', symbol: 'yd²', factor: 0.836127, category: 'imperial' },
  { id: 'acre', name: 'Acres', symbol: 'ac', factor: 4046.86, category: 'imperial' },
  { id: 'sqmi', name: 'Square Miles', symbol: 'mi²', factor: 2589988.11, category: 'imperial' },

  // Regional (South Asia focus as it's common for "land area" requests)
  { id: 'cent', name: 'Cents', symbol: 'ct', factor: 40.4686, category: 'regional' },
  { id: 'guntha', name: 'Guntha', symbol: 'gn', factor: 101.17, category: 'regional' },
  { id: 'marla', name: 'Marla', symbol: 'ml', factor: 25.2929, category: 'regional' },
  { id: 'kanal', name: 'Kanal', symbol: 'kn', factor: 505.857, category: 'regional' },
  { id: 'bigha', name: 'Bigha (Standard)', symbol: 'bg', factor: 2529.28, category: 'regional' },
];
