import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Img,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  chakra,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import {
  faArrowRightFromBracket,
  faBars,
  faChevronDown,
  faFileLines,
  faNewspaper,
  faTags,
  faUser,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { isEditor } from '@/lib/current-user';
import { inviteUser } from '@/lib/invite-user';

const Icon = chakra(FontAwesomeIcon);

const NavMenuLink = ({ text, link, icon }) => {
  return (
    <Box
      color='black'
      p='0.5rem 2rem'
      fontWeight='400'
      m='2px 5px'
      _hover={{
        bgColor: 'rgb(243, 244, 246)',
        borderRadius: '5px'
      }}
    >
      <a href={link}>
        <Icon icon={icon} fixedWidth mr='0.5rem' />
        {text}
      </a>
    </Box>
  );
};

const NavMenuContent = ({ user, onClose, ...rest }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const toast = useToast();

  const invite = async () => {
    const status = await inviteUser(inviteEmail, user.jwt);
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
      w={{ base: 'full', md: '300px' }}
      h='100%'
      pos='fixed'
      bgColor='white'
      borderRightWidth='1px'
      {...rest}
    >
      <Box>
        <Flex
          h='20'
          alignItems='center'
          mx='8px'
          justifyContent='space-between'
        >
          <Box
            size='lg'
            py='1rem'
            mx='20px'
            textAlign='center'
            fontWeight='700'
            fontSize='20px'
            display='flex'
            alignItems='center'
          >
            <Img
              src=' https://cdn.freecodecamp.org/platform/universal/fcc_puck_500.jpg'
              width='32px'
              height='32px'
              mr='12px'
              borderRadius='5px'
            />
            freeCodeCamp.org
          </Box>
          <CloseButton
            onClick={onClose}
            display={{ base: 'flex', md: 'none' }}
          />
        </Flex>

        <Box>
          <NavMenuLink text='Posts' icon={faFileLines} link='#' />
          {isEditor(user) && (
            <>
              <NavMenuLink text='Pages' icon={faNewspaper} link='#' />
              <NavMenuLink text='Tags' icon={faTags} link='#' />
              <NavMenuLink text='Staff' icon={faUsers} link='#' />
            </>
          )}
        </Box>
      </Box>
      <Spacer />
      {/* TODO: Remove this when invite users logic is added to users view */}
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
            rightIcon={<Icon icon={faChevronDown} fixedWidth />}
            bgColor='white'
            w='100%'
            mt={3}
            mb={6}
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
                  {user.name}
                </Box>
                <Box
                  fontSize='0.75rem'
                  fontWeight='400'
                  lineHeight='1.1em'
                  pb='3px'
                  color='#54666d'
                >
                  {user.email}
                </Box>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Icon icon={faUser} fixedWidth />}>
              Your Profile
            </MenuItem>
            <MenuItem
              icon={<Icon icon={faArrowRightFromBracket} fixedWidth />}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default function NavMenu({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NavMenuContent user={user} display={{ base: 'none', md: 'flex' }} />
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
          <NavMenuContent user={user} onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Flex
        display={{ base: 'flex', md: 'none' }}
        height='20'
        alignItems='center'
        borderBottomWidth='1px'
        borderBottomColor='gray.200'
        justifyContent='flex-start'
        px='4px'
        bgColor='white'
      >
        <IconButton
          variant='outline'
          onClick={onOpen}
          icon={<FontAwesomeIcon icon={faBars} />}
        />
        <Heading size='lg' ml='8px' textAlign='center'>
          freeCodeCamp
        </Heading>
      </Flex>
    </>
  );
}
