import type { NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";

export const TestResult: NextPage = () => {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        Smart Contract Test Result
      </Text>
    </Box>
  );
};

export default TestResult;
