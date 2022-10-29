import * as React from "react";
import type { NextPage } from "next";
import { Box } from "@chakra-ui/react";
import { Input, Button, Flex, Center, Text, Image } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Functions } from "../components/Result/Functions";
import { OwnerAndTx } from "../components/Result/OwnerAndTx";
import { TestResult } from "../components/Result/TestResult";

type Props = {};

const Result: React.FC<Props> = (props) => {
  const [content, setContent] = React.useState<number>(0);
  return (
    <Box padding="60px 40px">
      <Box
        width="100%"
        borderRadius="30px"
        backgroundColor="#F9F9F9"
        padding="60px 120px"
      >
        <Text fontWeight="bold" fontSize="28px" textAlign="center">
          測定結果
        </Text>
        <Box marginTop="24px">
          <Flex justifyContent="space-between">
            <Box
              onClick={() => setContent(0)}
              cursor="pointer"
              width="200px"
              textAlign="center"
            >
              <Image src="/green-graph.svg" margin="0 auto" />
              <Text marginTop="60px" alignItems="center" fontWeight="bold">
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
              <Text marginTop="60px" alignItems="center" fontWeight="bold">
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
            <Functions />
          ) : content === 1 ? (
            <OwnerAndTx />
          ) : content === 2 ? (
            <TestResult />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Result;
