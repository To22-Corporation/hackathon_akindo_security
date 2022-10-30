import type { NextPage } from "next";
import { Box, Image } from "@chakra-ui/react";

export const Logo: React.FC = () => {
  return (
    <Image
      src="/logo.png"
      backgroundRepeat="no-repeat"
      backgroundSize="contain"
    />
  );
};

export default Logo;
