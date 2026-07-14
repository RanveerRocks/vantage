import type { CountryId } from './schemas'

// Categorical palette: 8 hues at matched saturation/lightness so no country
// reads as "endorsed". Hue assignment is arbitrary, not meaningful.
// Lightness/chroma tuned so the set passes the dataviz six-checks validator
// on the white chart surface (worst adjacent-pair CVD ΔE 11.8, floor band,
// covered by the flag + code secondary encoding on every mark).
export const COUNTRY_COLORS: Record<CountryId, string> = {
  us: '#B94A57', // crimson
  uk: '#92531B', // rust
  ca: '#6F8F23', // olive
  au: '#2B8F6E', // sea green
  de: '#1F8CA8', // azure
  ie: '#6580DC', // cobalt
  nl: '#6A44B8', // violet
  sg: '#B4479B', // magenta
}
