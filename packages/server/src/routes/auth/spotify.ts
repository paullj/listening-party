import express from "express";
import fetch from "cross-fetch";
import { generateRandomString } from "../../utils/generateRandomString";

var STATE_KEY = "spotify_auth_state";

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

if (!spotify_client_id || !spotify_client_secret || !spotify_redirect_uri)
  throw "SPOTIFY ENV VARIABLES NOT SET!";

const spotify = express.Router();

spotify.get("/login", (request, response) => {
  const scope = "streaming user-read-email user-read-private";
  const state = generateRandomString(16);
  response.cookie(STATE_KEY, state);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  response.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

spotify.get("/callback", (request, response) => {
  const code = (request.query.code as string) || "";
  const state = (request.query.state as string) || null;
  const storedState: string | null = request.cookies[STATE_KEY] ?? null;

  if (state === null || state !== storedState) {
    response.send("Error! State mismatch");
  } else {
    response.clearCookie(STATE_KEY);

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: JSON.stringify({
        code,
        redirect_uri: spotify_redirect_uri,
        grant_type: "authorization_code",
      }),
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${spotify_client_id}:${spotify_client_secret}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.status === 200) {
        const { access_token, refresh_token } = await response.json();
      } else {
        console.log(response.statusText);
      }
    });
    // .then((data) => {
    //   console.log(data);
    //   response.cookie("spotify_access_token", data.access_token!, {
    //     maxAge: 60 * 60 * 1000,
    //     httpOnly: true,
    //   });
    //   response.redirect("/auth/spotify/success");
    // });
  }
});

spotify.get("/token", (request, response) => {
  const accessToken: string = request.cookies["spotify_access_token"];

  if (accessToken) {
    response.json({
      accessToken,
    });
  } else {
    response.status(500).end();
  }
});

export default spotify;
