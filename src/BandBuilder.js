import { Grid, Header, Button } from 'semantic-ui-react'
import { Compendium } from './Compendium'
import { Roster } from './Roster'
import { useState, useEffect } from 'react'
import { readRemoteFile } from "react-papaparse";
import { compendiumContext } from './compendiumContext'
import qs from "qs";
import { createBrowserHistory } from 'history'
import { addFighterToRoster, removeFighterFromRoster, initEmptyRoster, initRosterByIds } from './api'

export function BandBuilder(){
  const [profiles, setProfiles] = useState([]);
  const [roster, setRoster] = useState(initEmptyRoster())
  const [abilities, setAbilities] = useState([]);
  const [showCompendium, setShowCompendium] = useState(true)

  const history = createBrowserHistory();

  // Fetch the compendium data from a Google Spreadsheet
  // When data is fetched, get profile ids from url
  // If data is already present, updates url instead
  useEffect(() => {
    if (profiles.length === 0) {
      readRemoteFile(
        "https://docs.google.com/spreadsheets/d/1vdbVXRwONKkx59xyKy0eopc8gjeFQLM3dZZM84HPVE8/export?format=csv",
        {
          header: true,
          complete: (results) => {
            const profiles = results.data.filter(row => row.profileId !== '');
            const abilities = results.data.filter(row => row.profileId === '');
            setProfiles(profiles);
            setAbilities(abilities);
            const filterParams = history.location.search.substr(1);
            const filtersFromParams = qs.parse(filterParams);

            if (filtersFromParams.p) {
              setRoster(initRosterByIds(profiles, filtersFromParams.p.split(",")))
            }
          },
        }
      )
    } else {
      history.push(`?p=${roster.fighters.map(f => f.profile.profileId).join(',')}`);
    }
  })


  function removeFighterFromRosterHandle(fighterId) {
    setRoster(removeFighterFromRoster(roster, fighterId));
  }

  function addFighterToRosterHandle(profile) {
    setRoster(addFighterToRoster(roster, profile));
  }

  return(
    <compendiumContext.Provider value={{profiles: profiles, abilities: abilities}}>
      { showCompendium
        ? <Button onClick={() => { setShowCompendium(false) }}>Hide Compendium</Button>
        : <Button onClick={() => { setShowCompendium(true) }}>Show Compendium</Button>
      }
      { showCompendium
      ? <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">Compendium</Header>
              <Compendium addFighterToRoster={addFighterToRosterHandle} roster={roster}/>
            </Grid.Column>
            <Grid.Column>
              <Header as="h1">Roster</Header>
              <Roster removeFighterFromRoster={removeFighterFromRosterHandle} roster={roster} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      : <Grid columns={1}>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">Roster</Header>
              <Roster removeFighterFromRoster={removeFighterFromRosterHandle} roster={roster} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      }
    </compendiumContext.Provider>
  )
}
