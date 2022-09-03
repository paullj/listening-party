import { useNowPlaying } from "../_stores/nowPlaying"

export default () => {
	const {isPlaying, play, pause, next} = useNowPlaying();

	return (
		<form onSubmit={(event) => event.preventDefault()}>
			{!isPlaying ? <button onClick={play}>Play</button> : <button onClick={pause}>Pause</button>}
			<button onClick={next}>Next</button>
		</form>
	)
}