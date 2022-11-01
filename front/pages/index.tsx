import type { NextPage } from "next";
import Head from "next/head";
import IndexTemplate from "../templates";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const onSubmit = (contractAddress: string, network: string) => {
    router.push({
      pathname: "/result/",
      query: { contractAddress, network },
    });
  };
  return <IndexTemplate onSubmit={onSubmit} />;
};

export default Home;
