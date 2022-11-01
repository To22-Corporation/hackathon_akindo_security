import * as React from "react";
import type { NextPage } from "next";
import { Box, Text, Flex, Image } from "@chakra-ui/react";
import { getTestInfo } from "../../../util/getTestInfo";

type TestItem = {
  result_approve_user_1: boolean;
  result_approve_user_2: boolean;
  result_approve_user_3: boolean;
  result_balance: boolean;
  result_cant_transfer_by_owner: boolean;
  result_cant_transfer_by_user: boolean;
  result_contract_name: boolean;
  result_decimal: boolean;
  result_not_approve_0: boolean;
  result_not_approve_amount: boolean;
  result_symbol_name: boolean;
  result_transfer_1: boolean;
  result_transfer_2: boolean;
  result_transferfrom_owner: boolean;
  result_transferfrom_user: boolean;
};

type Props = {
  data: Record<string, boolean>;
};

export const TestResult: React.FC<Props> = (props) => {
  const [content, setContent] = React.useState<string>("");
  const testItems = Object.keys(props.data);

  const getTestResult = (key: string) => {
    console.log("key: ", testItems[0]);
    console.log("keyResult: ", props.data[key]);

    return props.data[key];
  };
  console.log("testItems ;", testItems);

  console.log("test items 0", testItems[0]);
  console.log("test items 0", getTestResult(testItems[0]));
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
              {testItems.map((item) => (
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
                    <Image src={`/icon/testIcon/Activity.svg`} />
                  )}
                  <Text
                    fontSize="16px"
                    fontWeight="bold"
                    textAlign="center"
                    marginTop="8px"
                  >
                    {getTestInfo(item)?.title}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
          <Box
            padding="20px 0"
            borderRadius="18px"
            marginTop="20px"
            width="40%"
          >
            <Box
              backgroundColor="white"
              borderRadius="18px"
              padding="20px"
              height="100%"
              boxShadow="0px 4px 4px rgba(0, 0.1, 0, 0.15)"
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
