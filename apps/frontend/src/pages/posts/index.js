import {
  Badge,
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  FormControl,
  Grid,
  Heading,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  useToast,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { faChevronDown, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import intlFormatDistance from "date-fns/intlFormatDistance";
import { getServerSession } from "next-auth/next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import NavMenu from "@/components/nav-menu";
import Pagination from "@/components/pagination";
import { isEditor } from "@/lib/current-user";
import { createPost, getAllPosts, getUserPosts } from "@/lib/posts";
import { getTags } from "@/lib/tags";
import { getUsers } from "@/lib/users";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const Icon = chakra(FontAwesomeIcon);

const sortButtonNames = {
  newest: "Newest",
  oldest: "Oldest",
  updated: "Recently updated",
};

const postButtonText = {
  all: "All posts",
  draft: "Drafts posts",
  published: "Published posts",
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // handle filtering posts on Strapi side (not NextJS side)
  const queryHandler = (queries) => {
    const filterQuery = {};

    for (const [key, value] of Object.entries(queries)) {
      if (key === "publishedAt") {
        if (value === "draft") {
          filterQuery[key] = {
            $notNull: false,
          };
        }

        if (value === "published") {
          filterQuery[key] = {
            $notNull: true,
          };
        }
      }

      if (key === "author") {
        filterQuery[key] = {
          slug: {
            $eq: value,
          },
        };
      }

      if (key === "tags") {
        filterQuery[key] = {
          slug: {
            $in: value,
          },
        };
      }
    }

    return filterQuery;
  };

  const sortHandler = (sortBy) => {
    if (sortBy === "oldest") {
      return ["createdAt"];
    } else if (sortBy === "updated") {
      return ["updatedAt:desc"];
    } else {
      return ["createdAt:desc"];
    }
  };

  const [posts, usersData, tagsData] = await Promise.all([
    isEditor(session.user)
      ? getAllPosts(session.user.jwt, {
          publicationState: "preview",
          fields: ["id", "title", "slug", "publishedAt", "updatedAt"],
          populate: ["author", "tags"],
          filters: {
            ...queryHandler(context.query),
          },
          sort: sortHandler(context.query.sortBy),
          pagination: {
            page: context.query.page || 1,
            pageSize: context.query.pageSize || 5,
          },
        })
      : getUserPosts(session.user.jwt, {
          publicationState: "preview",
          fields: ["id", "title", "slug", "publishedAt", "updatedAt"],
          populate: ["author", "tags"],
          filters: {
            author: session.user.id,
            ...queryHandler(context.query),
          },
          sort: sortHandler(context.query.sortBy),
          pagination: {
            page: context.query.page || 1,
            pageSize: context.query.pageSize || 5,
          },
        }),
    getUsers(session.user.jwt, {
      fields: ["id", "name", "slug"],
    }),
    getTags(session.user.jwt, {
      fields: ["id", "name", "slug"],
      pagination: {
        limit: -1,
      },
    }),
  ]);

  return {
    props: {
      posts,
      usersData,
      tagsData,
      user: session.user,
      queryParams: context.query,
      pagination: posts.meta,
    },
  };
}

const FilterButton = ({ text, ...props }) => {
  return (
    <MenuButton
      as={Button}
      rightIcon={<Icon icon={faChevronDown} fixedWidth />}
      bgColor="white"
      borderRadius="md"
      fontSize="14px"
      pl="20px"
      pr="10px"
      textAlign="left"
      boxShadow="sm"
      position="unset"
      _hover={{
        boxShadow: "md",
      }}
      _active={{
        bgColor: "white",
      }}
      {...props}
    >
      {text}
    </MenuButton>
  );
};

export default function IndexPage({
  posts,
  usersData,
  tagsData,
  user,
  queryParams,
  pagination,
}) {
  const router = useRouter();
  const toast = useToast();

  const [searchedTags, setSearchedTags] = useState([]);
  const [hasSearchedTags, setHasSearchedTags] = useState(
    queryParams?.tags ? true : false,
  );

  const [searchedAuthors, setSearchedAuthors] = useState([]);
  const [hasSearchedAuthors, setHasSearchedAuthors] = useState(
    queryParams?.author ? true : false,
  );

  const [postType, setPostType] = useState(queryParams?.publishedAt || "all");
  const [sortBy, setSortBy] = useState(queryParams?.sortBy || "newest");
  const [tagInputText, setTagInputText] = useState(
    queryParams.tags && queryParams.tags !== "all"
      ? selectedTagName(queryParams.tags)
      : "",
  );
  const [authorInputText, setAuthorInputText] = useState(
    queryParams.author && queryParams.author !== "all"
      ? selectedAuthorName(queryParams.author)
      : "",
  );

  const [resultsPerPage, setResultsPerPage] = useState(
    queryParams.pageSize || "5",
  );

  function selectedTagName(tagSlug) {
    const tag = tagsData.data.find((tag) => tag.attributes.slug === tagSlug);
    return tag.attributes.name;
  }

  function selectedAuthorName(authorSlug) {
    const author = usersData.find((user) => user.slug === authorSlug);
    return author.name;
  }

  // handle filtering tags and authors in searchbar
  const handleFilter = (filterType, value) => {
    const params = { ...queryParams };

    if (filterType === "tags") {
      if (value === "all") {
        setHasSearchedTags(false);
        setTagInputText("");
        delete params[filterType];
      } else {
        setHasSearchedTags(true);
        setTagInputText(selectedTagName(value));
        params[filterType] = value;
      }
    }

    if (filterType === "author") {
      if (value === "all") {
        setHasSearchedAuthors(false);
        setAuthorInputText("");
        delete params[filterType];
      } else {
        setHasSearchedAuthors(true);
        setAuthorInputText(selectedAuthorName(value));
        params[filterType] = value;
      }
    }

    if (filterType === "publishedAt") {
      setPostType(value);
      if (value === "all") {
        delete params[filterType];
      } else {
        params[filterType] = value;
      }
    }

    if (filterType === "sortBy") {
      setSortBy(value);
      if (value === "newest") {
        delete params[filterType];
      } else {
        params[filterType] = value;
      }
    }

    if (filterType === "resultsPerPage") {
      setResultsPerPage(value);
      params["page"] = 1;
      params["pageSize"] = value;
    }

    router.replace({
      pathname: router.pathname,
      query: params,
    });
  };

  // handle filtering posts on NextJS side (not Strapi side)
  const handleShallowFilter = async (filterType, value) => {
    if (filterType == "tags") {
      const newtags = tagsData.data.filter((tag) =>
        tag.attributes.name.toLowerCase().startsWith(value.toLowerCase()),
      );

      setSearchedTags(newtags);
      setTagInputText(value);
    }

    if (filterType == "author") {
      const newUsers = usersData.filter((user) =>
        user.name.toLowerCase().startsWith(value.toLowerCase()),
      );

      setSearchedAuthors(newUsers);
      setAuthorInputText(value);
    }
  };

  const newPost = async () => {
    const nonce = uuidv4();
    const token = user.jwt;

    const data = {
      data: {
        title: "(UNTITLED)",
        slug: nonce,
        body: "",
        tags: [],
        author: [user.id],
      },
    };

    try {
      const res = await createPost(data, token);

      router.push(`/posts/${res.data.id}`);
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bgColor="gray.200">
      <NavMenu user={user} />

      <Box ml={{ base: 0, md: "300px" }} px="6">
        <Flex
          alignItems="center"
          minH="20"
          position="sticky"
          top="0"
          bgColor="gray.200"
          zIndex={3}
        >
          <Heading>Posts</Heading>
          <Spacer />
          <Button colorScheme="blue" onClick={newPost}>
            New Post
          </Button>
        </Flex>

        <Grid
          my="4"
          gap="3"
          gridTemplateColumns={{
            base: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
          }}
        >
          {isEditor(user) && (
            <>
              <Menu>
                <FilterButton text={postButtonText[postType]} />
                <MenuList zIndex={2}>
                  <MenuOptionGroup
                    value={postType}
                    type="radio"
                    name="postType"
                    onChange={(value) => {
                      handleFilter("publishedAt", value);
                    }}
                  >
                    <MenuItemOption value="all">All posts</MenuItemOption>
                    <MenuItemOption value="draft">Drafts posts</MenuItemOption>
                    <MenuItemOption value="published">
                      Published posts
                    </MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>

              <FormControl w="70">
                <AutoComplete
                  openOnFocus
                  restoreOnBlurIfEmpty={false}
                  onSelectOption={({ item }) =>
                    handleFilter("author", item.value)
                  }
                >
                  <InputGroup>
                    <AutoCompleteInput
                      variant="outline"
                      placeholder="Filter by Author"
                      value={authorInputText}
                      backgroundColor="white"
                      fontSize="14px"
                      fontWeight="600"
                      onChange={(event) =>
                        handleShallowFilter("author", event.target.value)
                      }
                    />
                    <InputRightElement>
                      <Icon
                        icon={hasSearchedAuthors ? faClose : faChevronDown}
                        onClick={() => handleFilter("author", "all")}
                        fixedWidth
                      />
                    </InputRightElement>
                  </InputGroup>
                  <AutoCompleteList>
                    {(searchedAuthors.length > 0 ? searchedAuthors : usersData)
                      .slice(0, 25)
                      .map((author) => (
                        <AutoCompleteItem
                          key={`option-${author.id}`}
                          value={author.slug}
                          textTransform="capitalize"
                        >
                          {author.name}
                        </AutoCompleteItem>
                      ))}
                  </AutoCompleteList>
                </AutoComplete>
              </FormControl>
            </>
          )}
          <FormControl w="70">
            <AutoComplete
              openOnFocus
              restoreOnBlurIfEmpty={false}
              onSelectOption={({ item }) => handleFilter("tags", item.value)}
            >
              <InputGroup>
                <AutoCompleteInput
                  variant="outline"
                  placeholder="Filter by Tag"
                  value={tagInputText}
                  backgroundColor="white"
                  fontSize="14px"
                  fontWeight="600"
                  onChange={(event) => {
                    handleShallowFilter("tags", event.target.value);
                  }}
                />
                <InputRightElement>
                  <Icon
                    icon={hasSearchedTags ? faClose : faChevronDown}
                    fixedWidth
                    onClick={() => handleFilter("tags", "all")}
                  />
                </InputRightElement>
              </InputGroup>
              <AutoCompleteList>
                {(searchedTags.length > 0 ? searchedTags : tagsData.data)
                  .slice(0, 25)
                  .map((tag) => (
                    <AutoCompleteItem
                      key={`option-${tag.id}`}
                      value={tag.attributes.slug}
                      textTransform="capitalize"
                    >
                      {tag.attributes.name}
                    </AutoCompleteItem>
                  ))}
              </AutoCompleteList>
            </AutoComplete>
          </FormControl>
          <Menu>
            <FilterButton text={`Sort by: ${sortButtonNames[sortBy]}`} />
            <MenuList zIndex={2}>
              <MenuOptionGroup
                value={sortBy}
                type="radio"
                onChange={(value) => handleFilter("sortBy", value)}
              >
                <MenuItemOption value="newest">Newest</MenuItemOption>
                <MenuItemOption value="oldest">Oldest</MenuItemOption>
                <MenuItemOption value="updated">
                  Recently updated
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Grid>

        <Box pb="10">
          <Table boxShadow="md" borderWidth="1px">
            <Thead bgColor="rgb(243, 244, 246)">
              <Tr>
                <Th>Title</Th>
                <Th w="140px" display={{ base: "none", sm: "table-cell" }}>
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody bgColor="white">
              {posts.data.map((post) => {
                const title = post.attributes.title;
                const name = post.attributes.author.data.attributes.name;
                const tag = post.attributes.tags.data[0]?.attributes.name;
                const relativeUpdatedAt = intlFormatDistance(
                  new Date(post.attributes.updatedAt),
                  new Date(),
                );
                const status = post.attributes.publishedAt ? (
                  <Badge>Published</Badge>
                ) : (
                  <Badge colorScheme="pink">Draft</Badge>
                );
                return (
                  <Tr
                    display="table-row"
                    key={post.id}
                    _hover={{
                      bgColor: "rgb(243, 244, 246)",
                    }}
                    position="relative"
                  >
                    <Td>
                      <ChakraLink
                        background="transparent"
                        as={NextLink}
                        display="block"
                        marginBottom=".25em"
                        _hover={{
                          background: "transparent",
                        }}
                        _before={{
                          content: '""',
                          position: "absolute",
                          inset: "0",
                          zIndex: "1",
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                        href={`/posts/${post.id}`}
                        fontWeight="600"
                      >
                        {title}
                      </ChakraLink>
                      <Box
                        as="span"
                        fontSize="sm"
                        color="gray.500"
                        suppressHydrationWarning
                      >
                        By{" "}
                        <Box as="span" fontWeight="500" color="gray.500">
                          {name}
                        </Box>{" "}
                        {tag && (
                          <>
                            in{" "}
                            <Box as="span" fontWeight="500" color="gray.500">
                              {tag}
                            </Box>{" "}
                          </>
                        )}
                        • {relativeUpdatedAt}
                      </Box>
                      <Box display={{ base: "block", sm: "none" }} pt="4px">
                        {status}
                      </Box>
                    </Td>
                    <Td display={{ base: "none", sm: "table-cell" }}>
                      {status}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Flex flexDirection={"row"} mt={"4"}>
            <Box display="flex" alignItems="center" mx="auto">
              <Pagination
                pagination={pagination}
                endpoint={"posts"}
                queryParams={queryParams}
              />
            </Box>
            <Menu ml="auto">
              <FilterButton text={resultsPerPage} />
              <MenuList>
                <MenuOptionGroup
                  value={resultsPerPage}
                  type="radio"
                  name="resultsPerPage"
                  onChange={(value) => {
                    handleFilter("resultsPerPage", value);
                  }}
                >
                  <MenuItemOption value="5">5</MenuItemOption>
                  <MenuItemOption value="10">10</MenuItemOption>
                  <MenuItemOption value="25">25</MenuItemOption>
                  <MenuItemOption value="50">50</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
