const dropdownContainer = document.querySelector('.player-options');
const playerName = document.querySelector('.player-name');
const playerPosition = document.querySelector('.player-position');
const playerPicture = document.querySelector('.player-picture');
const teamLogo = document.querySelector('.team-logo');
const appearances = document.querySelector('.appearances');
const goals = document.querySelector('.goals');
const assists = document.querySelector('.assists');
const goalsPerMatch = document.querySelector('.goals-per-match');
const passesPerMinute = document.querySelector('.passes-per-minute');

const populatePlayerOptions = data => {
  data.players.forEach(item => {
    const option = document.createElement("option");
  
    option.value = item.player.id;
    option.innerText = `${item.player.name.first} ${item.player.name.last}`;
  
    dropdownContainer.appendChild(option);
  });
}

const getStat = (data, stat) =>  {
  const value = data.stats.find(item => item.name === stat)?.value;

  if (!value) return 0;
  
  return value;
};

const getPositionName = position => {
  switch(position) {
    case 'D':
      return 'Defender';
    case 'M':
      return 'Midfielder';
    case 'F':
      return 'Striker';
    default:
      return '';
  }
}

const getPlayerData = data => {
  const totalGoals = getStat(data, 'goals');
  const totalAppearances = getStat(data, 'appearances');
  const totalAssists = getStat(data, 'goal_assist');
  const passes = getStat(data, 'fwd_pass');
  const minsPlayed = getStat(data, 'mins_played');
  const currentTeam = data.player.currentTeam.shortName.replace(/\s/g, '').toLowerCase();

  playerName.innerText = `${data.player.name.first} ${data.player.name.last}`;
  playerPosition.innerText = getPositionName(data.player.info.position);
  playerPicture.src = `./images/p${data.player.id}.png`;
  playerPicture.alt = `${data.player.name.first} ${data.player.name.last} picture`;
  teamLogo.style.backgroundImage = `url('./images/${currentTeam}.png')`; // url('./images/spurs.png')
  
  appearances.innerText = totalAppearances;
  goals.innerText = totalGoals;
  assists.innerText = totalAssists;
  goalsPerMatch.innerText = (totalGoals / totalAppearances).toFixed(2);
  passesPerMinute.innerText = (passes / minsPlayed).toFixed(2);
}

const fetchPlayerData = async () => {
  const data = await (await fetch('./player-stats.json')).json();

  populatePlayerOptions(data);

  getPlayerData(data.players[0]);

  dropdownContainer.addEventListener('change', e => {
    const playerInfo = data.players.find(item => item.player.id == e.target.value);
  
    getPlayerData(playerInfo);
  });
}

fetchPlayerData();
