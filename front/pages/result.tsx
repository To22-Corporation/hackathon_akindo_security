import type { NextPage } from "next";
import * as React from "react";
import { SubmitHandler } from "react-hook-form";
import ResultTemplate from "../templates/result";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../util/constant";
import useSWR from "swr";

const Home: NextPage = () => {
  const router = useRouter();
  const { contractAddress, network } = router.query;

  const [result, setResult] = React.useState();
  console.log("contractAddress: ", contractAddress);

  React.useEffect(() => {
    console.log("useEffect");
    console.log("stringfy", JSON.stringify({ contractAddress, network }));
    (async () => {
      if (contractAddress && network) {
        const response = await fetch(
          "https://hackathon-security.herokuapp.com/erc20Test",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contractAddress, network }),
          }
        );
        const data = await response.json();
        setResult(data);

        console.log("data: ", data && data);
      }
    })();
  }, [contractAddress, network]);

  return <ResultTemplate data={result} />;
};

export default Home;
