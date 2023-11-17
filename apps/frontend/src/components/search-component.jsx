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
  Text,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllPosts } from "@/lib/posts";
import { isEditor } from "@/lib/current-user";
import NextLink from "next/link";

const PostSearch = ({ user }) => {
  const [posts, setPosts] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const search = async (query) => {
    const contributorFilter = {
      author: isEditor(user)
        ? {}
        : {
            id: {
              $eq: user.id,
            },
          },
    };

    const result = await getAllPosts(user.jwt, {
      publicationState: "preview",
      fields: ["title", "id"],
      populate: ["author"],
      filters: {
        title: {
          $containsi: query,
        },
        ...contributorFilter,
      },
      pagination: {
        pageSize: 5,
      },
    });

    setPosts(result.data);
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
              onChange={(query) => search(query.target.value)}
              size="lg"
            />
          </InputGroup>
          {posts.map((post) => (
            <Card as={NextLink} href={`/posts/${post.id}`} key={post.id}>
              <CardBody>
                <Text>{post.attributes.title}</Text>
              </CardBody>
            </Card>
          ))}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostSearch;
