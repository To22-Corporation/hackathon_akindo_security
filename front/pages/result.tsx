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
  const [isScam, setIsScam] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      if (contractAddress && network) {
        const checkIsScamListResponse = await fetch(
          "https://hackathon-security.herokuapp.com/erc20ScamCheck",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contractAddress, network }),
          }
        );
        const isScam = await checkIsScamListResponse.json();
        setIsScam(isScam.result);
        if (isScam.result) {
          return;
        }
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
      }
    })();
  }, [contractAddress, network]);

  return <ResultTemplate data={result} isScam={isScam} />;
};

export default Home;
