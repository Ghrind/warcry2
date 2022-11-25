import { useContext, useState } from 'react'
//import { setAlliance, setFaction, loadData } from './compendiumSlice'
import { Container, List, Button } from 'semantic-ui-react'
import { profilesContext } from './profilesContext'
import { FighterListItem } from './FighterListItem'

export function Compendium(props) {
  const profiles = useContext(profilesContext)

  const alliances = [...new Set(profiles.map(w => w.alliance))];
  const [alliance, setAlliance] = useState("");

  const factions = [...new Set(profiles.filter(p => p.alliance === alliance).map(w => w.faction))];
  const [faction, setFaction] = useState("");

  const filteredProfiles = profiles.filter(p => p.faction === faction);

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
    </Container>
  )
}
