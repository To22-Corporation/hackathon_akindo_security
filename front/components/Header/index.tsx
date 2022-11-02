import type { NextPage } from "next";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Logo } from "../Logo";
import Link from "next/link";

export const Header: NextPage = () => {
  return (
    <Flex
      backgroundColor="#F5F5F5"
      padding="16px 80px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box width="160px">
        <Logo />
      </Box>
      <Flex>
        <Text fontSize="18px" marginLeft="16px" fontWeight="bold">
          <Link href="/">Top</Link>
        </Text>
        <a
          href="https://securitywise.studio.site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text fontSize="18px" marginLeft="16px" fontWeight="bold">
            LP
          </Text>
        </a>
      </Flex>
    </Flex>
  );
};

export default Header;
