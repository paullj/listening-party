import SpotifyWebApi from 'spotify-web-api-node';

const connectSpotify = () => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5000'
  });

  // Retrieve an access token
  spotifyApi.clientCredentialsGrant().then(
    (data) => {
      console.log(`The access token expires in ${data.body.expires_in}`);
      console.log(`The access token is ${data.body.access_token}`);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body.access_token);
    },
    (err) => {
      console.log(
        'Something went wrong when retrieving an access token',
        err.message
      );
    }
  );
  return spotifyApi;
};

export const spotifyApi = connectSpotify();
