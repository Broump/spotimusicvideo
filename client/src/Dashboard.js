import ReactPlayer from "react-player/youtube";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import { Button, Card, Image, Text } from "@mantine/core";
import { Resize, PlayerPlay, PlayerStop } from "tabler-icons-react";
import { useViewportSize, useFullscreen, useScrollLock } from "@mantine/hooks";

function Dashboard({ code }) {
	const accessToken = useAuth(code);
	const [spotifyData, setSpotifyData] = useState([]);
	const [startStop, setStartStop] = useState(false);
	const [playing, setPlaying] = useState(false);
	const { toggle, fullscreen } = useFullscreen();
	const [scrollLocked, setScrollLocked] = useScrollLock(true);
	const spotifyApi = new SpotifyWebApi({
		clientId: "4e7f97ca8905491ebc4e89f1674658dd",
	});

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken) return;
		if (startStop) {
			setPlaying(true);
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
		} else {
			setPlaying(false);
		}
	}, [accessToken, startStop]);

	const { height, width } = useViewportSize();

	return (
		<div>
			{fullscreen ? (
				<p className="hide"></p>
			) : (
				<div>
					<Button
						leftIcon={<Resize size={14} />}
						variant="outline"
						onClick={toggle}
						color={fullscreen ? "red" : "blue"}
					>
						{fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
					</Button>
					{startStop ? (
						<Button
							onClick={() => setStartStop(false)}
							variant="outline"
							leftIcon={<PlayerStop size={14} />}
							color="red"
						>
							Stop
						</Button>
					) : (
						<Button
							onClick={() => setStartStop(true)}
							variant="outline"
							leftIcon={<PlayerPlay size={14} />}
							color="green"
						>
							Start
						</Button>
					)}
				</div>
			)}

			<div className="holder">
				<div>
					<ReactPlayer
						allow="autoplay"
						muted={true}
						playing={playing}
						url={spotifyData.link}
						width={width}
						height={height}
						className="frame"
					/>
				</div>
				<div className="bar" id="Card">
					<Card>
						<Card.Section>
							<Image src={spotifyData.album_cover} height={160} />
						</Card.Section>
						<Text weight={500}>Trackname: {spotifyData.track_name}</Text>
						<Text>Artists: {spotifyData.artists}</Text>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
