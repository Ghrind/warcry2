import './runes.css'
import './fonts/warcry.ttf'
import reactStringReplace from 'react-string-replace'

const mapping = {
  agile: '',
  ally: '',
  attacks: '',
  axe: '',
  beast: '',
  berserker: '',
  blast: '',
  brute: '',
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
  hammer: '',
  hero: '',
  leader: '',
  move: '',
  mystic: '',
  range: '',
  'ranged weapon': '',
  'reach weapon': '',
  scythe: '',
  scout: '',
  spear: '',
  strength: '',
  sword: '',
  terrifying: '',
  thrall: '',
  toughness: '',
  trapper: '',
  unarmed: '',
  warrior: '',
  wounds: '',
}

export function replaceRuneInText(text) {
  return reactStringReplace(text, /<([a-zA-Z]+)>/, (match, i) => (
    <Rune name={match} />
  ))
}

export function Rune(props) {
  const character = mapping[props.name.toLowerCase()];
  const className = character ? 'rune' : ''

  return (
    <span className={className}>{character ? character : props.name}</span>
  )
}
