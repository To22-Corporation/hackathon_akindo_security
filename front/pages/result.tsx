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

  const [erc20TestResult, setErc20TestResult] = React.useState();
  const [erc20TransactionCheckData, setErc20TransactionCheckData] =
    React.useState();
  const [erc20FunctionCheck, setErc20FunctionCheck] = React.useState();
  const [isScam, setIsScam] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      if (contractAddress && network) {
        try {
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
        } catch (e) {}

        if (isScam) {
          return;
        }

        // トランザクション履歴確認
        try {
          const erc20TransactionCheckResponse = await fetch(
            "https://hackathon-security.herokuapp.com/erc20TransactionCheck",
            {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ contractAddress, network }),
            }
          );
          const erc20TransactionCheckData =
            await erc20TransactionCheckResponse.json();
          setErc20TransactionCheckData(erc20TransactionCheckData);
        } catch (e) {
          setErc20TransactionCheckData(null as any);
        }

        // テスト結果確認
        try {
          const erc20TestResponse = await fetch(
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
          const erc20TestResponseData = await erc20TestResponse.json();
          setErc20TestResult(erc20TestResponseData);
        } catch (e) {
          setErc20TestResult(null as any);
        }

        // 関数リスト確認
        try {
          const erc20FunctionCheck = await fetch(
            "https://hackathon-security.herokuapp.com/erc20FunctionCheck",
            {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ contractAddress, network }),
            }
          );
          const erc20FunctionCheckData = await erc20FunctionCheck.json();
          setErc20FunctionCheck(erc20FunctionCheckData);
        } catch (e) {
          setErc20FunctionCheck(null as any);
        }
      }
    })();
  }, [contractAddress, network]);

  return (
    <ResultTemplate
      isScam={isScam}
      transactionData={erc20TransactionCheckData}
      testData={erc20TestResult}
      functionCheckData={erc20FunctionCheck}
    />
  );
};

export default Home;
