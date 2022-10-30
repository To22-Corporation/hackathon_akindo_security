import type { NextPage } from "next";

import { SubmitHandler } from "react-hook-form";
import ResultTemplate from "../templates/result";

const Home: NextPage = () => {
  const onSubmit = () => {
    // バックエンドへpost
  };
  return <ResultTemplate />;
};

export default Home;
