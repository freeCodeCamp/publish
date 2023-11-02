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
} from "@chakra-ui/react";
import intlFormatDistance from "date-fns/intlFormatDistance";
import { Field, Form, Formik } from "formik";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { useState } from "react";

import NavMenu from "@/components/nav-menu";
import {
  deleteInvitedUser,
  getInvitedUsers,
  inviteUser,
  invitedUserExists,
} from "@/lib/invite-user";
import { getRoles } from "@/lib/roles";
import { getUsers, userExists } from "@/lib/users";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const allUsers = await getUsers(session.user.jwt, {
    populate: ["role", "profile_image"],
  });
  const rolesData = await getRoles(session.user.jwt);
  const invitedUsers = await getInvitedUsers(session.user.jwt, {
    populate: "role",
    filters: {
      accepted: false,
    },
  });

  const roles = rolesData.roles.reduce(
    (acc, role) => ({ ...acc, [role.name]: role.id }),
    {},
  );
  delete roles.Public;

  return {
    props: {
      allUsers,
      invitedUsers,
      roles,
      user: session.user,
    },
  };
}

export default function UsersIndex({ allUsers, invitedUsers, roles, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const [revokingInvitation, setRevokingInvitation] = useState(false);

  const handleSubmit = async (values) => {
    const token = user.jwt;
    const data = {
      data: {
        email: values.email,
        role: [roles[values.role]],
      },
    };

    try {
      await inviteUser(token, data);
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
      await deleteInvitedUser(token, invitedUserId);
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
          zIndex="999"
        >
          <Heading>Staff users</Heading>
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
                  if (await userExists(user.jwt, values.email)) {
                    actions.setErrors({
                      email: "A user with that email address already exists.",
                    });
                    return;
                  }

                  // Check if user has already been invited
                  if (await invitedUserExists(user.jwt, values.email)) {
                    actions.setErrors({
                      email:
                        "A user with that email address has already been invited.",
                    });
                    return;
                  }

                  await handleSubmit(values);
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
          <Box my="4" boxShadow="md" bgColor="white">
            {invitedUsers.data.map((user) => {
              if (user.attributes.accepted) return null;

              const userEmail = user.attributes.email;
              const userRole = user.attributes.role.data.attributes.name;
              const createdAt = intlFormatDistance(
                new Date(user.attributes.createdAt),
                new Date(),
              );
              return (
                <Flex
                  key={user.id}
                  py="2"
                  px="4"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                  rowGap="2"
                  borderBottom="1px solid"
                  borderColor="gray.200"
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
                          bgColor: "red.50",
                          color: "red.500",
                        }}
                        onClick={() => revokeInvitation(user.id)}
                      >
                        Revoke
                      </Button>
                      <Button
                        textTransform="uppercase"
                        cursor="pointer"
                        fontSize="xs"
                        isDisabled={revokingInvitation}
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
          <Box my="4" boxShadow="md" bgColor="white">
            {allUsers.map((user) => {
              const userEmail = user.email;
              const userRole = user.role.name;
              const profileImage =
                user.profile_image !== null
                  ? process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL +
                    user.profile_image.url
                  : "";
              return (
                <Flex
                  key={user.id}
                  py="2"
                  px="4"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                  rowGap="2"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  cursor="pointer"
                  onClick={() => router.push(`/users/${user.id}`)}
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
