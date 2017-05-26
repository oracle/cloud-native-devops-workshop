![](images/300/PictureLab.png)  

Update: March 31, 2017

## Introduction

このハンズオンラボは**クラウド･ネイティブ･マイクロサービス ハンズオン**の三つ目のラボです。このハンズオンではソフトウェア開発ライフサイクル(Software Development Lifecycle (SDLC))の流れを複数のマイクロサービスを作成・利用するクラウドネイティブプロジェクト通して理解していきます。

Lab 200ではJava開発者(Bala Gupta)がTwitterからデータを取得し、キーワードでフィルタリングするマイクロサービスを作成しました。このラボ(Lab 300)ではフロントエンドJavaScript開発者として、Balaが作成したマイクロサービスから取得したデータを表示するNode.jsのWebアプリケーションを作成します。Developer Cloud Serviceでのビルド、Application Container Cloud Serviceのインスタンス上へのデプロイを自動化する設定を行います。

## ゴール

- Developer Cloud Serviceへアクセス
- 外部Gitリポジトリからのソースコードのインポート
- プロジェクトのBracketsへのインポート
- Developer Cloud Service, Application Container Cloud Serviceを使用したプロジェクトのビルド&デプロイ

## 前提条件

- Lab 200が完了していること
- Oracle Public Cloud環境にアクセスが出来ること
- 最新版のBracketsがインストールされていること(Virtual Box内に予め設定済です。)


# TwitterマーケティングUIの作成

## Developer Cloud Service

### **STEP 1**: Agile Boardの確認

- このラボではDeveloper Cloud Serviceを使用するので、ダッシュボードを開いていない場合は、再度ダッシュボードを開き"Twitter Feed Marketing Project"を表示してください。

    ![](images/200/Picture10.5.png)  

- Trial登録時に作成したユーザアカウントを使用してハンズオンを進めますが、下記のSTEPは**John Dunbar**の手順として進めます。

    ![](images/john.png)  

- 左側のナビゲーションパネルで**Agile**をクリックします。

    ![](images/300/image012.png)  

- **Microservices**をクリックして、**Active Sprints** を選択します。

    ![](images/300/image014.5.png)  

## 初期Gitリポジトリの作成

### **STEP 2**: 初期Gitリポジトリの作成

TwitterマーケティングUIの開発に先立って、同僚が事前に大枠のアプリケーションを作成しています。そのため、このハンズオンでは一からコーディングを行なうのではなく、外部Gitリポジトリに配置されているソースコードをDeveloper Cloud Serviceにcloneして、そこにTwitterマイクロサービスとの接続機能を追加していきます。同僚のGitリポジトリ内のソースコードをプルするために、Developer Cloud Serviceへリポジトリのクローンを行います。まず初めにAgile Boardを使用してタスクを開始します。

- **Task 3 - Create Initial GIT Repository for Twitter Marketing UI**を**In Progress**のエリアにドラッグ&ドロップします。**Change Progress**のポップアップが表示されたら、**OK** をクリックします。

    ![](images/300/image015.png)  

    ![](images/300/image016.5.png)  

- 左側のナビゲーションパネルの**Project**をクリックします。

- 右側の**REPOSITORIES**セクションで**New Repository**をクリックして、新しいGitリポジトリを作成します。

    ![](images/300/image017.png)  

- **New Repository**ウィザードが作成されたら、下記のデータを入力し、**Create**をクリックします。

    **Name:** `TwitterMarketingUIMicroservice`

    **Description:** `Twitter Marketing UI Microservice`

    **Initial content:** Import existing repository を選択し次のURLを入力 `https://github.com/pcdavies/JETTwitterQuickStart.git`

    ![](images/300/image018.5.png)  

- これで外部リポジトリからcloneしたDeveloper Cloud Service上のGitリポジトリの作成が完了しました。

    ![](images/300/image019.png)  

## デフォルトビルド、デプロイジョブの作成

### **STEP 3**: Create Default Build Process

Gitリポジトリにソースコードを取り込めたので、masterブランチへのpushをトリガーにしたビルドジョブの作成を行います。このハンズオンではMavenビルドジョブの設定を行います。

- 左側のナビゲーションパネルで**Build**をクリックしてビルドページを表示し、**New Job** をクリックします。

    ![](images/300/image020.png)  

- **New Job**のポップアップでJob Nameに`Twitter Marketing UI Build`と入力し、**Save** をクリックします。

    ![](images/300/image021.png)  

- 正常にジョブが作成されると、設定画面に移動します。

    ![](images/300/image022.png)  

- **Source Control**タブをクリックします。

- **Git** のラジオボタンを選択し、Repositoryのプルダウンから**TwitterMarketingUIMicroservice.git**を選択します。

    **Note:** Twitter Feed Microserviceではなく、***Twitter Marketing UI Microservice*** のGitリポジトリを選択していることを確認してください。

    ![](images/300/image023.png)  

- **Triggers**タブをクリックします。

- **Based on SCM polling schedule** にチェックを入れます。

    ![](images/300/image024.png)  

- **Build Steps**タブをクリックします。

- **Add Build Step**をクリックし、**Execute shell** を選択します。

    ![](images/300/image025.png)  

- **Command**に**npm install** を設定します。

    ![](images/300/image026.png)  

- **Post Build**タブをクリックして、下記の設定を行います。
  - **Archive the artifacts**にチェックを入れます。
  - **Files to Archive**に`**/target/*`と入力します。
  - **Compression Type**のプルダウンで**GZIP** を選択します。

    ![](images/300/image027.png)  

- 右上の**Save**をクリックして設定を保存します。

- 1-2分でビルドが自動的に開始されます。ビルドが始まらない場合、**Build Now** をクリックし、ビルドの即時実行を行います。30秒から数分でキューされたジョブが実行され、下記のような状態に遷移します。

    ![](images/300/image028.png)  

- ビルドは数分で完了します。ビルドが完了すると成功したジョブの回数が**Test Result Trend**セクションに表示されます。ビルドで作成されたファイルをビルドジョブの設定で使用するため、***ビルドが完了するまで次のSTEPには進まないでください。***

    ![](images/300/image029.png)  

### **STEP 4**: デフォルトデプロイジョブの作成

プロジェクトのビルドが正常に完了したので、Application Container Cloud Serviceのインスタンスにビルドされたアプリケーションをデプロイするためのジョブを作成します。デプロイはビルド完了時に自動的に行われるように設定します。

- 左側のナビゲーションパネルの**Deploy**をクリックして、**Deployments**ページに移動し、右上の**New Configuration** をクリックします。

    ![](images/300/image030.png)  

    - **New Deployemnt Configuration**ウィザードに下記のデータを入力します。

    **Configuration Name:** `TwitterMarketingUIDeploy`

    **Application Name:** `JETFrontEndApp`

    ![](images/300/image031.png)  

- **Deployment Target**の右側にある**New**をクリックして、プルダウンから**Application Container Cloud** を選択します。

    ![](images/300/image032.png)  

- **Deploy to Application Container Cloud**のポップアップに下記のデータを入力します。

    **Data Center**: `<Your Assigned Datacenter>` ***(Ask instructor if needed)***

    **Identity Domain**: `<Your Identity Domain>`

    **Username**: `<Your User Name>`

    **Password**: `<Supplied Password>`

- データ入力後、**Test Connection**をクリックします。接続が成功したら、**Use Connection** をクリックします。

    ![](images/300/image033.2.png)  

- ウィザードで下記のデータを入力します。

  - **Runtime**: `Node`

  - **Subscription**: `Hourly`

  - **Type:** `Automatic`

  - **Job:** `Twitter Marketing UI`

  - **Artifact:** `target/jet-quickstart-client-dist.zip`

    ![](images/300/image034.png)  

- **Save** をクリックします。

    ![](images/300/image035.png)  

- 右上の歯車をクリックして、プルダウンから**Start**を選択します。

    ![](images/300/image036.png)  

- メッセージが**Starting application**から**Last deployment succeeded**に変わるまで待ちます。

    ![](images/300/image037.png)  

## TwitterマーケティングUIのデプロイの確認

### **STEP 5**: Issueステータスの変更

Application Container Cloud Serviceへのアプリケーションのデプロイが完了したので、Agile Boardのステータスの変更を行います。デプロイしたアプリケーションの機能確認を行なう前にAgile Board内のタスクのステータスを**Veryfy Code**に変更します。

- 左側のナビゲーションパネルで**Agile**をクリックして、**Active Sprints**をクリックします。

- **Task 3** from **In Progress**をドラッグ&ドロップして**Verify Code** エリアに移動します。

    ![](images/300/image039.2.png)  

- **Change Progress**ポップアップで**Next** をクリックします。

    ![](images/300/image040.png)  

- **Time Spent**を**1 days**に設定して、**OK** をクリックします。

    ![](images/300/image040.5.png)  

- これでコードが**Completed**へ移動する前の**Verification**のステータスとなりました。

    ![](images/300/image041.2.png)  

### **STEP 6**: Oracle Application Container Cloud Serviceへログイン

- Developer Cloud Serviceのサービス概要画面に戻り、右上の**Dashboard**からOracle Public Cloudダッシュボードへ移動します。サービスコンソールが残っていない場合、直接Oracle Public Cloudダッシュボードへ移動します。Note: セッションが切れている場合、再度ログインが必要な場合があります。

    ![](images/300/image042.2.png)  

- Oracle Public Cloudダッシュボードが表示されたら、**Application Container** の右上にある![](images/300/image043.png)をクリックし、プルダウンから**Open Service Console**を選択します。Note: **Application Container**が表示されていない場合、右上の**Customize Dashboard** から表示させる事が出来ます。

    ![](images/300/image044.png)  

- Application Container Cloud Service(ACCS)のサービスコンソールでは、先ほどデプロイした**JETFrontEndApp**を含め、全てのデプロイメントの一覧が表示されます。

    ![](images/300/image045.png)  

- **URL** をクリックもしくは**URL** をコピーしてアドレスバーに入力するとデプロイされたアプリケーションが開きます。

    ![](images/300/image046.png)  

### **STEP 7**: タスクの完了

これでTwitterマーケティングUIのデプロイと正常に稼働していることの確認が完了しました。最後にSprintでこのIssueのステータスを**Completed**に変更します。

- Developer Cloud Serviceのダッシュボード画面に戻り、左側のナビゲーションパネルで**Agile**をクリックして、**Active Sprints**をクリックします。

- **Task 3**をドラッグ&ドロップし、**Verify Code**から**Completed** に移動します。

    ![](images/300/image047.png)  

- **Change Progress**ポップアップで**Next** をクリックします。

    ![](images/300/image048.png)  

- **Time Spent**を**1 days**に設定して、**OK** をクリックします。

    ![](images/300/image048.5.png)  


- Sprintが下記のようになった事を確認します。

    ![](images/300/image049.2.png)  

# Twitterフィード表示機能の追加

ここまでのステップでTwitterフィード表示機能を追加するベースのアプリケーションが完成しました。このタスクではBracketsを利用してDeveloper Cloud Service上のソースコードを取得し、修正を加えます。修正が完了したら、直接自動デプロイが行われないようにレビュー用のブランチを作成し、ソースをコミットます。

### **STEP 8**: Issueステータスの変更

ソースコードの修正を行なう前にAgile Board内のタスクのステータスを**In Progress**に変更します。

- Developer Cloud Serviceダッシュボードに戻り、左側のナビゲーションパネルで**Agile**をクリックして、**Active Sprints**をクリックします。

- **Feature 4** from **To Do** をドラッグ&ドロップして**In Progress**エリアに移動します。

    ![](images/300/image050.2.png)  

- **Change Progress**ポップアップで**OK** をクリックします。

    ![](images/300/image051.png)  

## Bracketsへのプロジェクトのクローン

### **STEP 9**:	Bracketsの起動

これからの作業はVirtualBox環境内のEclipseを使用して行います。

- デスクトップの**Brackets**アイコンを右クリックし、**Open** を選択します。

    ![](images/300/image052.png)  

- Bracketsが起動したら、**TwitterMarketingUI** フォルダが開いていることを確認してください。

    ![](images/300/image053.2.png)  

### **STEP 10**: Git URLのコピー

- Developer Cloud Serviceダッシュボードに戻り、左側のナビゲーションパネルで**Project**をクリックして、右側の**TwitterMarketingUIMicroservice.git** のURLを確認し、右クリックからコピーを行ってください。

    ![](images/300/image054.2.png)  

### **STEP 11**: リポジトリのローカルクローンの作成

- Bracketsに戻り、エディタ右側にある![](images/300/image055.png)のようなGitアイコンをクリックします。

  ![](images/300/image055.5.png)  

- **Clone** をクリックします。

  ![](images/300/image056.png)  

- Developer Cloud Serviceダッシュボードで確認したGit URLを貼り付けます。ユーザ名は自動入力されますので、パスワードを入力して**Save credentials**をクリックします。保存が完了したら、**OK** をクリックしてリポジトリのクローンを開始します。

    ![](images/300/image057.png)  

- クローン中はダイアログボックスで進捗を確認することが出来ます。

    ![](images/300/image058.png)  

- これでリポジトリのローカルコピーが作成されました。

    ![](images/300/image059.png)  

### **STEP 12**: ライブプレビューの確認

- 実際にソースコードを編集する前に、現在のアプリケーションをライブプレビューで確認します。

- **doc_root**を展開し、**index.html** を選択します。

    ![](images/300/image060.png)  

- 右側のパネルで![](images/300/image061.png) をクリックすると、ブラウザでJavaScriptアプリケーションのライブプレビューが起動します。アプリケーションの表示が確認できたら、ブラウザを閉じます。

    ![](images/300/image062.png)  

## Twitterフィード表示のソースコード追加

### **STEP 13**: graphics.htmlの修正

- **doc_root -> js -> views**の順番で展開し、**graphics.html** を選択します。

    ![](images/300/image063.png)  

- 既存のソースコードを下記のソースコードと置き換えます。

```
<h1>Graphics Content</h1>

<table id="table" summary="Tweet List" data-bind="ojComponent:{component:'ojTable',
        data: tweets,
        columns: [
               {headerText: 'User Name', field: 'User', id: 'name', sortable: 'enabled'},
               {headerText: 'User Location', field: 'Location', id: 'location', sortable: 'enabled'},
               {headerText: 'Source', field: 'Source', id: 'source', sortable: 'enabled'},
               {headerText: 'Tweet', field: 'Text', id: 'text'}
               ],
        rootAttributes: {'style':'width: 100%; height:100%;'},
        scrollPolicy: 'loadMoreOnScroll',
        scrollPolicyOptions: {'fetchSize': 10}}">
</table>
```

![](images/300/image064.png)  

### **STEP 14**: graphics.jsの修正

- **doc_root -> js -> viewModels**の順番で展開し、**graphics.js** を選択します。

    ![](images/300/image065.png)  

- 下記のソースコードを**graphics.js** の最下部に追記します。

```
/*global $, define, console*/
/*jslint sloppy:true*/

define(['ojs/ojcore', 'knockout', 'ojs/ojtable'], function (oj, ko) {

    function mainContentViewModel() {

        // change this root variable to point to YOUR environment
        var root = 'https://javatwittermicroservice-metcsgse00210.apaas.em2.oraclecloud.com/',
            self = this,
            uri = 'statictweets/',
            prettySource = function (source) {
                return source.substring(source.indexOf('>') + 1, source.lastIndexOf('<'));
            },
            url = root + uri;

        self.items = ko.observableArray([]);
        self.tweets = new oj.ArrayTableDataSource(self.items, {
            idAttribute: 'Id'
        });

        $.ajax({
            url: url,
            method: 'GET'
        }).success(function (result) {
            console.log(result.tweets);
            var items = self.items();
            ko.utils.arrayForEach(result.tweets, function (value) {
                // make sure this is a creation tweet
                if (!!value.user) {
                    items.push({
                        Id: value.id,
                        Location: value.user.location,
                        Text: value.text,
                        Source: prettySource(value.source),
                        User: value.user.name
                    });
                }
            });
            self.items.valueHasMutated();
        });
    }
    return mainContentViewModel;
});
```

- Application Container Cloud Serviceのサービスコンソールを開き、Lab 200で作成した**JavaTwitterMicroservice**のURLをコピーします。

    ![](images/300/image066.png)  

- 変数：**root variable**に設定されているURLをコピーしたURLに置き換えます。***URLの最後に'/'(スラッシュ)が含まれている事を確認してください。***

    ![](images/300/image067.png)  

- 修正後のソースコードは下記のようになります。

    ![](images/300/image068.png)  

- メニューバーで**File**をクリックして、**Save All** を選択し、全ての修正を保存します。

    ![](images/300/image069.png)  

### **STEP 15**: 修正箇所の確認

- 右側のパネルで![](images/300/image070.png) をクリックして、ライブプレビューを開きます。

- 右上の![](images/300/image071.png)をクリックし、展開されたメニューから**Graphics**を選択します。

    ![](images/300/image072.png)

- graphicセクションでTwitterフィードが表示されていることを確認します。

    ![](images/300/image073.png)

# ブランチの作成とコードのコミット

## ブランチを作成とコードのコミット

### **STEP 16**: 新規ブランチを作成し、コードをコミットします。

- 機能追加を行ったソースコードをコミットするブランチを作成します。左側のナビゲーションパネルで**master**を選択して、**Create new branch** をクリックします。

    ![](images/300/image074.png)

- ポップアップが表示されたら、Branch nameに**Feature4**と入力し、**OK** をクリックします。

    ![](images/300/image075.png)

- 右側の![](images/300/image076.png)をクリックします。**Commit** の左側のチェックボックスにチェックを付け、修正したソースファイル全てにチェックを付けます。

    ![](images/300/image077.png)

- **Commit**をクリックします。

- ポップアップが表示されたら、**comment**に**Added code to display twitter feed in table format**と入力し、**OK** をクリックします。これでローカルのリポジトリに変更内容がコミットされました。

    ![](images/300/image078.png)

- Gitプッシュアイコン ![](images/300/image079.png)をクリックします。

- ポップアップが表示されたら、全てデフォルトのまま**OK**をクリックします。

    ![](images/300/image080.png)

- Gitプッシュが完了したら、**OK** をクリックします。

    ![](images/300/image081.png)

### **STEP 17**: Twitterフィード表示タスクの完了

- Developer Cloud Serviceのダッシュボード画面に戻り、左側のナビゲーションパネルで**Agile**をクリックして、**Active Sprints**をクリックします。**Microservices**のboardが表示されていることを確認してください。

- **Feature 4**をドラッグ&ドロップし、**In Progress**から**Verify Code** に移動します。

    ![](images/300/image082.png)

- **Change Progress**ポップアップで**Next** をクリックします。

    ![](images/300/image083.png)

- **Time Spent**を**1 days**に設定して、**OK** をクリックします。

    ![](images/300/image083.5.png)

## マージリクエストの作成

### **STEP 18**: Sprint Statusのレビューとマージリクエストの作成

- 左側のナビゲーションパネルの**Code**をクリックして、**Feature4**ブランチを選択し、**Commits** タブを表示します。最新のコミットがBracketsからコミットしたものであることを確認します。

    ![](images/300/image084.png)

- これで"John Dunbar"のタスクであるTwitterフィードの表示が完了したので、Johnは"Lisa Jones"にマージリクエストを送信します。

    ![](images/300/image084.5.png)

- **Merge Requests**をクリックして、**New Merge Request** をクリックします。

    ![](images/300/image085.png)

- **New Merge Request**に下記のデータを入力して、**Next** をクリックします。

    **Repository:** `TwitterMarketingUIMicroservice.git`

    **Target Branch:** `master`

    **Review Branch:** `Feature4`

    ![](images/300/image086.png)

- **Details**に下記のデータを入力して、**Create**をクリックします。

    **Summary:** `Merge Feature 4 into master`

    **Reviewers:** `<Your Username>`

    ![](images/300/image087.5.png)

- **Write**ボックスに下記のコメントを入力し、**Comment** をクリックして保存します。

    **Comment:** `I added table of Twitter feed to graphics tab`

    ![](images/300/image088.png)

## Lisa Jonesとしてブランチをマージ


### **STEP 19**: マージリクエスト

ここからのSTEPでは“John”が作成したブランチを“Lisa”がmasterブランチへマージします。

![](images/lisa.png)

- **Merge Requests**をクリックして、**Assigned to Me**を選択します。**Merge Feature 4 into master** が表示されるのでクリックします。

    ![](images/300/image094.png)

- リクエストが表示されたら、**Changed Files** タブを選択します。マージリクエストの承認・拒否・マージを行なう前に、“Lisa”はブランチへの変更、コメント等の確認を行います。

    ![](images/300/image095.2.png)

- **Merge** をクリックします。

    ![](images/300/image096.png)

- デフォルトのまま**Create a Merge Commit**をクリックします。

    ![](images/300/image097.png)

- これで修正されたソースコードがDeveloper Cloud Serviceのリポジトリにコミットされましたので、自動でビルド&デプロイが実行されます。左側のナビゲーションパネルで**Build**をクリックして、**Twitter Marketing UI Build** がQueueに入っていることを確認します。

    ![](images/300/image098.png)

- ビルドが完了するまで数分待ちます。ビルドが完了すると**Last Success**の内容が**Just Now** に変更されます。

    ![](images/300/image099.png)

- 左側のナビゲーションパネルの**Deploy**をクリックして進捗を確認します。**Depoloy**ステータスが**Deployment update in progress**の場合、デプロイが進行中です。**Last deployment succeeded** – **Just now** に変更されたらデプロイ完了なので、次のSTEPに進みます。

    ![](images/300/image100.png)

## JETFrontEndAPP UIの確認

### **STEP 20**: フロントエンドの確認

- - サービスが正常にデプロイされたら、左側のナビゲーションパネルの**Deploy**をクリックして、**JETFrontEndApp** のリンクをクリックします。

    ![](images/300/image101.png)

- ブラウザの新規タブが開いたら、**Graphics** をクリックし、Twitterフィードを表示します。

    ![](images/300/image102.png)

- 左側ナビゲーションパネルの**Agile**をクリックし、**Active Sprints** を選択し、Sprint Featureを完了させます。

    ![](images/300/image103.png)

- **Feature 4** (Display Twitter Feed in Table Format)を**Verify**エリアから**Completed**エリアへドラッグ&ドロップで移動します。

    ![](images/300/image104.png)

- ステータスを**VERIFIED – FIXED**に変更し、**Next** をクリックします。

    ![](images/300/image105.png)

- **Time Spent**を**1 days**に設定して、**OK** をクリックします。

    ![](images/300/image105.5.png)

- ここまででLab300は完了です。Lab400に進んでください。
