import { Html, Head, Main, NextScript } from "next/document";

// Custom document component
// https://nextjs.org/docs/pages/building-your-application/routing/custom-document
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
