import express from "express";
import fetch from "cross-fetch";
import { generateRandomString } from "../../utils/generateRandomString";

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

if (!spotify_client_id || !spotify_client_secret || !spotify_redirect_uri)
	throw "SPOTIFY ENV VARIABLES NOT SET!";

const spotify = express.Router();

spotify.get("/login", (request, response) => {
	console.log("a");
	const scope = "streaming user-read-email user-read-private";
	const state = generateRandomString(16);

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

let access_token = "";

spotify.get("/callback", (request, response) => {
	const form = new FormData();
	form.append("code", request.query.code as string);
	form.append("redirect_uri", spotify_redirect_uri);
	form.append("grant_type", "authorization_code");

	fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		body: form,
		headers: {
			Authorization:
				"Basic " +
				Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
					"base64"
				),
			"Content-Type": "application/x-www-form-urlencoded",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			access_token = data.access_token!;
			response.redirect("/");
		});
});

spotify.get("/token", (request, response) => {
	response.status(200).json({ access_token: access_token });
});

export default spotify;
