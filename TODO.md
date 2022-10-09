Features
- [x] Add Chakra UI
- [x] Add idea of owner of room
- [x] Add tracks to rooms
- [x] Get connections on room enter
- [x] Send tracks over RTC
- [x] Sync of data in room
- [ ] Add votes to tracks
- [ ] Ping/pong to check if user is alive
- [ ] Delete empty rooms

- [ ] Restrict backend to certain domains
- [ ] Auth: Spotify, Deezer, Youtube
- [ ] Use redis for caching and maybe also rooms??????

Bugs
- Dark mode colours for lots of things need adjusting
- Requesting sync seems out of whack, doesn;t update after initial


Search results

- Search cache first
- Search on LastFm
	- For each result
		- Look for links to streaming services on Lastfm or musicbrainz
			- Check if they have the same data
		- Finally:
			- Search using our each of our providers
		- Save it in our cache