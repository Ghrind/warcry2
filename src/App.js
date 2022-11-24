import logo from './logo.svg';
import './App.css';

import { createContext } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { readRemoteFile } from "react-papaparse";
import qs from "qs";
import { createBrowserHistory } from 'history'

const profilesContext = createContext([]);

function Compendium() {
  const profiles = useContext(profilesContext)
  return (
    <ul>
      { profiles.map(f => <li key={f.profileId}>{f.name}</li>) }
    </ul>
  )
}

function RosterLine(props) {
  return (
    <li>{props.profileId}: {props.profile && props.profile.name}</li>
  )
}

function Roster() {
  const [profileIds, setProfileIds] = useState([]);
  const profiles = useContext(profilesContext)

  const history = createBrowserHistory();

  useEffect(() => {
    const filterParams = history.location.search.substr(1);
    const filtersFromParams = qs.parse(filterParams);
    if (filtersFromParams.p) {
      setProfileIds(filtersFromParams.p.split(","));
    }
  }, []);

  useEffect(() => {
    history.push(`?p=${profileIds.join(',')}`);
  }, [profileIds]);

  const removeFighter = () => {
    return setProfileIds(["4", "5"])
  }

  return (
    <>
      <button onClick={removeFighter}>apply</button>
      <ul>
        {profileIds.map(id => <RosterLine profileId={id} profile={profiles.filter(p => p.profileId === id)[0]} />)}
      </ul>
    </>
  )
}

function App() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (profiles.length !== 0) {
      return
    }

    readRemoteFile(
      "https://docs.google.com/spreadsheets/d/1vdbVXRwONKkx59xyKy0eopc8gjeFQLM3dZZM84HPVE8/export?format=csv",
      {
        header: true,
        complete: (results) => {
          setProfiles(results.data);
        },
      }
    )
  })

  return (
    <profilesContext.Provider value={profiles}>
      <h1>Test</h1>
      <Compendium />
      <Roster />
    </profilesContext.Provider>
  );
}

export default App;
