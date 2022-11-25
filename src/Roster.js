import { useContext, useState, useEffect } from 'react'
import { profilesContext } from './profilesContext'
import { getLeader, profileHasKeyword } from './api'
import { List, Divider, Container, Header } from 'semantic-ui-react'
import { FighterListItem } from './FighterListItem'

export function Roster(props) {
  const roster = props.roster
  const totalCost = roster.fighters.map(f => f.profile.cost).reduce((a, b) => a + parseInt(b), 0);
  const leader = getLeader(roster)
  const champions = roster.fighters.filter(f => profileHasKeyword(f.profile, 'champion'))
  const allies = roster.fighters.filter(f => f.profile.faction !== roster.faction)

  // Bladeborn fighters without a champion mark can only be added as allies if
  // a the bladeborn champion has been added. And in that case they don't
  // count toward the allies limit.
  const alliesForLimit = allies.filter(f => profileHasKeyword(f.profile, 'champion'))

  const availableBladeborn = roster.fighters.filter(f => profileHasKeyword(f.profile, 'champion')).map(f => f.profile.bladeborn).filter(b => b !== '')

  // Detects bladeborn fighters that are no more valid in the roster. IE: when
  // they've been added when they champion was in the roster and their champion
  // was then removed from the roster.
  const illicitBladebornFighters = roster.fighters.some(f => f.profile.faction !== roster.faction && f.profile.bladeborn !== '' && !availableBladeborn.includes(f.profile.bladeborn))

  return (
    <Container>
      <h2>{roster.name} ({roster.fighters.length} fighters | {totalCost}pts)</h2>
      <h3>{roster.faction} ({roster.alliance})</h3>
      <List>
        {totalCost <= 1000
          ? <List.Item>
              <List.Icon color="green" name="check circle" />
              <List.Content>Your band is 1000pts or less</List.Content>
            </List.Item>
          : <List.Item>
              <List.Icon color="red" name="exclamation circle" />
              <List.Content>Your band is more than 1000pts</List.Content>
            </List.Item>}
        {leader
          ? <List.Item>
              <List.Icon color="green" name="check circle" />
              <List.Content>Your band has a leader</List.Content>
            </List.Item>
          : <List.Item>
              <List.Icon color="red" name="exclamation circle" />
              <List.Content>Your band has no leader</List.Content>
            </List.Item>}
        {champions.length <= 3
          ? <List.Item>
              <List.Icon color="green" name="check circle" />
              <List.Content>Your band has 3 heroes or less</List.Content>
            </List.Item>
          : <List.Item>
              <List.Icon color="red" name="exclamation circle" />
              <List.Content>Your band has more than 3 heroes</List.Content>
            </List.Item>}
        {alliesForLimit.length <= 2
          ? <List.Item>
              <List.Icon color="green" name="check circle" />
              <List.Content>Your band has 2 allies or less</List.Content>
            </List.Item>
          : <List.Item>
              <List.Icon color="red" name="exclamation circle" />
              <List.Content>Your band has more than 2 allies</List.Content>
            </List.Item>}
         {illicitBladebornFighters &&
           <List.Item>
             <List.Icon color="red" name="exclamation circle" />
             <List.Content>You include bladeborn fighters without including their champion</List.Content>
           </List.Item>}
      </ List>
      <Header as="h4">Heroes</Header>
      <List>
        {champions.filter(f => !allies.includes(f)).map( f =>
          <FighterListItem context="remove" roster={roster} fighter={f} removeFighterFromRoster={props.removeFighterFromRoster} />
        )}
      </List>
      <Divider />
      <Header as="h4">Warriors</Header>
      <List>
        {roster.fighters.filter(f => !champions.includes(f) && !allies.includes(f)).map( f =>
          <FighterListItem context="remove" roster={roster} fighter={f} removeFighterFromRoster={props.removeFighterFromRoster} />
        )}
      </List>
      <Divider />
      <Header as="h4">Allies</Header>
      <List>
        {allies.map( f =>
          <FighterListItem context="remove" roster={roster} fighter={f} removeFighterFromRoster={props.removeFighterFromRoster} />
        )}
      </List>
    </Container>
  )
}
