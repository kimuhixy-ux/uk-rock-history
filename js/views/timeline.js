// timeline.js: 年表ビュー(トップ画面)

import { loadData, decadeOf } from "../data.js";
import { artistCardHtml } from "../components/artist-card.js";
import { LOCALE } from "../i18n.js";
import { S } from "../strings.js";

const DECADES_JA = [
  {
    year: 1960,
    label: "1960年代",
    desc: `リヴァプールのマージービートに端を発し、ビートルズやローリング・ストーンズら
      「ブリティッシュ・インヴェイジョン」がアメリカ市場を席巻した時代。同時期、アメリカン・ブルースを
      吸収したブルースロック(ヤードバーズ、クリーム)や、サイケデリックロックの萌芽も生まれた。`,
  },
  {
    year: 1970,
    label: "1970年代",
    desc: `プログレッシブロック(キング・クリムゾン、イエス、ジェネシス)が長尺・複雑な楽曲構成で花開く一方、
      レッド・ツェッペリンやディープ・パープルらがハードロックを確立。グラムロック(T. Rex、デヴィッド・ボウイ)が
      ポップとロックの境界を揺さぶり、後半にはセックス・ピストルズらのパンクロックが既存の音楽シーンに衝撃を与えた。`,
  },
  {
    year: 1980,
    label: "1980年代",
    desc: `パンクの衝動を引き継いだポストパンク/ニューウェイヴ(ジョイ・ディヴィジョン、ザ・キュアー)が
      内省的かつ実験的なサウンドを展開。ゴシックロックが独自の美学を築く一方、アイアン・メイデンら
      NWOBHM勢がヘヴィメタルを国際的なジャンルへと押し上げた。ザ・スミスらギターポップも存在感を放った。`,
  },
  {
    year: 1990,
    label: "1990年代",
    desc: `マンチェスターを震源地に、ダンスとロックが融合した「マッドチェスター」(ストーン・ローゼズ、
      ハッピー・マンデーズ)が席巻。マイ・ブラッディ・ヴァレンタインらのシューゲイザーが音の壁を追求する中、
      オアシスやブラーらの「ブリットポップ」戦争が英国ロックを再び国民的な話題へと押し上げた。`,
  },
  {
    year: 2000,
    label: "2000年代",
    desc: `ブリットポップ以降のギターロック・リバイバルとして、アークティック・モンキーズらが
      SNS以前の口コミ文化から台頭。ミューズやコールドプレイはスタジアム規模のアリーナロックへと
      スケールアップし、英国ロックの表現の幅がさらに広がった。`,
  },
  {
    year: 2010,
    label: "2010年代",
    desc: `インディーロックがフォークやエレクトロニカと交わりながら多様化。ストリーミング時代の到来により
      シーンの境界はより流動的になり、UKロックの系譜を引き継ぐ新世代バンドが各地で生まれ続けた。`,
  },
  {
    year: 2020,
    label: "2020年代〜",
    desc: `パンデミックを経て、DIY精神やジャンル越境がより意識される時代へ。過去の名盤やアーティストの
      再評価も進み、ストリーミングを通じて世代を超えたリスナーがUKロックの歴史そのものを楽しんでいる。`,
  },
];

const DECADES_EN = [
  {
    year: 1960,
    label: "1960s",
    desc: `Starting with Liverpool's Merseybeat scene, the Beatles, the Rolling Stones and other
      acts of the "British Invasion" swept the American market. In the same period, blues rock
      (the Yardbirds, Cream) absorbed American blues, and the first stirrings of psychedelic rock appeared.`,
  },
  {
    year: 1970,
    label: "1970s",
    desc: `Progressive rock (King Crimson, Yes, Genesis) blossomed with long, complex song structures,
      while Led Zeppelin and Deep Purple established hard rock. Glam rock (T. Rex, David Bowie) blurred
      the line between pop and rock, and by the decade's second half, the Sex Pistols and other punk
      rock acts shook the existing music scene to its core.`,
  },
  {
    year: 1980,
    label: "1980s",
    desc: `Carrying forward punk's energy, post-punk/new wave acts (Joy Division, the Cure) explored
      introspective, experimental sound. Gothic rock built its own aesthetic, while Iron Maiden and other
      NWOBHM bands pushed heavy metal into an internationally recognized genre. The Smiths and other
      guitar-pop acts also left their mark.`,
  },
  {
    year: 1990,
    label: "1990s",
    desc: `Centered on Manchester, "Madchester" (the Stone Roses, Happy Mondays) fused dance music
      with rock. My Bloody Valentine and other shoegaze acts pursued walls of sound, while the "Britpop"
      rivalry between Oasis and Blur pushed British rock back into the national spotlight.`,
  },
  {
    year: 2000,
    label: "2000s",
    desc: `As a guitar-rock revival following Britpop, bands like Arctic Monkeys rose to prominence
      through pre-social-media word of mouth. Muse and Coldplay scaled up into stadium-sized arena rock,
      further broadening the range of expression in British rock.`,
  },
  {
    year: 2010,
    label: "2010s",
    desc: `Indie rock diversified as it mingled with folk and electronica. The arrival of the streaming
      era made scene boundaries more fluid, and new generations of bands carrying on the UK rock lineage
      kept emerging across the country.`,
  },
  {
    year: 2020,
    label: "2020s–",
    desc: `In the wake of the pandemic, DIY spirit and genre-crossing became more prominent than ever.
      Classic albums and artists are being reappraised, and listeners across generations continue to enjoy
      the history of UK rock itself through streaming.`,
  },
];

const DECADES = LOCALE === "en" ? DECADES_EN : DECADES_JA;

export async function renderTimeline(view) {
  view.innerHTML = `<div class="loading">${S.loading}</div>`;
  const { artists } = await loadData();

  const byDecade = new Map(DECADES.map((d) => [d.year, []]));
  for (const artist of artists) {
    const dec = decadeOf(artist.begin_year);
    if (dec != null && byDecade.has(dec)) {
      byDecade.get(dec).push(artist);
    } else if (dec != null && dec > 2020) {
      byDecade.get(2020).push(artist);
    }
  }

  const html = `
    <h1 class="page-title">${S.timelineTitle}</h1>
    <p class="page-lead">${S.timelineLead}</p>
    ${DECADES.map((d) => {
      const list = byDecade.get(d.year).sort((a, b) => (a.begin_year - b.begin_year) || a.name.localeCompare(b.name));
      return `
        <section class="decade-block">
          <div class="decade-header">
            <span class="decade-year">${d.label}</span>
            <span class="chip">${S.artistsCount(list.length)}</span>
          </div>
          <p class="decade-desc">${d.desc.trim().replace(/\s+/g, " ")}</p>
          <div class="artist-grid">
            ${list.slice(0, 24).map((a) => artistCardHtml(a)).join("")}
          </div>
          ${list.length > 24 ? `<p style="margin-top:10px"><a href="#/artists?decade=${d.year}">${S.seeMoreArtists(list.length)}</a></p>` : ""}
        </section>
      `;
    }).join("")}
  `;
  view.innerHTML = html;
}
