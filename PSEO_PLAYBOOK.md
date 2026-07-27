# UK Rock History 名盤ガイドPSEO運用手順

この文書は、精選した英国ロック名盤の日英静的ページを再生成・検証するための手順書です。生成ページは既存アプリを置き換えず、検索結果から事実情報とアプリ本体へ案内する入口です。

## 対象データとURL

- 日本語: `data/album_guide.json`
- 英語: `data/album_guide.en.json`
- ジャンル: `data/genres.json` / `data/genres.en.json`
- 日本語URL: `/items/<artist-album-year>/`
- 英語URL: `/en/items/<artist-album-year>/`

日英各72件をカテゴリ内の順序で対応させ、アーティスト、アルバム名、年が一致しなければ生成を停止する。slugはASCIIケバブケースで生成し、重複時は連番を付ける。

`data/artists.json` 内の約4,400件の取得アルバムはコンピレーション等を含む補助データであり、値の精査が済むまでPSEO対象にしない。

## 出力範囲

静的ページに出すのはアルバム名、アーティスト名、発表年、ジャンルだけとする。紹介文、ジャケット画像、曲目、再生時間、音源は本文、メタ情報、OGP、JSON-LD、索引へ複製しない。SpotifyとApple Musicは検索リンクだけを設置する。

## schema.org

- アルバム: `MusicAlbum`
- アーティスト: `Person` または `MusicGroup`
- 共通: `WebSite`、`WebPage`、`BreadcrumbList`
- 索引: `CollectionPage`

`data/artists.json` と名義が完全一致する場合だけ既存の種別を採用し、一致しない名義は `MusicGroup` とする。発売種別、レーベル、録音日など、データにない値を推測しない。

## AdSense・多言語・Service Worker

テンプレートから既存の `js/ads.js` を読み込み、本番ホストだけで既存AdSense IDを有効にする条件を維持する。canonicalと `ja` / `en` / `x-default` hreflangを相互設定し、OGPには共通アイコンを使う。

72件×2言語、索引2ページ、既存主要6ページの合計152 URLをsitemapへ収録する。生成ページは事前キャッシュせず、HTMLナビゲーションをネットワーク優先にする。

## 再生成と検証

```sh
python3 scripts/generate_pages.py
python3 scripts/validate_generated_pages.py
git diff --check
```

生成された `items/` と `en/items/` は手編集せず、データ、テンプレート、生成スクリプトを修正して再生成する。

## 公開前チェック

- [ ] 日英それぞれ72詳細ページがある
- [ ] titleとdescriptionが各言語内で一意
- [ ] canonical、hreflang、OGP、JSON-LDが正しい
- [ ] 紹介文、画像、曲目、音源が含まれない
- [ ] 全内部リンクの参照先が存在する
- [ ] 各索引に72件が1回ずつ載る
- [ ] sitemapが152 URLで重複なし
- [ ] 生成ページが事前キャッシュ対象外
- [ ] git push前にオーナーの承認を得る
