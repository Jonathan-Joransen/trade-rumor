import Head from "next/head";

export const GlobalHead = (props: any) => {
  return (
    <>
      <Head>
        <title>NBA Trade Rumor</title>
        <meta
          name="description"
          content="See if NBA trades work using up to date live data."
        />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="//www.ezojs.com/basicads.js?d=nbatraderumor.com"
          type="text/javascript"
        ></script>
      </Head>
      {props.children}
    </>
  );
};

export default GlobalHead;
