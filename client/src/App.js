import logo from "./logo.svg";
import "./App.css";
import ReactPlayer from "react-player/youtube";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
	const [spotifyData, setSpotifyData] = useState([]);

	useEffect(() => {
		async function getSpotifyData() {
			await axios
				.post("http://localhost:3001/api/get-spotify-data")
				.then((result) => setSpotifyData(JSON.parse(result.data)));
		}
		getSpotifyData();
		const interval = setInterval(() => getSpotifyData(), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<ReactPlayer
					allow="autoplay"
					muted={true}
					playing={true}
					allowfullscreen="1"
					url={spotifyData.link}
					width="1280px"
					height="720px"
				/>
				<p>Trackname: {spotifyData.track_name}</p>
				<p>Artists: {spotifyData.artists}</p>
				<p>Progress: {spotifyData.progress_s | 0} s</p>
			</header>
		</div>
	);
}

export default App;
