import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="DDxGen" key="title" />
        <meta
          property="og:description"
          content="generate differential diagnosis"
          key="description"
        />
        <meta
          property="og:image"
          content="https://vmimr.s3.us-west-2.amazonaws.com/cjr0zfqxh000m0818d0eh5jhc-79-Screen%20Shot%202023-01-14%20at%209.14.07%20PM.png"
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
