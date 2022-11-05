import type { NextPage } from "next";
import * as React from "react";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  Input,
  Button,
  Flex,
  Center,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";

type Props = {
  onSubmit: (contractAddress: string, network: string) => void;
};

import { useForm } from "react-hook-form";

const Index: React.FC<Props> = (props) => {
  const [radioValue, setRadioValue] = React.useState<string>("eth");
  const { setValue, handleSubmit, getValues } = useForm({
    defaultValues: {
      contractAddress: "0x",
      network: "eth",
    },
  });
  const router = useRouter();
  setValue("contractAddress", router.query.address as string);

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
      <form
        onSubmit={handleSubmit(() =>
          props.onSubmit(getValues("contractAddress"), radioValue)
        )}
      >
        <Box>
          <RadioGroup
            onChange={(value) => setRadioValue(value)}
            value={radioValue}
          >
            <Stack direction="row" justifyContent="center">
              <Radio value="eth">ethereum</Radio>
              <Radio value="polygon">polygon</Radio>
              <Radio value="bsc">bsc</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Center marginTop="16px">
          <Input
            onChange={(data) => setValue("contractAddress", data.target.value)}
            maxWidth="800px"
            defaultValue={getValues("contractAddress")}
            id="contractAddress"
            size="md"
            placeholder="コントラクトアドレスを入力してください"
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
