import * as React from "react";
import type { NextPage } from "next";
import { Box, Text, Flex, Image } from "@chakra-ui/react";
import { getTestInfo } from "../../../util/getTestInfo";

type Props = {
  data: Record<string, boolean>;
};

export const TestResult: React.FC<Props> = (props) => {
  const [content, setContent] = React.useState<string>("");
  const testItems = props.data && Object.keys(props.data);

  const getTestResult = (key: string) => {
    if (key === "") return false;
    return props.data[key];
  };

  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        Smart Contract Test Result
      </Text>
      <Text fontSize="18px" textAlign="center" marginTop="12px">
        テスト結果が正常な場合色付けされます
      </Text>
      <Box>
        <Flex justifyContent="center">
          <Box
            padding="20px"
            marginTop="20px"
            marginRight="20px"
            borderRight="1px solid #D2D1D1"
          >
            <Flex maxWidth="600px" flexWrap="wrap">
              {testItems?.map((item) =>
                item === "score" ? null : (
                  <Box
                    onClick={() => setContent(item)}
                    width="90px"
                    padding="8px"
                    cursor="pointer"
                    marginTop="12px"
                    key={item}
                    marginLeft="60px"
                  >
                    {getTestResult(item) ? (
                      <Image src={`/icon/testSuccessIcon/${item}.svg`} />
                    ) : (
                      <Image src={`/icon/testIcon/${item}.svg`} />
                    )}
                    <Text
                      fontSize="14px"
                      fontWeight="bold"
                      textAlign="center"
                      marginTop="8px"
                    >
                      {getTestInfo(item)?.title}
                    </Text>
                  </Box>
                )
              )}
            </Flex>
          </Box>
          <Box
            padding="20px 0"
            borderRadius="18px"
            marginTop="20px"
            width="40%"
            maxWidth="400px"
          >
            <Box
              backgroundColor="white"
              borderRadius="18px"
              padding="40px 20px"
              height="100%"
              boxShadow="0px 4px 4px rgba(0, 0.1, 0, 0.15)"
            >
              <Image
                margin="0 auto"
                src={
                  !!content
                    ? getTestResult(content)
                      ? `/icon/testSuccessIcon/${content}.svg`
                      : `/icon/testIcon/${content}.svg`
                    : `/icon/testIcon/result_balance.svg`
                }
                boxSize="120px"
              />
              <Text
                fontSize="32px"
                fontWeight="bold"
                marginTop="20px"
                textAlign="center"
              >
                {getTestInfo(content)?.title}
              </Text>
              <Text fontSize="18px" marginTop="20px" textAlign="center">
                {getTestInfo(content)?.text}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default TestResult;
