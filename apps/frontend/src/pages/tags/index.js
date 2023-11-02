import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import NextLink from "next/link";
import { useRouter } from "next/router";

import NavMenu from "@/components/nav-menu";
import { getTags } from "@/lib/tags";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Pagination from "@/components/pagination";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const tags = await getTags(session.user.jwt, {
    populate: {
      posts: {
        count: true,
      },
    },
    filters: {
      visibility: {
        $eq: context.query.visibility || "public",
      },
    },
    pagination: {
      page: context.query.page || 1,
    },
  });

  return {
    props: {
      tags: tags.data,
      isInternal: context.query.visibility === "internal",
      user: session.user,
      pagination: tags.meta,
    },
  };
}

const TagsTableBody = (tags, router) => {
  return (
    <Tbody bgColor="white">
      {tags.map((tag) => {
        const name = tag.attributes.name;
        const slug = tag.attributes.slug;
        const noOfPosts = tag.attributes.posts.data.attributes.count;
        return (
          <Tr
            display="table-row"
            key={tag.id}
            cursor="pointer"
            _hover={{
              bgColor: "rgb(243, 244, 246)",
            }}
            onClick={() => router.push(`/tags/${tag.id}`)}
          >
            <Td>
              <Box fontWeight="600">{name}</Box>
              <Box
                fontSize="sm"
                color="gray.500"
                display={{ base: "block", sm: "none" }}
                pt="4px"
              >
                {slug} • {noOfPosts} post{noOfPosts > 1 ? "s" : ""}
              </Box>
            </Td>
            <Td display={{ base: "none", sm: "table-cell" }}>{slug}</Td>
            <Td display={{ base: "none", sm: "table-cell" }}>
              {noOfPosts} post{noOfPosts > 1 ? "s" : ""}
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
};

const TagFilterButton = ({ tagType, ...radioProps }) => {
  const { getInputProps, getRadioProps } = useRadio(radioProps);

  return (
    <Button
      as="label"
      bgColor="white"
      fontSize="14px"
      boxShadow="sm"
      cursor="pointer"
      borderRight="1px solid"
      borderColor="gray.200"
      borderLeftRadius={radioProps.value === "public" ? "md" : "none"}
      borderRightRadius={radioProps.value === "public" ? "none" : "md"}
      _hover={{
        boxShadow: "md",
      }}
      _active={{
        bgColor: "white",
      }}
    >
      <input {...getInputProps()} />
      <Box
        {...getRadioProps()}
        _checked={{ color: "#3eb0ef" }}
        textTransform="capitalize"
      >
        {tagType} tags
      </Box>
    </Button>
  );
};

export default function TagsIndex({ tags, isInternal, pagination, user }) {
  const router = useRouter();

  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: isInternal ? "internal" : "public",
    onChange: (value) => {
      if (value === "public") {
        router.push("/tags?visibility=public&page=1");
      } else {
        router.push("/tags?visibility=internal&page=1");
      }
    },
  });

  return (
    <Box minH="100vh" bgColor="gray.200">
      <NavMenu user={user} />
      <Box ml={{ base: 0, md: "300px" }} px="6">
        <Flex
          alignItems="center"
          minH="20"
          position={{ md: "sticky" }}
          top="0"
          bgColor="gray.200"
          zIndex="9999"
        >
          <Heading>Tags</Heading>
          <Spacer />
          <Box
            mr={{ base: 0, md: "4" }}
            display={{ base: "none", md: "grid" }}
            gridTemplateColumns="1fr 1fr"
            {...getRootProps()}
          >
            <TagFilterButton
              tagType="public"
              {...getRadioProps({ value: "public" })}
            />
            <TagFilterButton
              tagType="internal"
              {...getRadioProps({ value: "internal" })}
            />
          </Box>
          <Button colorScheme="blue" as={NextLink} href="/tags/new">
            New Tag
          </Button>
        </Flex>

        <Box
          my="4"
          display={{ base: "grid", md: "none" }}
          gridTemplateColumns="1fr 1fr"
          {...getRootProps()}
        >
          <TagFilterButton
            tagType="public"
            {...getRadioProps({ value: "public" })}
          />
          <TagFilterButton
            tagType="internal"
            {...getRadioProps({ value: "internal" })}
          />
        </Box>

        <Box pb="10">
          <Table boxShadow="md" borderWidth="1px">
            <Thead bgColor="rgb(243, 244, 246)">
              <Tr>
                <Th>Tag</Th>
                <Th w="20%" display={{ base: "none", sm: "table-cell" }}>
                  Slug
                </Th>
                <Th w="20%" display={{ base: "none", sm: "table-cell" }}>
                  No. of Posts
                </Th>
              </Tr>
            </Thead>
            {TagsTableBody(tags, router)}
          </Table>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt="4"
          >
            <Pagination
              pagination={pagination}
              endpoint={"tags"}
              queryParams={{}}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
