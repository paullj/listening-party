import React, { useEffect } from 'react';
import PlayerControls from '../components/PlayerControls';
import SearchInput from '../components/SearchInput';
import TrackInfo from '../components/TrackInfo';
import { useNowPlaying } from '../_stores/nowPlaying';
import { useQueue } from '../_stores/queue';

const Local = () => {
	const nowPlaying = useNowPlaying(({nowPlaying}) => nowPlaying)
	const queue = useQueue(({queue}) => queue)

  useEffect(() => {

		
		return () => {}
	}, []);

	return (
		<main className="w-screen h-screen">
			<TrackInfo track={nowPlaying ?? null}></TrackInfo>
			<PlayerControls></PlayerControls>
			<SearchInput></SearchInput>
			<div>
				{queue.map(({title, artist}, i) => (<li key={i}>{title} by {artist}</li>))}
			</div>
		</main>
	)
}

export default Local;