export const normalizeWorthaftSliderValue = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 2;

  const sliderValue = value > 4 ? Math.round(value / 25) : Math.round(value);
  return Math.min(4, Math.max(0, sliderValue));
};

export const getWorthaftKeyDimensions = (keyWidth: number, keyHeight: number) => ({
  width: 26 + (keyWidth / 4) * 24,
  height: 26 + (keyHeight / 4) * 24,
});
