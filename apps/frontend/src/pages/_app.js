import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";
import { SessionProvider } from "next-auth/react";

// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;
const theme = extendTheme(
  {
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
  },
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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
