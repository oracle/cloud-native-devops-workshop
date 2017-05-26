## 重要: ハンズオンのための事前準備

**1.** ***Oracle Cloudアカウントの取得***
- [Try It](https://shop.oracle.com/r/promo?sc=codeny_hol2_cloudpromotion) からOracle Cloudのトライアル環境を取得します。

**2.** ***ローカル環境の設定***
- ***ハンズオンに参加する前に*** クライアント環境を準備しておく必要があります。
- ハンズオン用Virtual Boxイメージをダウンロードし、起動の確認を行ってください。
- ダウンロードリンク、設定手順は[ハンズオンセットアップガイド](StudentGuide.md)を参考にしてください。

**3.** ***ラボガイドの確認***

- ラボガイドは下記リンクにアップロードされています。
- [GitHub Pages (日本語版)](https://oracle.github.io/cloud-native-devops-workshop/microservices_JP)
- [GitHub Pages (英語版)](https://oracle.github.io/cloud-native-devops-workshop/microservices)

- ラボガイドの左上のメニューアイコンをクリックすると、Lab 100 - 400までのガイドに移動出来ます。

    ![](images/WorkshopMenu.png)  

- ハンズオンの概要は[Workshop Interactive Labguide](http://launch.oracle.com/?cloudnative)から確認できます。こちらは英語版のみの提供となります。

## クラウド･ネイティブ･マイクロサービス ハンズオン

このハンズオンではソフトウェア開発ライフサイクル(Software Development Lifecycle (SDLC))の流れを複数のマイクロサービスを作成・利用するクラウドネイティブプロジェクト通して理解していきます。ハンズオンラボでは一人のユーザとしてログインし作業を進めますが、下記3人のユーザの作業を行います。このハンズオンでは**Oracle Developer Cloud Service**と**Oracle Application Container Cloud Service**を使用し、アプリケーション開発を行います。

- **プロジェクトマネージャ**<br>
  プロジェクトの作成、行なうタスクの追加、開発者へのタスクのアサインを行い、Sprintを開始します。

- **Java開発者**<br>
  twitterのデータ取得・フィルタリングが出来るtwitterフィードサービスの開発を行います。

- **JavaScript開発者**<br>
  twitterデータ分析のためのtwitterマーケティング画面を作成します。

## ハンズオン詳細

## Lab 100: Agile Project Management

**ドキュメント**: [CloudNative100.md](CloudNative100.md)

### ゴール

- プロジェクトを作成
    - プロジェクトへユーザを追加
- Issueを作成
    - TwitterフィードマイクロサービスのIssueを作成
    - TwitterフィードマーケティングUIのIssueを作成
- Agile BoardとSprintを作成
- SprintへIssueを追加

## Lab 200: Continuous Delivery of Java Microservices

**ドキュメント**: [CloudNative200.md](CloudNative200.md)

### ゴール

- Developer Cloud Serviceへアクセス
- 外部Gitリポジトリからのソースコードのインポート
- プロジェクトのEclipseへのインポート
- Developer Cloud Service, Application Container Cloud Serviceを使用したプロジェクトのビルド&デプロイ

## Lab 300: Cloud Native Rapid JavaScript Development with node.js

**ドキュメント**: [CloudNative300.md](CloudNative300.md)

### ゴール

- Developer Cloud Serviceへアクセス
- 外部Gitリポジトリからのソースコードのインポート
- プロジェクトのBracketsへのインポート
- Developer Cloud Service, Application Container Cloud Serviceを使用したプロジェクトのビルド&デプロイ

## Lab 400:  Cloud Native Developer Cloud Service Administration

**ドキュメント**: [CloudNative400.md](CloudNative400.md)

### ゴール

- Developer Cloud Serviceへアクセス
- Sprintの完了
- バックログ、Sprintレポートの確認
- 管理作業の確認
