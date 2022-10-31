import * as React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
import { Input, Button, Flex, Center, Text, Image } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Functions } from "../components/Result/Functions";
import { OwnerAndTx } from "../components/Result/OwnerAndTx";
import { TestResult } from "../components/Result/TestResult";
import { Spinner } from "@chakra-ui/react";

type Props = {
  data: any;
  isScam: boolean;
};

const Result: React.FC<Props> = (props) => {
  const [content, setContent] = React.useState<number>(0);

  return (
    <Box padding="60px 40px">
      {props.data || !!props.isScam ? (
        <>
          {props.isScam ? (
            <>
              <Text fontWeight="bold" fontSize="28px" textAlign="center">
                測定結果
              </Text>
              <Box
                width="100%"
                borderRadius="30px"
                backgroundColor="#F9F9F9"
                padding="40px 80px"
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
            </>
          ) : (
            <>
              <Box
                width="100%"
                borderRadius="30px"
                backgroundColor="#F9F9F9"
                padding="40px 80px"
              >
                <Text fontWeight="bold" fontSize="28px" textAlign="center">
                  測定結果
                </Text>
                {props.isScam ? <>scam contract</> : <></>}
                <Box marginTop="24px">
                  <Flex justifyContent="space-between">
                    <Box
                      onClick={() => setContent(0)}
                      cursor="pointer"
                      width="200px"
                      textAlign="center"
                    >
                      <Image src="/green-graph.svg" margin="0 auto" />
                      <Text
                        marginTop="60px"
                        alignItems="center"
                        fontWeight="bold"
                      >
                        Owner {"&"} Transaction
                      </Text>
                    </Box>
                    <Box
                      onClick={() => setContent(1)}
                      cursor="pointer"
                      width="200px"
                      textAlign="center"
                    >
                      <Image src="/yellow-graph.svg" margin="0 auto" />
                      <Text
                        marginTop="60px"
                        alignItems="center"
                        fontWeight="bold"
                      >
                        SmartContract Test Result
                      </Text>
                    </Box>
                    <Box
                      onClick={() => setContent(2)}
                      cursor="pointer"
                      width="200px"
                      textAlign="center"
                    >
                      <Image src="/yellow-graph.svg" margin="0 auto" />
                      <Text
                        marginTop="60px"
                        alignItems="center"
                        fontWeight="bold"
                      >
                        Function List
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Box>

              <Box
                marginTop="40px"
                backgroundColor="#F9F9F9"
                padding="40px 120px"
              >
                <Box marginTop="40px">
                  {content === 0 ? (
                    <TestResult />
                  ) : content === 1 ? (
                    <OwnerAndTx />
                  ) : content === 2 ? (
                    <Functions />
                  ) : null}
                </Box>
              </Box>
            </>
          )}
        </>
      ) : (
        <Box textAlign="center">
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
      )}
    </Box>
  );
};

export default Result;
