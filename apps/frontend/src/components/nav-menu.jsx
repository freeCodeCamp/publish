import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import {
  faArrowRightFromBracket,
  faBars,
  faChevronDown,
  faFileLines,
  // faNewspaper,
  faTags,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import NextLink from "next/link";

import { isEditor } from "@/lib/current-user";

const Icon = chakra(FontAwesomeIcon);

const NavMenuLink = ({ text, link, icon }) => {
  return (
    <a href={link}>
      <Box
        color="black"
        p="0.5rem 2rem"
        fontWeight="400"
        m="2px 5px"
        _hover={{
          bgColor: "rgb(243, 244, 246)",
          borderRadius: "5px",
        }}
      >
        <Icon icon={icon} fixedWidth mr="0.5rem" />
        {text}
      </Box>
    </a>
  );
};

const NavMenuContent = ({ user, onClose, ...rest }) => {
  return (
    <Flex
      flexDirection="column"
      w={{ base: "full", md: "300px" }}
      h="100%"
      pos="fixed"
      bgColor="white"
      borderRightWidth="1px"
      {...rest}
    >
      <Box>
        <Flex
          h="20"
          alignItems="center"
          mx="8px"
          justifyContent="space-between"
        >
          <Box
            size="lg"
            py="1rem"
            mx="20px"
            textAlign="center"
            fontWeight="700"
            fontSize="20px"
            display="flex"
            alignItems="center"
          >
            <Img
              src=" https://cdn.freecodecamp.org/platform/universal/fcc_puck_500.jpg"
              width="32px"
              height="32px"
              mr="12px"
              borderRadius="5px"
            />
            freeCodeCamp.org
          </Box>
          <CloseButton
            onClick={onClose}
            display={{ base: "flex", md: "none" }}
          />
        </Flex>

        <Box>
          <NavMenuLink text="Posts" icon={faFileLines} link="/posts" />
          {isEditor(user) && (
            <>
              {/* <NavMenuLink text="Pages" icon={faNewspaper} link="/pages" /> */}
              <NavMenuLink text="Tags" icon={faTags} link="/tags" />
              <NavMenuLink text="Staff" icon={faUsers} link="/users" />
            </>
          )}
        </Box>
      </Box>
      <Spacer />
      <Box m="0 5px">
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon icon={faChevronDown} fixedWidth />}
            bgColor="white"
            w="100%"
            mt={3}
            mb={6}
            _hover={{
              bgColor: "rgb(243, 244, 246)",
            }}
            _active={{
              bgColor: "rgb(243, 244, 246)",
            }}
          >
            <Flex>
              <Avatar size="sm" mr="8px" my="auto" src={user?.image} />
              <Flex flexDirection="column" alignItems="flex-start">
                <Box fontWeight="600" lineHeight="1.1em" pb="3px">
                  {user.name}
                </Box>
                <Box
                  fontSize="0.75rem"
                  fontWeight="400"
                  lineHeight="1.1em"
                  pb="3px"
                  color="#54666d"
                >
                  {user.email}
                </Box>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<Icon icon={faUser} fixedWidth />}
              as={NextLink}
              href={`/users/${user.id}`}
            >
              Your Profile
            </MenuItem>
            <MenuItem
              icon={<Icon icon={faArrowRightFromBracket} fixedWidth />}
              onClick={() => signOut({ callbackUrl: "/" })}
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
      <NavMenuContent user={user} display={{ base: "none", md: "flex" }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <NavMenuContent user={user} onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Flex
        display={{ base: "flex", md: "none" }}
        height="20"
        alignItems="center"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        justifyContent="flex-start"
        px="4px"
        bgColor="white"
      >
        <IconButton
          variant="outline"
          onClick={onOpen}
          icon={<FontAwesomeIcon icon={faBars} />}
        />
        <Heading size="lg" ml="8px" textAlign="center">
          freeCodeCamp
        </Heading>
      </Flex>
    </>
  );
}
