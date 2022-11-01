export const getTestInfo = (testName: string): TestObject | undefined => {
  switch (testName) {
    case "result_symbol_name":
      return {
        title: "シンボル名のテスト",
        text: "シンボル名が登録されている",
        errorText: "シンボル名が登録されていません",
      };
    case "result_contract_name":
      return {
        title: "コントラクト名のテスト",
        text: "コントラクト名が登録されている",
      };
    case "result_decimal":
      return {
        title: "token単位のテスト",
        text: "単位は数値である",
      };
    case "result_balance":
      return {
        title: "トークン残高のテスト",
        text: "ownerが全トークンを初期持っている",
      };
    case "result_cant_transfer_by_owner":
      return {
        title: "トークンオーナーのTransferテスト",
        text: "このトークンはトークンを保有していないとTransferできません",
        errorText:
          "このトークンはコントラクトオーナーによって操作される可能性があります",
      };
    case "result_cant_transfer_by_user":
      return {
        title: "トークンTransferテスト",
        text: "このトークンはトークン保有分以上はTransferできません",
        errorText: "",
      };
    case "result_transfer_1":
      return {
        title: "トークンTransferテスト1",
        text: "このトークンは総発行分全てのトークンを正常にTransferできます",
        errorText: "このトークンはTransferできない可能性があります",
      };
    case "result_transfer_2":
      return {
        title: "トークンTransferテスト2",
        text: "このトークンは別のユーザーに正常にTransferできます",
      };
    case "result_not_approve_0":
      return {
        title: "Approveテスト1",
        text: "トークンに対してApproveしていないときはトークンは転送されません",
        errorText: "承認していない場合でもトークンが転送される可能性があります",
      };
    case "result_not_approve_amount":
      return {
        title: "トークンapproveテスト",
        text: "トークンに対してApproveしていないときは転送できるトークン量は0に設定されています",
      };
    case "result_approve_user_1":
      return {
        title: "トークン使用許可テスト",
        text: "承認されたアドレスは、トークンを使用することができます。",
      };
    case "result_approve_user_2":
      return {
        title: "コントラクト名のテスト",
        text: "承認されたアドレスは、承認された金額以上のトークンを使用することはできません。",
      };
    case "result_approve_user_3":
      return {
        title: "コントラクト名のテスト",
        text: "承認されていないアドレスは、トークンを使用することはできません。",
        errorText:
          "承認されていないアドレスにトークンを使用される可能性があります",
      };
    case "result_transferfrom_owner":
      return {
        title: "Transferテスト1",
        text: "トークンを持っていない場合はトークン転送することができません",
      };
    case "result_transferfrom_user":
      return {
        title: "Transferテスト2",
        text: "トークンを持ってる分以上はTransferできません",
      };
  }
};

type TestObject = {
  text: string;
  title: string;
  errorText?: string;
};
