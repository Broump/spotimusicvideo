import ReactPlayer from "react-player/youtube";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";

function Dashboard({ code }) {
	const accessToken = useAuth(code);
	const [spotifyData, setSpotifyData] = useState([]);
	const spotifyApi = new SpotifyWebApi({
		clientId: "4e7f97ca8905491ebc4e89f1674658dd",
	});

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken) return;
		async function getSpotifyData() {
			await axios
				.post("http://localhost:3001/api/get-spotify-data", {
					accessToken: accessToken,
				})
				.then((result) => setSpotifyData(JSON.parse(result.data)));
		}
		getSpotifyData();
		const interval = setInterval(() => getSpotifyData(), 1000);
		return () => {
			clearInterval(interval);
		};
	}, [accessToken]);

	return (
		<div>
			<Login />

			<div className="App">
				<header className="App-header">
					<ReactPlayer
						allow="autoplay"
						muted={true}
						playing={true}
						allowFullScreen="1"
						url={spotifyData.link}
						width="1280px"
						height="720px"
					/>
					<p>Trackname: {spotifyData.track_name}</p>
					<p>Artists: {spotifyData.artists}</p>
					<p>Progress: {spotifyData.progress_s | 0} s</p>
				</header>
			</div>
		</div>
	);
}

export default Dashboard;
