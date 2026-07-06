import type { CountryId } from './schemas'

// Categorical palette: 8 hues at matched saturation/lightness so no country
// reads as "endorsed". Hue assignment is arbitrary, not meaningful.
export const COUNTRY_COLORS: Record<CountryId, string> = {
  us: '#B94A57', // crimson
  uk: '#A9662C', // rust
  ca: '#6F8F23', // olive
  au: '#2B8F6E', // sea green
  de: '#1F8CA8', // azure
  ie: '#4E6ED3', // cobalt
  nl: '#7D58C8', // violet
  sg: '#B4479B', // magenta
}
