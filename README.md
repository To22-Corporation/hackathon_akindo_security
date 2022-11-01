# 💻 {Productname} : Tokyo Web3 Hackathon 2022

## [DemoPage](URL "aaa")

# 🚀 プロダクト概要

スマコン監査民主化ツール「SecurityWise」  
「web3をやり始めたが、Scam被害が多くて、正直怖い・・・」  
「安全かどうかコントラクトをいちいち見に行くのが面倒・・・」  
そんな声にお応えし、web3ユーザーのセキュリティ周りの悩みを解決する「SecurityWise」が生まれました！  

★ポイント  
◎各チェーン毎にトークンの脆弱性リスクを簡単に分析できる  
◎脆弱性リスクの所在、判断根拠の詳細も透明化されており、自身のリテラシー向上にも繋がる  
◎Cheome拡張機能も備えており、スマコンの署名時に怪しいものはブロックできる  

web3ユーザーの98%はスマコンを読まない/読めないと言われています。  
ハッカーからすると、ウハウハな状況。こんな状況に対して、  
"スマコン監査のスキルを民主化する"をミッションにSecurityWiseは立ち上がりました。  
web3の世界は非常に魅力的で、あらゆる人にとって楽しい領域だと思っています。  
但し、安心がないところに、楽しめる心も宿りません。  
あなたもSecurityWiseを導入して、web3世界における安心を手にした上で、web3世界を存分に楽しんでいきましょう。 

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
