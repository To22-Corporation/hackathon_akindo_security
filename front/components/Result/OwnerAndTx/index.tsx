import type { NextPage } from "next";
import { Box, Text, Flex, Image } from "@chakra-ui/react";

type Props = {
  data: any;
};
export const OwnerAndTx: React.FC<Props> = (props) => {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        上位20人が全体の約{props.data.score}%のトークンを保有しています
      </Text>
    </Box>
  );
};

export default OwnerAndTx;
