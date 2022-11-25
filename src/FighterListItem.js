import { List, Button } from 'semantic-ui-react'
import { Rune } from './Rune'
import { profileHasKeyword } from './api'

function profileIsSelectable(roster, profile) {
  // Profile is from the same faction
  if (roster.faction === '' || profile.faction === roster.faction) {
    return true
  }

  // Profile is an ally (champion, same alliance)
  if (profileHasKeyword(profile, 'champion') && profile.alliance === roster.alliance) {
    return true
  }

  // Profile is a bladeborn, and its champion is already on the roster
  if (profile.bladeborn && roster.fighters.some(f => profileHasKeyword(f.profile, 'champion') && f.profile.bladeborn === profile.bladeborn)) {
    return true
  }

  return false
}

export function FighterListItem(props) {
  return (
    <List.Item>
      <List.Header>
        {props.fighter.profile.name}
      </List.Header>
      <List.Content floated="right">
        {props.context === "remove"
          ? <Button onClick={ () => props.removeFighterFromRoster(props.fighter.id) }>Remove</Button>
          : <Button disabled={!profileIsSelectable(props.roster, props.fighter.profile)} onClick={ () => props.addFighterToRoster(props.fighter.profile) }>+{props.fighter.profile.cost}pts</Button>
        }
      </List.Content>
      <List.Content>
        <List celled horizontal>
          <List.Item><Rune name="move" /> {props.fighter.profile.move}</List.Item>
          <List.Item><Rune name="toughness" /> {props.fighter.profile.toughness}3</List.Item>
          <List.Item><Rune name="wounds" /> {props.fighter.profile.hp}</List.Item>
          <List.Item>
            {props.fighter.profile.leader && <Rune name="leader" />}
            {props.fighter.profile.keywords && props.fighter.profile.keywords.split(',').map( (kw) => <span><Rune name={kw} /> </span> )}
          </List.Item>
        </List>
        <br />
        {props.fighter.profile.attack1_type &&
          <List celled horizontal>
            <List.Item><Rune name={props.fighter.profile.attack1_type} /></List.Item>
            <List.Item><Rune name="range" /> {props.fighter.profile.attack1_range}</List.Item>
            <List.Item><Rune name="attacks" /> {props.fighter.profile.attack1_attacks}</List.Item>
            <List.Item><Rune name="strength" /> {props.fighter.profile.attack1_strength}</List.Item>
            <List.Item><Rune name="damage" /> {props.fighter.profile.attack1_damage}</List.Item>
          </List>
        }
        <br />
        {props.fighter.profile.attack2_type &&
          <List celled horizontal>
            <List.Item><Rune name={props.fighter.profile.attack2_type} /></List.Item>
            <List.Item><Rune name="range" /> {props.fighter.profile.attack2_range}</List.Item>
            <List.Item><Rune name="attacks" /> {props.fighter.profile.attack2_attacks}</List.Item>
            <List.Item><Rune name="strength" /> {props.fighter.profile.attack2_strength}</List.Item>
            <List.Item><Rune name="damage" /> {props.fighter.profile.attack2_damage}</List.Item>
          </List>
        }
      </List.Content>
    </List.Item>
  )
}
