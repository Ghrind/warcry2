import './runes.css'
import './fonts/warcry.ttf'

const mapping = {
  agile: '',
  ally: '',
  attacks: '',
  axe: '',
  beast: '',
  berserker: '',
  blast: '',
  bulwark: '',
  champion: '',
  claws: '',
  club: '',
  dagger: '',
  damage: '',
  destroyer: '',
  elite: '',
  fangs: '',
  ferocious: '',
  fly: '',
  frenzied: '',
  hero: '',
  leader: '',
  move: '',
  mystic: '',
  range: '',
  'ranged weapon': '',
  'reach weapon': '',
  scout: '',
  spear: '',
  strength: '',
  sword: '',
  thrall: '',
  toughness: '',
  trapper: '',
  unarmed: '',
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
