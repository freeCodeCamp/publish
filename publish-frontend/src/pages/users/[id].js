import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  chakra,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, Formik } from 'formik';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import slugify from 'slugify';
import * as Yup from 'yup';

import NavMenu from '@/components/nav-menu';
import { getRoles } from '@/lib/roles';
import { deleteUser, getUser, updateMe, updateUser } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isEditor } from '@/lib/current-user';

const Icon = chakra(FontAwesomeIcon);

const editUserInfoSchema = Yup.object().shape({
  name: Yup.string().required('Please enter a name.'),
  slug: Yup.string().required('Please enter a slug.'),
  email: Yup.string().email('Please enter a valid email address.'),
  role: Yup.string(),
  location: Yup.string(),
  website: Yup.string(),
  facebook: Yup.string(),
  twitter: Yup.string(),
  bio: Yup.string().max(200, 'Must be 200 characters or less.')
});

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userData = await getUser(session.user.jwt, context.params.id);
  const rolesData = await getRoles(session.user.jwt);

  const roles = rolesData.roles.reduce(
    (acc, role) => ({ ...acc, [role.name]: role.id }),
    {}
  );
  delete roles.Public;

  return {
    props: {
      userData: {
        name: userData.name,
        slug: userData.slug ?? '',
        email: userData.email,
        role: userData.role.name,
        location: userData.location ?? '',
        website: userData.website ?? '',
        facebook: userData.facebook ?? '',
        twitter: userData.twitter ?? '',
        bio: userData.bio ?? ''
      },
      user: session.user,
      roles
    }
  };
}

export default function EditTag({ userData, user, roles }) {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleSubmit = async values => {
    const token = user.jwt;
    let data = {
      name: values.name,
      slug: slugify(values.slug, {
        lower: true,
        strict: true
      }),
      email: values.email,
      location: values.location,
      website: values.website,
      facebook: values.facebook,
      twitter: values.twitter,
      bio: values.bio
    };
    if (isEditor(user)) {
      data = {
        ...data,
        role: roles[values.role]
      };
    }

    try {
      console.log('data', data);
      if (user.id === router.query.id) {
        // await updateMe(token, userData.id, data);
      } else {
        // await updateUser(token, userData.id, data);
      }
      toast({
        title: 'User Updated.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      router.push('/users');
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleDelete = async () => {
    const token = user.jwt;

    try {
      await deleteUser(token, userData.id);
      toast({
        title: 'User Deleted',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      router.replace('/users');
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Box minH='100vh' bgColor='gray.200'>
      <NavMenu user={user} />

      <Box ml={{ base: 0, md: '300px' }} px='6'>
        <Flex
          alignItems='center'
          minH='20'
          position={{ md: 'sticky' }}
          top='0'
          bgColor='gray.200'
          zIndex='999'
        >
          <Breadcrumb separator={<Icon icon={faChevronRight} fixedWidth />}>
            <BreadcrumbItem>
              <BreadcrumbLink textDecoration='none' href='/tags'>
                <Heading size='lg'>Staff</Heading>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>
                <Heading size='lg'>{userData.name}</Heading>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <Box p='4' pb='6' bgColor='white' rounded='4' boxShadow='md'>
          <Formik
            initialValues={userData}
            enableReinitialize={true}
            validationSchema={editUserInfoSchema}
            onSubmit={async (values, _actions) => {
              await handleSubmit(values);
            }}
          >
            {({ isSubmitting, setSubmitting, values }) => (
              <Form>
                <Field name='name'>
                  {({ field, form }) => (
                    <FormControl pb='8' isInvalid={form.errors.name}>
                      <FormLabel>Full Name</FormLabel>
                      <Input {...field} />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name='slug'>
                  {({ field }) => (
                    <FormControl
                      pb='8'
                      onBlur={() => {
                        const valueToSlug =
                          values.slug.trim() === '' ? values.name : values.slug;
                        values.slug = slugify(valueToSlug, {
                          lower: true,
                          strict: true
                        });
                      }}
                    >
                      <FormLabel>Slug</FormLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                </Field>
                <Field name='email'>
                  {({ field }) => (
                    <FormControl pb='8'>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} type='email' />
                    </FormControl>
                  )}
                </Field>
                <Field name='role'>
                  {({ field }) => (
                    <FormControl pb='8' isDisabled={!isEditor(user)}>
                      <FormLabel>Role</FormLabel>
                      <Select {...field} value={values.role}>
                        {Object.keys(roles).map(role => {
                          return (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </Field>
                <Field name='location'>
                  {({ field }) => (
                    <FormControl pb='8'>
                      <FormLabel>Location</FormLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                </Field>
                <Field name='website'>
                  {({ field }) => (
                    <FormControl pb='8'>
                      <FormLabel>Website</FormLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                </Field>
                <Field name='facebook'>
                  {({ field }) => (
                    <FormControl pb='8'>
                      <FormLabel>Facebook Profile</FormLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                </Field>
                <Field name='twitter'>
                  {({ field }) => (
                    <FormControl pb='8'>
                      <FormLabel>Twitter Profile</FormLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                </Field>
                <Field name='bio'>
                  {({ field }) => (
                    <FormControl pb='8'>
                      <FormLabel>Bio</FormLabel>
                      <Textarea {...field} maxLength='200' />
                    </FormControl>
                  )}
                </Field>
                <Button
                  colorScheme='blue'
                  isLoading={isSubmitting}
                  type='submit'
                  mr='4'
                >
                  Save
                </Button>
                {isEditor(user) && (
                  <Button
                    colorScheme='red'
                    isLoading={isSubmitting}
                    onClick={onOpen}
                  >
                    Delete user
                  </Button>
                )}
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent maxW='lg'>
                      <AlertDialogHeader>
                        Are you sure you want to delete this user?
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        <b>{`"${values.name}"`}</b> will be permanently deleted.
                        A backup will be automatically downloaded to your device
                        before deletion.
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme='red'
                          isLoading={isSubmitting}
                          onClick={async () => {
                            setSubmitting(true);
                            await handleDelete();
                          }}
                          ml={3}
                        >
                          Download backup & delete user
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}
