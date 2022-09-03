import { Track } from "../_stores/nowPlaying"

interface TrackInfoProps {
	track: Track | null
}

const TrackInfo: React.FC<TrackInfoProps> = ({track}) => {
	if(track) {
		return (
			<div>
				<div className="font-bold">{track.title}</div>
				<div>By {track.artist}</div>
			</div>
		)
	} else {
		return (
			<></>
		)
	}
}

export default TrackInfo;