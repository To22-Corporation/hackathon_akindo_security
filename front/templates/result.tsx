import * as React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
import {
  Input,
  Button,
  Flex,
  Center,
  Text,
  Image,
  Spinner,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { Functions } from "../components/Result/Functions";
import { OwnerAndTx } from "../components/Result/OwnerAndTx";
import { TestResult } from "../components/Result/TestResult";

type Props = {
  isScam: boolean;
  transactionData: any;
  testData: any;
  functionCheckData: any;
};

const Result: React.FC<Props> = (props) => {
  const [content, setContent] = React.useState<number>(0);

  const getCircularColor = (score: number): string | undefined => {
    if (score < 30) {
      return "red.500";
    }
    if (30 < score && score < 70) {
      return "yellow.300";
    }
    if (score > 70) {
      return "green.400";
    }
  };
  console.log("isScam :", props.isScam);
  console.log("transactionData :", props.transactionData);
  console.log("testData :", props.testData);
  console.log("functionCheckData :", props.functionCheckData);

  if (props.isScam)
    return (
      <Box
        width="100%"
        borderRadius="30px"
        backgroundColor="#F9F9F9"
        padding="20px 80px"
        marginTop="16px"
      >
        <Image src="/icon/scam.svg" boxSize="80px" margin="0 auto" />
        <Text
          fontWeight="bold"
          fontSize="28px"
          textAlign="center"
          marginTop="16px"
        >
          悪意のあるトークンです
        </Text>
        <Link href="/">
          <Center marginTop="40px">
            <Button>Topへ戻る</Button>
          </Center>
        </Link>
      </Box>
    );

  if (!props.functionCheckData && !props.testData && !props.transactionData) {
    return (
      <Box textAlign="center" marginTop="40px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text fontWeight="bold" fontSize="28px" marginTop="20px">
          コントラクトの診断中...
        </Text>
      </Box>
    );
  }

  return (
    <Box padding="60px 40px">
      <Box
        width="100%"
        borderRadius="30px"
        backgroundColor="#F9F9F9"
        padding="20px 80px"
      >
        <Text fontWeight="bold" fontSize="28px" textAlign="center">
          測定結果
        </Text>

        <Box marginTop="24px">
          <Flex justifyContent="space-between">
            <Box
              onClick={() => setContent(0)}
              cursor="pointer"
              width="260px"
              backgroundColor={content === 0 ? "gray.100" : "white"}
              textAlign="center"
              padding="40px"
              borderRadius="18px"
              boxShadow="0px 4px 4px rgba(0, 0.1, 0, 0.15)"
            >
              {props.testData ? (
                <CircularProgress
                  size="160px"
                  value={props.testData?.score}
                  color={getCircularColor(props.testData?.score)}
                >
                  <CircularProgressLabel>
                    {props.testData?.score}%
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                <CircularProgress isIndeterminate color="green.400" />
              )}

              <Text marginTop="60px" alignItems="center" fontWeight="bold">
                SmartContract Test Result
              </Text>
            </Box>

            <Box
              onClick={() => setContent(1)}
              cursor="pointer"
              textAlign="center"
              width="260px"
              backgroundColor={content === 1 ? "gray.100" : "white"}
              padding="40px"
              borderRadius="18px"
              boxShadow="0px 4px 4px rgba(0, 0.1, 0, 0.15)"
            >
              {props.transactionData ? (
                <CircularProgress
                  value={props.transactionData?.score}
                  color={getCircularColor(props.transactionData?.score)}
                  size="160px"
                >
                  <CircularProgressLabel>
                    {props.transactionData?.score}%
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                <CircularProgress isIndeterminate color="green.400" />
              )}

              <Text marginTop="60px" alignItems="center" fontWeight="bold">
                Rugpull risk check
              </Text>
            </Box>

            <Box
              onClick={() => setContent(2)}
              cursor="pointer"
              textAlign="center"
              width="260px"
              backgroundColor={content === 2 ? "gray.100" : "white"}
              padding="40px"
              borderRadius="18px"
              boxShadow="0px 4px 4px rgba(0, 0.1, 0, 0.15)"
            >
              {props.functionCheckData ? (
                <CircularProgress
                  size="160px"
                  value={props.functionCheckData?.score}
                  color={getCircularColor(props.functionCheckData?.score)}
                >
                  <CircularProgressLabel>
                    {props.functionCheckData?.score}%
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                <CircularProgress isIndeterminate color="green.400" />
              )}

              <Text marginTop="60px" alignItems="center" fontWeight="bold">
                Function List
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box marginTop="40px" backgroundColor="#F9F9F9" padding="40px 120px">
        <Box marginTop="40px">
          {content === 0 ? (
            <TestResult data={props.testData} />
          ) : content === 1 ? (
            <OwnerAndTx data={props.transactionData} />
          ) : content === 2 ? (
            <Functions data={props.functionCheckData.otherFunction} />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Result;
