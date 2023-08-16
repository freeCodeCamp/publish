import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { useState } from 'react';

// TODO: make a common config file for this or setup common fetch/axios with base URL
const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export default function SignUp({ email }) {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const signUpUser = async () => {
    const res = await fetch(`${api_root}/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        email,
        password,
        displayName: fullName
      })
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Sign up</h1>
      <FormControl isRequired>
        <FormLabel>Full Name</FormLabel>
        <Input onChange={e => setFullName(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input value={email} type='email' disabled />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            minLength={6}
            onChange={e => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button
              h='1.75rem'
              size='sm'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme='blue' onClick={signUpUser}>
        Sign Up
      </Button>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { token } = query;
  const res = await fetch(
    `${api_root}/email-tokens?filters[token][$eq]=${token}`
  );
  const { data } = await res.json();
  console.log(data);
  let email;

  if (data.length !== 0) {
    email = data[0].attributes.email;
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return { props: { email } };
}
