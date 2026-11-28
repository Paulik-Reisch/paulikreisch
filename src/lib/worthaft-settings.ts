export const normalizeWorthaftSliderValue = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 2;

  const sliderValue = value > 4 ? Math.round(value / 25) : Math.round(value);
  return Math.min(4, Math.max(0, sliderValue));
};

export const getWorthaftKeyDimensions = (keyWidth: number, keyHeight: number) => ({
  width: 26 + (keyWidth / 4) * 24,
  height: 26 + (keyHeight / 4) * 24,
});


export type WorthaftSettings = {
  keyWidth: number; keyHeight: number; keySize: number; keyRadius: number;
  tileWidth: number; tileHeight: number; tileRadius: number;
  palette: 'original' | 'classic';
  hotTipEnabled: boolean; musicEnabled: boolean; animationsEnabled: boolean;
  repeatConfirmedLetters: boolean;
};

export const DEFAULT_WORTHAFT_SETTINGS: WorthaftSettings = {
  keyWidth: 4, keyHeight: 2, keySize: 2, keyRadius: 1,
  tileWidth: 1, tileHeight: 1, tileRadius: 1, palette: 'original',
  hotTipEnabled: true, musicEnabled: false, animationsEnabled: true,
  repeatConfirmedLetters: false,
};

export const normalizeWorthaftSettings = (value: unknown): WorthaftSettings => {
  const saved = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
  const settings = { ...DEFAULT_WORTHAFT_SETTINGS };
  for (const key of ['keyWidth', 'keyHeight', 'keySize', 'keyRadius', 'tileWidth', 'tileHeight', 'tileRadius'] as const) {
    if (saved[key] !== undefined) settings[key] = normalizeWorthaftSliderValue(saved[key]);
  }
  for (const key of ['hotTipEnabled', 'musicEnabled', 'animationsEnabled', 'repeatConfirmedLetters'] as const) {
    if (typeof saved[key] === 'boolean') settings[key] = saved[key];
  }
  if (saved.palette === 'classic') settings.palette = 'classic';
  return settings;
};

export const getWorthaftTileDimensions = (width: number, height: number) => ({
  width: 46 + width * 9, height: 46 + height * 9,
});

export const getWorthaftStatusClass = (status: string, palette: WorthaftSettings['palette']) => {
  // Hover-Farben muessen der Statusfarbe entsprechen: Auf Touch-Geraeten bleibt
  // :hover nach dem Tippen "kleben" und wuerde sonst die Statusfarbe uebermalen.
  if (status === 'correct') return palette === 'classic'
    ? 'bg-[#477a43] text-white border-[#477a43] hover:bg-[#477a43] hover:text-white'
    : 'bg-[#0067d9] text-white border-[#0067d9] hover:bg-[#0067d9] hover:text-white';
  if (status === 'present') return 'bg-[#e8be3c] text-neutral-950 border-[#e8be3c] hover:bg-[#e8be3c] hover:text-neutral-950';
  if (status === 'absent') return 'bg-[#56565d] text-white border-[#56565d] hover:bg-[#56565d] hover:text-white';
  return '';
};
