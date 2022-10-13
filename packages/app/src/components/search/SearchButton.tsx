import { Text, Button } from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchButtonProps {
  onClick?: () => void;
}

const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <>
      <Button
        onClick={() => onClick?.()}
        _hover={{ borderColor: "gray.300" }}
        cursor="text"
        w="full"
        variant="solid"
        leftIcon={<MagnifyingGlassIcon />}
      >
        <Text w="full" color="gray.400" textAlign="left" fontWeight="normal">
          Search for a track
        </Text>
      </Button>
    </>
  );
};
export default SearchButton;
