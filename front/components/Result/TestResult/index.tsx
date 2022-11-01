import * as React from "react";
import type { NextPage } from "next";
import { Box, Text, Flex, Image } from "@chakra-ui/react";

const testSuccessItemList = ["Folder", "Graph", "Search", "Wallet"];
const testItemList = ["Calendar", "Scan", "Message", "Activity"];
type Props = {
  data: any;
};
export const TestResult: React.FC<Props> = (props) => {
  const [content, setContent] = React.useState<string>("");
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        Smart Contract Test Result
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
              {testSuccessItemList.map((func) => (
                <Box
                  onClick={() => setContent(func)}
                  width="90px"
                  padding="8px"
                  cursor="pointer"
                  marginTop="12px"
                  key={func}
                  marginLeft="60px"
                >
                  <Image src={`/icon/testSuccessIcon/${func}.svg`} />
                  <Text
                    fontSize="16px"
                    fontWeight="bold"
                    textAlign="center"
                    marginTop="8px"
                  >
                    {func}
                  </Text>
                </Box>
              ))}
              {testItemList.map((func) => (
                <Box
                  onClick={() => setContent(func)}
                  width="90px"
                  padding="8px"
                  cursor="pointer"
                  marginTop="12px"
                  key={func}
                  marginLeft="60px"
                >
                  <Image src={`/icon/testIcon/${func}.svg`} />
                  <Text
                    fontSize="16px"
                    fontWeight="bold"
                    textAlign="center"
                    marginTop="8px"
                  >
                    {func}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
          <Box
            padding="20px 0"
            borderRadius="18px"
            marginTop="20px"
            width="100%"
          >
            <Image
              margin="0 auto"
              src={`/icon/testSuccessIcon/${content}.svg`}
              boxSize="120px"
            />
            <Text
              fontSize="32px"
              fontWeight="bold"
              marginTop="20px"
              textAlign="center"
            >
              {content}
            </Text>
            <Text fontSize="18px" marginTop="20px" textAlign="center">
              テストの説明を書くテストの説明を書くテストの説明を書くテストの説明を書く
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default TestResult;
