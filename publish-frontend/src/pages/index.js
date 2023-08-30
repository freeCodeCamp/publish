import NextLink from 'next/link'; // import as NextLink to avoid conflict with chakra-ui Link component
import { useSession, signIn } from 'next-auth/react';
import { getPosts } from '../lib/posts';
import NavMenu from '@/components/nav-menu'; // Rename to sidebar

import {
  Box,
  Button,
  useDisclosure,
  Drawer,
  DrawerContent,
  Menu,
  MenuItem,
  Flex,
  Heading,
  Spacer,
  Avatar,
  MenuButton,
  MenuList,
  DrawerOverlay,
  IconButton,
  CloseButton
} from '@chakra-ui/react';
import {
  faArrowRightFromBracket,
  faBars,
  faChevronDown,
  faFileLines,
  faTags,
  faUser,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@chakra-ui/react';
import styles from '@/components/nav-menu.module.css';
import { isEditor } from '@/lib/current-user';

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
        <NavMenu session={session} />

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
            <Flex
              flexDirection='column'
              minH='100vh'
              w='full'
              className={styles.navbar}
            >
              <Box>
                <Flex
                  h='20'
                  alignItems='center'
                  mx='8'
                  justifyContent='space-between'
                >
                  <Heading size='lg' py='1rem' textAlign='center'>
                    freeCodeCamp
                  </Heading>
                  {/* <DrawerCloseButton /> */}
                  <CloseButton onClick={onClose} />
                </Flex>

                <Box>
                  <Box>
                    <a className={styles.navbarLink}>
                      <FontAwesomeIcon icon={faFileLines} fixedWidth />
                      Posts
                    </a>
                  </Box>
                  {isEditor(session) ||
                    (true && (
                      <>
                        <Box>
                          <a className={styles.navbarLink}>
                            <FontAwesomeIcon icon={faTags} fixedWidth /> Tags
                          </a>
                        </Box>
                        <Box>
                          <a className={styles.navbarLink}>
                            <FontAwesomeIcon icon={faUsers} fixedWidth />
                            Staff
                          </a>
                        </Box>
                      </>
                    ))}
                </Box>
              </Box>
              <Spacer />
              <Box m='0 5px'>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={
                      <FontAwesomeIcon icon={faChevronDown} fixedWidth />
                    }
                    bgColor='white'
                    w='100%'
                    mt={3}
                    mb={6}
                    display='flex'
                    alignItems='center'
                    _hover={{
                      bgColor: 'rgb(243, 244, 246)'
                    }}
                    _active={{
                      bgColor: 'rgb(243, 244, 246)'
                    }}
                  >
                    <Flex>
                      <Avatar size='sm' mr='8px' my='auto' />
                      <Flex flexDirection='column'>
                        <Box fontWeight='600' lineHeight='1.1em' pb='3px'>
                          {session.user.name}
                        </Box>
                        <Box
                          fontSize='0.75rem'
                          fontWeight='400'
                          lineHeight='1.1em'
                          pb='3px'
                          color='#54666d'
                        >
                          {session.user.email}
                        </Box>
                      </Flex>
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<FontAwesomeIcon icon={faUser} fixedWidth />}
                    >
                      Your Profile
                    </MenuItem>
                    <MenuItem
                      icon={
                        <FontAwesomeIcon
                          icon={faArrowRightFromBracket}
                          fixedWidth
                        />
                      }
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Flex>
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
