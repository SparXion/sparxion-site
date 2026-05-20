/**
 * Hero design band order — must match Portfolio/01-MASTERS folder names.
 * `portfolioItems` is built in this order for grid + unified band parity.
 */
export const DESIGN_BAND_PROJECT_IDS = [
  'hw-custom-motors',
  'hw-twinduction',
  'hw-crashers',
  'hw-tri-n-stop-me',
  'hw-art',
  'nike-acg',
  'nike-cascade',
  'nike-eps',
  'nike-zion',
  'paw-patrol',
  'gi-joe',
  'valaverse',
  'power-rangers',
  'star-wars',
  'apparel',
  'mwls',
  'naughty-connie',
  'concept-art',
  'drgn-fli',
] as const;

export type DesignBandProjectId = (typeof DESIGN_BAND_PROJECT_IDS)[number];
