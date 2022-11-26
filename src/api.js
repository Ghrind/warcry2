import { v1 as uuidv1 } from 'uuid'

export function profileHasKeyword(profile, keyword) {
  if (profile === undefined || profile.keywords === undefined) {
    return false
  }
  return profile.keywords.split(',').map( kw => kw.toLowerCase() ).includes(keyword.toLowerCase());
}

export function profileHasKeywords(profile, keywords) {
  var safeKeywords = keywords.filter(k => k !== '')
  return(safeKeywords.every(k => profileHasKeyword(profile, k)));
}

export function profileCanUseAbility(profile, ability) {
  return(profile.faction === ability.faction && profileHasKeywords(profile, ability.keywords.split(',')) && (ability.bladeborn === "" || ability.bladeborn === profile.bladeborn))
}

export function getLeader(roster) {
  return(roster.fighters.find(f => profileHasKeyword(f.profile, 'hero') && (roster.faction === '' || f.profile.faction === roster.faction)));
}

export function removeFighterFromRoster(roster, fighterId) {
  const fighters = roster.fighters.filter(f => f.id !== fighterId);
  return(updateLeader({...roster, fighters: fighters}))
}
export function updateLeader(roster) {
  var faction = '';
  var alliance = '';

  // Leaders must have the hero runemark and not be an ally
  var leader = roster.fighters.find(f => profileHasKeyword(f.profile, 'hero'));

  if( leader ) {
    faction = leader.profile.faction;
    alliance = leader.profile.alliance;
  }
  return({...roster, faction: faction, alliance: alliance})
}

export function addFighterToRoster(roster, profile) {
  const fighter = {
    id: uuidv1(),
    profile: profile,
  };
  return(updateLeader({...roster, fighters: [...roster.fighters, fighter]}))
}

export function initEmptyRoster(roster) {
  return({
    fighters: [],
    faction: '',
    alliance: '',
  })
}

export function initRosterByIds(profiles, profileIds) {
  var roster = initEmptyRoster();
  profileIds.map(profileId => {
    roster = addFighterToRoster(roster, profiles.find(f => f.profileId === profileId));
  })
  return(roster)
}
