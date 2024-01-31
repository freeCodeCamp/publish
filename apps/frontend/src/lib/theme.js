import { extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

const config = {
  initialColorMode: "system",
  useSystemColorMode: false,
  components: {
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: "gray.200",
          },
          td: {
            borderColor: "gray.200",
          },
        },
      },
    },
  },
};

const theme = extendTheme(
  config,
  withProse({
    baseStyle: {
      h1: {
        mt: 0,
        mb: "2rem",
      },
      h2: {
        mt: 0,
        mb: "1.5rem",
      },
      h3: {
        mt: 0,
        mb: "1rem",
      },
      h4: {
        mt: 0,
        mb: "0.5rem",
      },
      h5: {
        margin: 0,
      },
      h6: {
        margin: 0,
      },
    },
  }),
);

export default theme;
