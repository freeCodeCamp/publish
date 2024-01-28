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

const theme = extendTheme(config, withProse());

export default theme;
