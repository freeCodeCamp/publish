import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  Input,
  useDisclosure,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PostSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Button
        onClick={onOpen}
        rightIcon={<FontAwesomeIcon icon={faSearch} />}
        iconSpacing={0}
        variant={"ghost"}
      ></Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <InputGroup>
            <InputLeftElement pointerEvents={"none"} className="InputLeft">
              <SearchIcon color={"gray.300"} />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange}
              size="lg"
            />
          </InputGroup>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostSearch;
