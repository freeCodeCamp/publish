import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import intlFormatDistance from "date-fns/intlFormatDistance";
import { Field, Form, Formik } from "formik";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { useState } from "react";

import NavMenu from "@/components/nav-menu";
import { getRoles } from "@/lib/roles";
import {
  createUser,
  deleteUser,
  getUsers,
  inviteUser,
  userExists,
} from "@/lib/users";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const allUsers = await getUsers(session.user.jwt, {
    populate: ["role", "profile_image"],
  });
  const rolesData = await getRoles(session.user.jwt);

  const roles = rolesData.roles.reduce(
    (acc, role) => ({ ...acc, [role.name]: role.id }),
    {},
  );
  delete roles.Public;

  const activeUsers = allUsers.filter((user) => user.status === "active");
  const invitedUsers = allUsers.filter((user) => user.status !== "active");

  return {
    props: {
      activeUsers,
      invitedUsers,
      roles,
      user: session.user,
    },
  };
}

export default function UsersIndex({ activeUsers, invitedUsers, roles, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("gray.200", "gray.700");
  const container = useColorModeValue("white", "rgb(36, 44, 58)");
  const revokeBtnHoverBg = useColorModeValue(
    "red.50",
    "rgba(254, 178, 178, 0.12)",
  );
  const revokeBtnHoverColor = useColorModeValue("red.600", "red.200");
  const rowBorder = useColorModeValue("gray.200", "gray.500");
  const rowHoverBgColor = useColorModeValue(
    "rgb(243, 244, 246)",
    "rgb(60, 70, 88)",
  );
  const toast = useToast();
  const router = useRouter();

  const [revokingInvitation, setRevokingInvitation] = useState(false);

  const handleInvite = async (values) => {
    const token = user.jwt;
    const data = {
      username: values.email,
      name: values.email,
      slug: values.email,
      email: values.email,
      password: "password",
      role: roles[values.role],
    };

    try {
      const newUser = await createUser(token, data);
      await inviteUser(token, newUser.id);
      toast({
        title: "User invited.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.replace(router.asPath);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const revokeInvitation = async (invitedUserId) => {
    setRevokingInvitation(true);
    const token = user.jwt;
    try {
      await deleteUser(token, invitedUserId);
      toast({
        title: "User invitation revoked.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.replace(router.asPath);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setRevokingInvitation(false);
  };

  const resendInvitation = async (invitedUserId) => {
    setRevokingInvitation(true);
    const token = user.jwt;
    try {
      await inviteUser(token, invitedUserId);
      toast({
        title: "Invitation resent.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.replace(router.asPath);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setRevokingInvitation(false);
  };

  return (
    <Box minH="100vh" bgColor={bg}>
      <NavMenu user={user} />

      <Box ml={{ base: 0, md: "300px" }} px="6">
        <Flex
          alignItems="center"
          minH="20"
          position={{ md: "sticky" }}
          top="0"
          bgColor={bg}
          zIndex="999"
        >
          <Heading>Staff Users</Heading>
          <Spacer />
          <Button colorScheme="blue" onClick={onOpen}>
            Invite user
          </Button>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invite a New User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Formik
                initialValues={{ email: "", role: "Contributor" }}
                onSubmit={async (values, actions) => {
                  // Check if user exists
                  const userStatus = await userExists(user.jwt, values.email);
                  if (userStatus === "active") {
                    actions.setErrors({
                      email: "A user with that email address already exists.",
                    });
                    return;
                  }

                  // Check if user has already been invited
                  if (userStatus === "invited" || userStatus === "new") {
                    actions.setErrors({
                      email:
                        "A user with that email address has already been invited.",
                    });
                    return;
                  }

                  await handleInvite(values);
                  onClose();
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl
                          pb="4"
                          isInvalid={form.errors.email}
                          isRequired
                        >
                          <FormLabel>Email</FormLabel>
                          <Input {...field} type="email" />
                          <FormErrorMessage>
                            {form.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="role" required>
                      {({ field }) => (
                        <FormControl pb="8" isRequired>
                          <FormLabel>Role</FormLabel>
                          <Select {...field}>
                            {Object.keys(roles).map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                    <Button
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      type="submit"
                      w="100%"
                      mb="4"
                    >
                      Send invitation
                    </Button>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Box pb="10" mt="4">
          <Heading size="md">Invited Users</Heading>
          <Box my="4" boxShadow="md" bg={container}>
            {invitedUsers.map((invitedUser) => {
              const userEmail = invitedUser.email;
              const userRole = invitedUser.role.name;
              const createdAt = intlFormatDistance(
                new Date(invitedUser.createdAt),
                new Date(),
              );
              return (
                <Flex
                  data-testid="invited-user"
                  key={invitedUser.id}
                  py="2"
                  px="4"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                  rowGap="2"
                  borderBottom="1px solid"
                  borderColor={rowBorder}
                >
                  <Flex alignItems="center" pr="2">
                    <Avatar size="sm" mr="4" />
                    <Flex flexDirection="column">
                      <Text fontWeight="600">{userEmail}</Text>
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        suppressHydrationWarning
                      >
                        Invitation sent: {createdAt}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex
                    alignItems="center"
                    fontSize="sm"
                    columnGap="4"
                    fontWeight="500"
                  >
                    <ButtonGroup size="sm" variant="ghost">
                      <Button
                        textTransform="uppercase"
                        cursor="pointer"
                        fontSize="xs"
                        isLoading={revokingInvitation}
                        _hover={{
                          bgColor: revokeBtnHoverBg,
                          color: revokeBtnHoverColor,
                        }}
                        onClick={() => revokeInvitation(invitedUser.id)}
                      >
                        Revoke
                      </Button>
                      <Button
                        textTransform="uppercase"
                        cursor="pointer"
                        fontSize="xs"
                        isDisabled={revokingInvitation}
                        onClick={() => resendInvitation(invitedUser.id)}
                      >
                        Resend
                      </Button>
                    </ButtonGroup>
                    <Badge
                      colorScheme={
                        userRole === "Contributor" ? "gray" : "purple"
                      }
                    >
                      {userRole}
                    </Badge>
                  </Flex>
                </Flex>
              );
            })}
          </Box>

          <Heading size="md">Active Users</Heading>
          <Box my="4" boxShadow="md" bg={container}>
            {activeUsers.map((activeUser) => {
              const userEmail = activeUser.email;
              const userRole = activeUser.role.name;
              const profileImage =
                activeUser.profile_image !== null
                  ? process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL +
                    activeUser.profile_image.url
                  : "";
              return (
                <Flex
                  data-testid="active-user"
                  key={activeUser.id}
                  py="2"
                  px="4"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                  rowGap="2"
                  borderBottom="1px solid"
                  borderColor={rowBorder}
                  cursor="pointer"
                  onClick={() => router.push(`/users/${activeUser.id}`)}
                  _hover={{
                    bgColor: rowHoverBgColor,
                  }}
                >
                  <Flex alignItems="center" pr="2">
                    <Avatar size="sm" mr="4" src={profileImage} />
                    <Text fontWeight="600">{userEmail}</Text>
                  </Flex>
                  <Badge
                    colorScheme={userRole === "Contributor" ? "gray" : "purple"}
                  >
                    {userRole}
                  </Badge>
                </Flex>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
