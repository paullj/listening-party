import { useSelector } from "@xstate/react";
import { useCallback, useEffect, useState } from "react";
import { useQueueContext } from "../../context/QueueContext";

interface SpotifyWebPlaybackProps {}

const TOKEN =
  "BQDbwga1hOWlpun9_zEQsspCltmsm5M2mqGq78YIw-6XnmIEdM1zL_tqDIknXGb0W1D3XHKC45mL7HAIrhpUiPurJU8MyvO9uyMNNVZ8PlsgcXUQbs33RyDErmntqUS6z0ZGjHMTk6RT2ycDWjtO9X4VVlQFlnzWjWmczxYrfvskBdovq8rv3yQc_YehMOqE4UM";

const SpotifyWebPlayback = (props: SpotifyWebPlaybackProps) => {
  const [isReady, setReady] = useState(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string>();
  const [playbackState, setPlaybackState] =
    useState<Spotify.PlaybackState | null>(null);

  const queueService = useQueueContext();
  const nowPlaying = useSelector(
    queueService,
    (state) => state.context.nowPlaying
  );
  const isPlaying = useSelector(
    queueService,
    (state) => state.context.isPlaying
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setReady(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (player === null) return;

    const ready = (device: Spotify.WebPlaybackInstance) => {
      setDeviceId(device.device_id);
    };

    const notReady = (device: Spotify.WebPlaybackInstance) => {
      setDeviceId(device.device_id);
    };
    const playerStateChanged = (state: Spotify.PlaybackState) => {
      setPlaybackState(state);
    };

    player.addListener("ready", ready);
    player.addListener("not_ready", notReady);
    player.addListener("player_state_changed", playerStateChanged);

    return () => {
      player.removeListener("ready", ready);
      player.removeListener("not_ready", notReady);
      player.removeListener("player_state_changed", playerStateChanged);
    };
  }, [player]);

  useEffect(() => {
    if (isReady) {
      const player = new Spotify.Player({
        name: "Test Device",
        getOAuthToken: (callback) => callback(TOKEN),
        volume: 0.5,
      });

      setPlayer(player);
      player.connect();

      return () => player.disconnect();
    }
  }, [isReady]);

  useEffect(() => {
    if (nowPlaying && deviceId) {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [nowPlaying.uri] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
    }
  }, [nowPlaying, deviceId]);

  useEffect(() => {
    if (player === null) return;

    if (playbackState?.paused) return;

    const intervalId = window.setInterval(async () => {
      const newState = await player.getCurrentState();
      setPlaybackState(newState);
      queueService.send({
        type: "SET_ELAPSED",
        time: newState?.position ?? 0,
      });
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [player, playbackState?.paused]);

  useEffect(() => {
    if (!playbackState) return;
    if (!player) return;

    if (isPlaying !== !playbackState.paused) {
      if (!isPlaying) {
        player.pause();
      } else {
        player.togglePlay();
      }
    }
  }, [isPlaying, playbackState?.paused]);

  return <></>;
};

export default SpotifyWebPlayback;
