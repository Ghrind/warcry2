import { useContext, useState, useEffect } from 'react'
import { getLeader, profileHasKeyword, profileCanUseAbility } from './api'
import { List, Divider, Container, Header } from 'semantic-ui-react'
import { FighterListItem } from './FighterListItem'
import { compendiumContext } from './compendiumContext'
import { replaceRuneInText } from './Rune'

export function Roster(props) {
  const compendium = useContext(compendiumContext);
  const roster = props.roster
  const abilities = compendium.abilities.filter(a => roster.fighters.some(f => profileCanUseAbility(f.profile, a)))
  const totalCost = roster.fighters.map(f => f.profile.cost).reduce((a, b) => a + parseInt(b), 0);
  const leader = getLeader(roster)
  const heroes = roster.fighters.filter(f => profileHasKeyword(f.profile, 'hero'))
  const allies = roster.fighters.filter(f => f.profile.faction !== roster.faction)

  // Bladeborn fighters without a hero mark can only be added as allies if
  // a the bladeborn hero has been added. And in that case they don't
  // count toward the allies limit.
  const alliesForLimit = allies.filter(f => profileHasKeyword(f.profile, 'hero') || profileHasKeyword(f.profile, 'ally'))

  const availableBladeborn = roster.fighters.filter(f => profileHasKeyword(f.profile, 'hero')).map(f => f.profile.bladeborn).filter(b => b !== '')

  // Detects bladeborn fighters that are no more valid in the roster. IE: when
  // they've been added when their hero was in the roster and it was then
  // removed from the roster.
  const illicitBladebornFighters = roster.fighters.some(f => f.profile.faction !== roster.faction && f.profile.bladeborn !== '' && !availableBladeborn.includes(f.profile.bladeborn))

  const thralls = roster.fighters.filter(f => profileHasKeyword(f.profile, 'thrall'))

  return (
    <Container>
      <h2>{roster.name} ({roster.fighters.length} fighters | {totalCost}pts)</h2>
      <h3>{roster.faction} ({roster.alliance})</h3>
      <List>
        {totalCost <= 1000
          ? <List.Item>
              <List.Icon color="green" name="check circle" />
              <List.Content>Your band is 1000pts or less ({1000 - totalCost} pts remaining)</List.Content>
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
        {heroes.length <= 3
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
             <List.Content>You include bladeborn fighters without including their hero</List.Content>
           </List.Item>}
         {thralls.length > 3 &&
           <List.Item>
             <List.Icon color="red" name="exclamation circle" />
             <List.Content>Your band has more than 3 thralls</List.Content>
           </List.Item>}
      </ List>
      <Header as="h4">Heroes</Header>
      <List>
        {heroes.filter(f => !allies.includes(f)).map( f =>
          <FighterListItem context="remove" roster={roster} fighter={f} removeFighterFromRoster={props.removeFighterFromRoster} leader={leader && leader.id === f.id } />
        )}
      </List>
      <Divider />
      <Header as="h4">Warriors</Header>
      <List>
        {roster.fighters.filter(f => !heroes.includes(f) && !allies.includes(f)).map( f =>
          <FighterListItem context="remove" roster={roster} fighter={f} removeFighterFromRoster={props.removeFighterFromRoster} leader={leader && leader.id === f.id } />
        )}
      </List>
      <Divider />
      <Header as="h4">Allies / Thralls</Header>
      <List>
        {allies.map( f =>
          <FighterListItem context="remove" roster={roster} fighter={f} removeFighterFromRoster={props.removeFighterFromRoster} leader={leader && leader.id === f.id } />
        )}
      </List>
      <Header as="h3">Abilities</Header>
      <List divided>
        {abilities.map( a =>
          <List.Item>
            <b>[{a.roll}] {a.ability}: </b>
            {replaceRuneInText(a.description)}
            <br />
            <i>Used by: {[...new Set(roster.fighters.filter(f => profileCanUseAbility(f.profile, a)).map(f => f.profile.name))].join(", ")}</i>
          </List.Item>
        )}
      </List>

    </Container>
  )
}
