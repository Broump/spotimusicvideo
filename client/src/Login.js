import React from "react";
import { Button, Center } from "@mantine/core";
import { BrandSpotify } from "tabler-icons-react";

const AUTH_URL =
	"https://accounts.spotify.com/authorize?client_id=4e7f97ca8905491ebc4e89f1674658dd&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
	return (
		<Center>
			<Button
				component="a"
				color="green"
				href={AUTH_URL}
				variant="outline"
				rightIcon={<BrandSpotify size={14} />}
			>
				Login With Spotify{" "}
			</Button>
		</Center>
	);
}
