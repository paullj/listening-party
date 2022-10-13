## Features
- [x] Add Chakra UI
- [x] Add idea of owner of room
- [x] Add tracks to rooms
- [x] Get connections on room enter
- [x] Send tracks over RTC
- [x] Sync of data in room
- [ ] Add votes to tracks
	- [ ] Make votes for pause and skip as well
- [ ] Ping/pong to check if user is alive
- [ ] Delete empty rooms

- [ ] Auth: Spotify, Deezer, Youtube
- [ ] Use redis for caching and maybe also rooms??????

- [x] Add prettier
- [x] Add eslint
- [x] Add Jest
- [x] Add Husky

## Bugs
- Dark mode colours for lots of things need adjusting
- Requesting sync seems out of whack, doesn't update after initial

## Other ideas
### Search results
- Search cache first
- Search on LastFm
	- For each result
		- Look for links to streaming services on Lastfm or musicbrainz
			- Check if they have the same data
		- Finally:
			- Search using our each of our providers
		- Save it in our cache