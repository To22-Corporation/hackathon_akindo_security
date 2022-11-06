import type { NextPage } from "next";
import { Box, Text, ListItem, UnorderedList } from "@chakra-ui/react";

const functionList = ["hogehoge", "hugahuga", "piyopiyo"];
type Props = {
  data: any;
};

export const Functions: React.FC<Props> = (props) => {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="28px" textAlign="center">
        Functions
      </Text>
      <Box>
        {props.data ? (
          <>
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
                {props.data.map((func: any) => (
                  <ListItem
                    fontSize="26px"
                    padding="8px"
                    fontWeight="bold"
                    cursor="pointer"
                    _hover={{ backgroundColor: "#F9F9F9" }}
                    key={func}
                  >
                    {func}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default Functions;
