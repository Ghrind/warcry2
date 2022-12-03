import { useContext, useState } from 'react'
import { Container, List, Button, Header } from 'semantic-ui-react'
import { compendiumContext } from './compendiumContext'
import { FighterListItem } from './FighterListItem'
import { profileCanUseAbility, sortAbilities } from './api'
import { replaceRuneInText } from './Rune'

export function Compendium(props) {
  const compendium = useContext(compendiumContext);
  const profiles = compendium.profiles;

  const alliances = [...new Set(profiles.map(w => w.alliance))];
  const [alliance, setAlliance] = useState("");

  const factions = [...new Set(profiles.filter(p => p.alliance === alliance).map(w => w.faction))];
  const [faction, setFaction] = useState("");

  const filteredProfiles = profiles.filter(p => p.faction === faction);

  const abilities = sortAbilities(compendium.abilities.filter( a => a.faction === faction ));

  return (
    <Container>
      <List celled horizontal>
        {alliances && alliances.map( a =>
          <List.Item>
            <Button primary={alliance === a} onClick={() => setAlliance(a)}>{a}</Button>
          </List.Item>
        )}
      </List>
      <br />
      <List celled horizontal>
        {factions && factions.map( f =>
          <List.Item>
            <Button primary={faction === f} onClick={() => setFaction(f)}>{f}</Button>
          </List.Item>
        )}
      </List>
      <List divided verticalAlign="middle">
        {filteredProfiles && filteredProfiles.map( p =>
          <FighterListItem roster={props.roster} fighter={{ profile: p }} addFighterToRoster={props.addFighterToRoster} />
        )}
      </List>
      <Header as="h3">Abilities</Header>
      <List divided verticalAlign="middle">
        {abilities.map( a =>
          <List.Item>
            <b>[{a.roll}] {a.ability}: </b>
            {replaceRuneInText(a.description)}
            <br />
            <i>Used by: {profiles.filter(p => profileCanUseAbility(p, a)).map(p => p.name).join(", ")}</i>
          </List.Item>
        )}
      </List>
    </Container>
  )
}
