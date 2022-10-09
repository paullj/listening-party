import { useCallback } from "react";
import SpotifyWebPlayer from "react-spotify-web-playback";

interface SpotifyWebPlaybackProps {}

const TOKEN =
	"BQCX3Ig5ZEAvIuz780VrMG1p1X6UDQZTuFpPYhpLzrf1kzlQAM6h0BNd-Kzi4Mwv6fvF0EKCNsnPMMvIGEmSQgMmzLrfh_P2w7RGcatOtXG1nBgwvvkFv8eox4aONXlrjsf-aRhtmY0amEb7uirSFJNStIQ3_b3cxR0N7m9BITvR9GC_fphW8f_KgOuTXjt2Ovq0IeaiI1u29w9leYCPd0lHxX4LFA";

const SpotifyWebPlayback = (props: SpotifyWebPlaybackProps) => {
	return (
		<SpotifyWebPlayer
			token={TOKEN}
			uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
		></SpotifyWebPlayer>
	);
};

export default SpotifyWebPlayback;
