import { isEditor } from '@/lib/current-user';
import { inviteUser } from '@/lib/invite-user';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useToast
} from '@chakra-ui/react';
import {
  faArrowRightFromBracket,
  faChevronDown,
  faFileLines,
  faTags,
  faUser,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from './nav-menu.module.css';

export default function NavMenu({ session }) {
  console.log(session.user);
  const [inviteEmail, setInviteEmail] = useState('');
  const toast = useToast();

  const invite = async () => {
    const status = await inviteUser(inviteEmail, session.user.jwt);
    toast({
      title: status ? 'User invited' : 'Error inviting user',
      status: status ? 'success' : 'error',
      duration: 5000,
      isClosable: true
    });
  };
  return (
    <Flex
      flexDirection='column'
      minH='100vh'
      w='300px'
      className={styles.navbar}
    >
      <Box>
        <Heading size='lg' py='1rem' textAlign='center'>
          freeCodeCamp
        </Heading>

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
      <Box mx='10px' mb='1rem'>
        <FormControl isRequired>
          <FormLabel>Invite User</FormLabel>
          <Input
            type='email'
            placeholder='foo@bar.com'
            onChange={e => setInviteEmail(e.target.value)}
          />
        </FormControl>
        <Button colorScheme='blue' onClick={invite}>
          Invite
        </Button>
      </Box>
      <Box m='0 5px'>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<FontAwesomeIcon icon={faChevronDown} fixedWidth />}
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
            <MenuItem icon={<FontAwesomeIcon icon={faUser} fixedWidth />}>
              Your Profile
            </MenuItem>
            <MenuItem
              icon={
                <FontAwesomeIcon icon={faArrowRightFromBracket} fixedWidth />
              }
              onClick={() => signOut()}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}
