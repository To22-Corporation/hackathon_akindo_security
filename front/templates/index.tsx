import type { NextPage } from "next";
import { Box } from "@chakra-ui/react";
import { Input, Button, Flex, Center } from "@chakra-ui/react";

type Props = {
  onSubmit: () => void;
};

import { useForm } from "react-hook-form";
const Index: React.FC<Props> = (props) => {
  const { setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      contractAddress: "0x",
    },
  });

  return (
    <Box
      padding="40px 20px"
      //   backgroundColor={{
      //     base: "red.200",
      //     sm: "yellow.200",
      //     md: "green.200",
      //     lg: "blue.200",
      //   }}
    >
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <Center>
          <Input
            onChange={(data) => {
              console.log("data :", data.target.value);
              setValue("contractAddress", data.target.value);
            }}
            maxWidth="800px"
            id="contractAddress"
            size="md"
            placeholder="コントラクトアドレスを入力してください"
            isInvalid
            errorBorderColor="red.300"
          ></Input>
          <Button type="submit" marginLeft="16px" colorScheme="blue">
            分析
          </Button>
        </Center>
      </form>
    </Box>
  );
};

export default Index;
