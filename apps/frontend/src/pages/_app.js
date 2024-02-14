import { ChakraProvider } from "@chakra-ui/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { SessionProvider } from "next-auth/react";

import theme from "@/lib/theme";
import { usePathname } from "next/navigation";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const pathname = usePathname();
  const isPreview = pathname.includes("/preview/");

  return (
    <SessionProvider session={session}>
      <ChakraProvider
        theme={!isPreview ? theme : {}}
        resetCSS={!isPreview}
        disableGlobalStyle={isPreview}
      >
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
