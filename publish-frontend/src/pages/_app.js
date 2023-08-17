import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';

// import Font Awesome CSS
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;


export default function App({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
