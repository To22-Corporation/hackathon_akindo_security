import type { NextPage } from "next";
import { Box, Text, Flex, Image } from "@chakra-ui/react";

type Props = {
  data: any;
};
export const OwnerAndTx: React.FC<Props> = (props) => {
  const Message: React.FC<any> = (props: any) => {
    if (props.score == 100 || props.score == 80) {
      return <p>トークン保有者は分散しています</p>;
    } else if (props.score == 60) {
      return <p>トークンはある程度分散しています</p>;
    } else if (props.core == 40 || props.score == 20) {
      return <p>トークン保有者にやや偏りがあります</p>;
    } else {
      return <p>トークン保有者に偏りがあります</p>;
    }
  };
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        <Message score={props.data.score} />
      </Text>
    </Box>
  );
};

export default OwnerAndTx;
