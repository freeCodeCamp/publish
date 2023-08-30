import NextLink from 'next/link'; // import as NextLink to avoid conflict with chakra-ui Link component
import { useSession, signIn } from 'next-auth/react';
import { getPosts } from '../lib/posts';
import NavMenu from '@/components/nav-menu';

import {
  Box,
  Button,
  useDisclosure,
  Drawer,
  DrawerContent,
  Flex,
  Heading,
  DrawerOverlay,
  IconButton
} from '@chakra-ui/react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@chakra-ui/react';

export async function getServerSideProps() {
  const allPostsData = await getPosts();
  return {
    props: {
      allPostsData
    }
  };
}

export default function IndexPage({ allPostsData }) {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  if (session) {
    return (
      <Box minH='100vh' bgColor='gray.100'>
        <NavMenu
          session={session}
          onClose={() => onClose}
          display={{ base: 'none', md: 'flex' }}
        />

        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size='full'
        >
          <DrawerOverlay />
          <DrawerContent>
            <NavMenu session={session} onClose={onClose} />
          </DrawerContent>
        </Drawer>

        <Flex
          display={{ base: 'flex', md: 'none' }}
          height='20'
          alignItems='center'
          borderBottomWidth='1px'
          borderBottomColor='gray.200'
          justifyContent='flex-start'
          px='4'
          bgColor='white'
        >
          <IconButton
            variant='outline'
            onClick={onOpen}
            icon={<FontAwesomeIcon icon={faBars} />}
          />
          <Heading size='lg' ml='8' textAlign='center'>
            freeCodeCamp
          </Heading>
        </Flex>

        <Box ml={{ base: 0, md: '300px' }}>
          <div>
            <Button colorScheme='blue' as={NextLink} href='/posts/new'>
              New Post
            </Button>
          </div>

          <div>
            <ul>
              {allPostsData.data.map(post => {
                return (
                  <li key={post.id} style={{ marginBottom: '1.25rem' }}>
                    <Link as={NextLink} href={`/posts/${post.id}`}>
                      <strong>{post.attributes.title}</strong>
                      <br />
                      {post.attributes.body.slice(0, 150)}...
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Box>
      </Box>
    );
  }

  return (
    <>
      Not signed in <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}
