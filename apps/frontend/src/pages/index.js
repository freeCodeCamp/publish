import { Button, Box, Flex, Img } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function IndexPage() {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="100vh"
        bgColor="gray.200"
      >
        <Flex
          flexDirection="column"
          width="400px"
          height="150px"
          bgColor="white"
          boxShadow="lg"
          rounded="md"
          p="1rem"
        >
          <Flex h="20" alignItems="center">
            <Box
              size="lg"
              py="1rem"
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
                borderRadius="5px"
                mr="10px"
              />
              freeCodeCamp Editorial
            </Box>
          </Flex>
          <Button
            onClick={() => signIn(undefined, { callbackUrl: "/posts" })}
            w="100%"
            colorScheme="blue"
          >
            Sign in
          </Button>
        </Flex>
      </Box>
    </>
  );
}
