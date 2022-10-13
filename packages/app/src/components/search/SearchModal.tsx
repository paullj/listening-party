import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  InputLeftElement,
  InputGroup,
  Stack,
  Button,
  Text,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ChangeEventHandler, useState } from "react";
import { useQueueContext } from "../../context/QueueContext";
import { useBroadcastAction } from "../../hooks/useBroadcastAction";
import type { Track } from "../../models/track";
import TrackItem from "../shared/TrackItem";
import { useSearch } from "../../hooks/useSearch";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const queueContext = useQueueContext();
  const addTrackToQueueAction = useBroadcastAction("AddTrackToQueue");

  const { results, isLoading } = useSearch(query);

  const handleChangeQuery: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setQuery(value);
  };

  const handleAddToQueue = (track: Omit<Track, "createdAt" | "createdBy">) => {
    const action = addTrackToQueueAction(track);

    queueContext.send({
      type: "ADD_TO_QUEUE",
      action,
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody py={5}>
            <InputGroup variant="flushed">
              <InputLeftElement
                color="gray.700"
                pointerEvents="none"
                children={<MagnifyingGlassIcon />}
              />
              <Input
                placeholder="Search for a track"
                value={query}
                onChange={handleChangeQuery}
              />
            </InputGroup>
            {isLoading || results?.length > 0 ? (
              <Stack mt={4}>
                {isLoading ? (
                  <Text>Loading...</Text>
                ) : (
                  results.map((track, i) => (
                    <TrackItem key={i} {...track}>
                      <Button size="sm" onClick={() => handleAddToQueue(track)}>
                        Add
                      </Button>
                    </TrackItem>
                  ))
                )}
              </Stack>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SearchModal;
