import type { NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";

export const OwnerAndTx: NextPage = () => {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        Number of Owner and Transaction
      </Text>
    </Box>
  );
};

export default OwnerAndTx;
