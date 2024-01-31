import { Button, Box, Flex, Img } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useColorModeValue } from "@chakra-ui/react";

export default function IndexPage() {
  const bg = useColorModeValue("gray.200", "gray.700");
  const container = useColorModeValue("white", "gray.800");

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg={bg}
        h="100vh"
      >
        <Flex
          flexDirection="column"
          width="400px"
          height="150px"
          bgColor={container}
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
            Sign In
          </Button>
        </Flex>
      </Box>
    </>
  );
}
