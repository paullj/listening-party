import { Button, IconButton, Tooltip } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import React from "react";
import { useFeedContext } from "../../context/FeedContext";
import { useRoomContext } from "../../context/RoomContext";
import { useBroadcastAction } from "../../hooks/useBroadcastAction";
import { useSendAction } from "../../hooks/useSendAction";
import { ReloadIcon } from "@radix-ui/react-icons";
interface SyncButtonProps {}

const SyncButton = (props: SyncButtonProps) => {
  const roomContext = useRoomContext();
  const feedContext = useFeedContext();
  const actions = useSelector(feedContext, (state) => state.context.feed);
  const requestSyncAction = useSendAction("RequestSync");
  const syncAction = useBroadcastAction("Sync");

  const { userId, hostId } = useSelector(roomContext, (state) => state.context);

  const handleRequestSync = () => {
    requestSyncAction(hostId, { userId });
  };

  const handleSync = () => {
    syncAction(actions);
  };
  return (
    <>
      <Tooltip
        hasArrow
        placement="right"
        label={hostId === userId ? "Sync Feed" : "Request Sync Feed"}
      >
        <IconButton
          onClick={() =>
            hostId === userId ? handleSync() : handleRequestSync()
          }
          size="sm"
          variant="ghost"
          icon={<ReloadIcon />}
          aria-label={""}
        />
      </Tooltip>
      {/* {hostId === userId ? (
        <Button onClick={() => handleSync()}>Sync</Button>
      ) : (
        <Button onClick={() => handleRequestSync()}>Request Sync</Button>
      )} */}
    </>
  );
};
export default SyncButton;
