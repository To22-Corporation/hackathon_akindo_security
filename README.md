# 💻 {Productname} : Tokyo Web3 Hackathon 2022

## [DemoPage](URL "aaa")

# 🚀 プロダクト概要

# 🎬 ピッチ＆デモ

# 💬 課題

# 💡 解決方法

# 💻 Devlopment

## Tech stacks

Frontend: Next.js, Typescript
Backend: Node.js, Hardhat

## Blockchain

Ehtereum、Polygon、BNB Smart Chain

##

Step1. 我々は SCAM と報告されているコントラクトをリスト化しており、そのリストに含まれているアドレスではないかを確認します。
リストでは現在 7000 個程度のコントラクトを管理しています。

Step2. リスト上で管理されていないトークンに関しては、以下の 3 種類の方法でチェックを行います。
※Verify されているコントラクトのみ

Step2-1. テストの実行
コントラクト自体の動作に問題がないかをチェックするため、hardhat と chai を用いてコントラクトの動作確認を行います。
テストには 15 個の項目があり、通過した数で採点がなされます。

Step2-2. 関数名の確認
ERC20 規格との比較を行い、独自で実装されている関数のチェックを行います。
また、独自で実装されている関数の中に怪しいものがないか、スキャムでよく使われている関数がないかをチェックします。
関数自体の評価はこの項目ではできませんが、Solidity が読めない人にとっても注意すべき関数はあるか、ある場合、それはどれなのかを絞ることができます。
また、コントラクトの監査を依頼することも可能です（※有料）

Step2-3.

# FutureWork

```shell
npm install
node index.js
curl -w '\n' 'http://localhost:3000/erc20Test' --data "contractAddress=XXXXXX&network=bsc/eth/polygon" -XPOST

```
