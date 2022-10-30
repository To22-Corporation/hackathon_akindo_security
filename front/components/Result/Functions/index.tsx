import type { NextPage } from "next";
import { Box, Text, ListItem, UnorderedList } from "@chakra-ui/react";

const functionList = ["hogehoge", "hugahuga", "piyopiyo"];
export const Functions: NextPage = () => {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        Functions
      </Text>
      <Box>
        <Text fontWeight="bold" fontSize="24px" marginTop="20px">
          ERC20規格外の関数の一覧
        </Text>
        <Box
          backgroundColor="#FFF"
          padding="20px 0"
          borderRadius="18px"
          marginTop="20px"
        >
          <UnorderedList listStyleType="none">
            {functionList.map((func) => (
              <ListItem
                fontSize="28px"
                padding="8px"
                fontWeight="bold"
                cursor="pointer"
                _hover={{ backgroundColor: "#F9F9F9" }}
                marginTop="20px"
                key={func}
              >
                {func}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
};

export default Functions;
