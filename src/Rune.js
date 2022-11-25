import './runes.css'

const mapping = {
  agile: '',
  attacks: '',
  axe: '',
  beast: '',
  berserker: '',
  blast: '',
  champion: '',
  dagger: '',
  damage: '',
  destroyer: '',
  elite: '',
  fangs: '',
  ferocious: '',
  frenzied: '',
  hero: '',
  leader: '',
  move: '',
  mystic: '',
  range: '',
  'ranged weapon': '',
  'reach weapon': '',
  spear: '',
  strength: '',
  sword: '',
  toughness: '',
  warrior: '',
  wounds: '',
}

export function Rune(props) {
  const character = mapping[props.name.toLowerCase()];
  const className = character ? 'rune' : ''

  return (
    <span className={className}>{character ? character : props.name}</span>
  )
}
