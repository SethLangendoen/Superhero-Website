import React, { useState } from 'react'

function HeroSearch(){

	const [name, setName] = useState('');
	const [race, setRace] = useState('');
	const [publisher, setPublisher] = useState('');
	const [power, setPower] = useState('');
	const [superheroes, setSuperheroes] = useState([]);
	const [selectedHero, setSelectedHero] = useState(null);

	
	const searchHeroes = () => {

		fetch('http://localhost:3000/heroSearch', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({name: name, race: race , publisher: publisher , power: power }),
		})
		.then(response => response.json())
		.then(data => {

			setSuperheroes(data); 
		
			}
		)
	}

	const showHeroDetails = (hero) => {
		setSelectedHero(hero);
	  };

	const searchOnDDG = (heroName) => {
		const ddgSearchURL = `https://duckduckgo.com/?q=${encodeURIComponent(heroName)}&ia=web`;
		window.open(ddgSearchURL, '_blank');
	};
	  

	return (
		<div>
			<input placeholder='Name' value = {name} onChange = {(e) => setName(e.target.value)}></input>
			<input placeholder='Race' value = {race} onChange = {(e) => setRace(e.target.value)}></input>
			<input placeholder='Publisher' value = {publisher} onChange = {(e) => setPublisher(e.target.value)}></input>
			<input placeholder='Power' value = {power} onChange = {(e) => setPower(e.target.value)}></input>
			<button id = 'Search' onClick = {searchHeroes}>Search Heroes</button>


			<ul>
				{superheroes.map((hero) => (
				<li key={hero.id} onClick={() => showHeroDetails(hero)}>
					<strong>{hero.name} - {hero.Publisher} <button onClick={() => searchOnDDG(hero.name)}>Search on DDG</button></strong>
					{selectedHero === hero && (
					<ul>
						<li>Gender: {hero.Gender}</li>
						<li>Eye Color: {hero['Eye color']}</li>
						<li>Race: {hero.Race}</li>
						<li>Hair Color: {hero['Hair Color']}</li>
						<li>Height: {hero.Height}</li>
						<li>Skin Color: {hero['Skin Color']}</li>
						<li>Alignment: {hero.Alignment}</li>
						<li>Weight: {hero.Weight}</li>
					</ul>
					)}
				</li>
				))}
      		</ul>
		</div>
	);

}

export default HeroSearch; 