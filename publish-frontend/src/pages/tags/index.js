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
  Tr
} from '@chakra-ui/react';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import NavMenu from '@/components/nav-menu';
import { getTags } from '@/lib/tags';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const tags = await getTags(session.user.jwt);
  const publicTags = tags.data.filter(
    tag => tag.attributes.visibility === 'public'
  );
  const internalTags = tags.data.filter(
    tag => tag.attributes.visibility === 'internal'
  );
  return {
    props: {
      publicTags,
      internalTags,
      user: session.user
    }
  };
}

const tagsTableBody = (tags, router) => {
  return (
    <Tbody bgColor='white'>
      {tags.map(tag => {
        const name = tag.attributes.name;
        const slug = tag.attributes.slug;
        const noOfPosts = tag.attributes.posts.data.length;
        return (
          <Tr
            display='table-row'
            key={tag.id}
            cursor='pointer'
            _hover={{
              bgColor: 'rgb(243, 244, 246)'
            }}
            onClick={() => router.push(`/tags/${tag.id}`)}
          >
            <Td>
              <Box fontWeight='600'>{name}</Box>
              <Box display={{ base: 'block', sm: 'none' }} pt='4px'>
                {slug} • {noOfPosts} post{noOfPosts > 1 ? 's' : ''}
              </Box>
            </Td>
            <Td display={{ base: 'none', sm: 'table-cell' }}>{slug}</Td>
            <Td display={{ base: 'none', sm: 'table-cell' }}>
              {noOfPosts} post{noOfPosts > 1 ? 's' : ''}
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
};

export default function TagsIndex({ publicTags, internalTags, user }) {
  const router = useRouter();

  const [isPublic, setIsPublic] = useState(true);

  return (
    // <Flex>
    //   <NavMenu user={user} />
    //   <main style={{ padding: '0.75rem' }}>
    // <TagsList allTagsData={allTagsData} />
    //   </main>
    // </Flex>
    <Box minH='100vh' bgColor='gray.200'>
      <NavMenu user={user} />

      <Box ml={{ base: 0, md: '300px' }} px='6'>
        <Flex
          alignItems='center'
          minH='20'
          position={{ md: 'sticky' }}
          top='0'
          bgColor='gray.200'
          zIndex='9999'
        >
          <Heading>Tags</Heading>
          <Spacer />
          <Button colorScheme='blue' as={NextLink} href='/tags/new'>
            New Tag
          </Button>
        </Flex>

        {/* <Grid
          my='4'
          gap='3'
          gridTemplateColumns={{
            base: '1fr',
            sm: '1fr 1fr',
            lg: '1fr 1fr 1fr 1fr'
          }}
        >
          <Menu>
            <FilterButton text='All posts' />
            <MenuList>
              <MenuOptionGroup defaultValue='all' type='radio'>
                <MenuItemOption value='all'>All posts</MenuItemOption>
                <MenuItemOption value='drafts'>Drafts posts</MenuItemOption>
                <MenuItemOption value='published'>
                  Published posts
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Menu>
            <FilterButton text='All authors' />
            <MenuList>
              <MenuOptionGroup defaultValue='all' type='radio'>
                <MenuItemOption value='all'>All authors</MenuItemOption>
                {users.map(user => (
                  <MenuItemOption key={user.id} value={user.id}>
                    {user.name}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Menu>
            <FilterButton text='All tags' />
            <MenuList>
              <MenuOptionGroup defaultValue='all' type='radio'>
                <MenuItemOption value='all'>All tags</MenuItemOption>
                {tags.data.map(tag => (
                  <MenuItemOption key={tag.id} value={tag.id}>
                    {tag.attributes.name}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Menu>
            <FilterButton text='Sort by: Newest' />
            <MenuList>
              <MenuOptionGroup defaultValue='newest' type='radio'>
                <MenuItemOption value='newest'>Newsest</MenuItemOption>
                <MenuItemOption value='oldest'>Oldest</MenuItemOption>
                <MenuItemOption value='recently-updated'>
                  Recently updated
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Grid> */}

        <Box pb='10'>
          <Table boxShadow='md' borderWidth='1px'>
            <Thead bgColor='rgb(243, 244, 246)'>
              <Tr>
                <Th>Tag</Th>
                <Th w='20%' display={{ base: 'none', sm: 'table-cell' }}>
                  Slug
                </Th>
                <Th w='20%' display={{ base: 'none', sm: 'table-cell' }}>
                  No. of Posts
                </Th>
              </Tr>
            </Thead>
            {isPublic
              ? tagsTableBody(publicTags, router)
              : tagsTableBody(internalTags, router)}
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
