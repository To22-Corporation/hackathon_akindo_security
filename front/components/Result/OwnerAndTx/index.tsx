import type { NextPage } from "next";
import { Box, Text, Flex, Image } from "@chakra-ui/react";

type Props = {
  txAmount?: number;
  userAmount: number;
};
export const OwnerAndTx: NextPage = () => {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        Number of Owner and Transaction
      </Text>
      <Flex justifyContent="space-between" alignItems="center" marginTop="60px">
        <Box>
          <Image src="/icon/addUser.svg" margin="0 auto" />
          <Text
            fontWeight="bold"
            fontSize="48px"
            marginTop="40px"
            textAlign="center"
          >
            10000 address owner
          </Text>
        </Box>
        <Box>
          <Image src="/icon/swap.svg" margin="0 auto" />
          <Text
            fontWeight="bold"
            fontSize="48px"
            marginTop="40px"
            textAlign="center"
          >
            10000 address owner
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default OwnerAndTx;
