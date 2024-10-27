<template>
  <div class="app-container">
    <header class="header">
      <div class="header__main">
        <div class="header__logo">
          <div class="logo__pic">
            <img src="@/assets/icon/logo.svg" alt="logo" />
          </div>
          <h1 class="logo__title">台灣歷年總統 都幾?</h1>
          <p class="logo__text">選擇年份</p>
          <select
            class="select__year"
            name="year"
            id="year"
            v-model="params.year"
            @change="changeSearchYear"
          >
            <option
              v-for="(item, index) in options.year"
              :key="index"
              :value="item.key"
            >
              {{ item.label }}
            </option>
          </select>
        </div>
        <div class="header__select">
          <select
            class="select__county"
            name="county"
            id="county"
            v-model="params.county"
            @change="changeSearchCounty()"
          >
            <option key="all" value="all" label="all">all</option>
            <option
              v-for="(item, index) in options.county_town"
              :key="index"
              :value="item.label"
              :label="item.label"
            >
              {{ item.label }}
            </option>
          </select>
          <select
            class="select__town"
            name="town"
            id="town"
            v-model="params.town"
            @change="changeSearchTown()"
          >
            <option value="all">all</option>
            <option
              v-for="(item, index) in optionsTowns"
              :key="index"
              :value="item.label"
              :label="item.label"
            >
              {{ item.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="header__link">
        <span>分享</span>
        <img src="@/assets/icon/facebook.svg" alt="facebook" />
        <img src="@/assets/icon/instagram.svg" alt="instagram" />
        <img src="@/assets/icon/youtube.svg" alt="youtube" />
      </div>
    </header>
    <div class="statistic">
      <div class="statistic__map">
        <div id="taiwanMap" ref="taiwanMap"></div>
        <ul class="cand__list">
          <li
            class="cand__item"
            v-for="(item, index) in yearsCandidateData[params.year].candidate"
            :key="index"
          >
            <span :style="{ background: item.color }"></span>
            <p>{{ index }}</p>
          </li>
        </ul>
      </div>
      <div class="statistic__main">
        <div class="statistic__wrap">
          <h2>{{ statisticTitle }}</h2>
          <section class="president">
            <h3>總統得票數</h3>
            <div class="president__row">
              <div class="president__col club">
                <ul class="club__list">
                  <li
                    class="club__item"
                    v-for="(item, index) in voteCandidate.candidate"
                    :key="index"
                  >
                    <div
                      class="club__pic"
                      :style="{ background: handleClub(index).color }"
                    >
                      <img
                        :src="img.imagesSvg[handleClub(index).pic]"
                        :alt="handleClub(index).name"
                      />
                    </div>
                    <div class="club__text">
                      <h4>{{ index }}</h4>
                      <h5>{{ handleClub(index).name }}</h5>
                      <p>
                        <strong>{{ item.total.toLocaleString() }}</strong
                        >票
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="club__percent">
                  <div
                    class="club__line"
                    v-for="(item, index) in voteCandidate.candidate"
                    :key="index"
                    :style="{
                      background: handleClub(index).color,
                      width: `${item.rate}%`,
                    }"
                  >
                    <span>{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
              <div class="president__col rate">
                <div class="rate__graph">
                  <div id="pieRate" ref="pieRate"></div>
                  <div class="rate__sub">
                    <small>投票率</small>
                    <strong>{{ voteCandidate.rate ? voteCandidate.rate : 0 }}%</strong>
                  </div>
                </div>
                <ul class="rate__list">
                  <li class="rate__item">
                    <h4>投票數</h4>
                    <strong>{{
                      voteCandidate.total
                        ? voteCandidate.total.toLocaleString()
                        : 0
                    }}</strong>
                  </li>
                  <li class="rate__item">
                    <h4>投票率</h4>
                    <strong
                      >{{
                        voteCandidate.rate ? voteCandidate.rate : 0
                      }}
                      %</strong
                    >
                  </li>
                  <li class="rate__item">
                    <h4>有效票數</h4>
                    <strong>{{
                      voteCandidate.valid
                        ? voteCandidate.valid.toLocaleString()
                        : 0
                    }}</strong>
                  </li>
                  <li class="rate__item">
                    <h4>無效票數</h4>
                    <strong>{{
                      voteCandidate.invalid
                        ? voteCandidate.invalid.toLocaleString()
                        : 0
                    }}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section class="history">
            <div class="history__row">
              <div class="history__col">
                <div class="history__header">
                  <h3>歷屆政黨得票數</h3>
                  <ul class="header__list">
                    <li
                      class="header__item"
                      v-for="(item, index) in partyInfo"
                      :key="index"
                    >
                      <span :style="{ background: item.color }"></span
                      >{{ index }}
                    </li>
                  </ul>
                </div>
                <div class="history__bar">
                  <div id="barColum" ref="barColum"></div>
                </div>
              </div>
              <div class="history__col">
                <div class="history__header">
                  <h3>歷屆政黨得票率</h3>
                  <ul class="header__list">
                    <li
                      class="header__item"
                      v-for="(item, index) in partyInfo"
                      :key="index"
                    >
                      <span :style="{ background: item.color }"></span
                      >{{ index }}
                    </li>
                  </ul>
                </div>
                <div class="history__bar">
                  <div id="barLine" ref="barLine"></div>
                </div>
              </div>
            </div>
          </section>
          <section class="overview">
            <h3>{{ overviewTitle }}</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: auto">地區</th>
                  <th style="width: auto" class="hidden-mobile">得票率</th>
                  <th style="width: auto">當選人</th>
                  <th style="width: 16%" class="hidden-mobile">投票數</th>
                  <th style="width: 16%" class="hidden-mobile">投票率</th>
                  <th style="width: 4%"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in voteList"
                  :key="index"
                  @click="
                    params.county == 'all' || params.town == 'all'
                      ? changeList(index)
                      : null
                  "
                >
                  <td>
                    <h4>{{ index }}</h4>
                  </td>
                  <td class="hidden-mobile">
                    <div class="overview__percent">
                      <div
                        class="overview__line"
                        v-for="(c, x) in item.candidate"
                        :key="x"
                        :style="{
                          background: hanleColor(x),
                          width: `${c.rate}%`,
                        }"
                      ></div>
                    </div>
                  </td>
                  <td>
                    <div class="overview__peopel">
                      <div
                        class="overview__pic"
                        :style="{ background: hanleListName(index).color }"
                      >
                        <img
                          :src="img.imagesSvg[hanleListName(index).pic]"
                          alt="face"
                        />
                      </div>
                      <p>{{ hanleListName(index).name }}</p>
                    </div>
                  </td>
                  <td class="hidden-mobile">
                    {{ item.total.toLocaleString() }}
                  </td>
                  <td class="hidden-mobile">{{ item.rate }}</td>
                  <td>
                    <img
                      class="arrow"
                      v-if="params.county == 'all' || params.town == 'all'"
                      src="@/assets/icon/arrow-right.svg"
                      alt="arrow-right"
                    />
                    <div class="arrow" v-else></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
        <footer class="footer">版權所有 ©2023 台灣歷年總統 都幾?</footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import resource from "@/assets/json/resource.json";
import taiwanJSON from "@/assets/json/taiwan.json";
import voteAll from "@/assets/json/vote-all.json";
import vote2024 from "@/assets/json/vote-2024.json";
import vote2020 from "@/assets/json/vote-2020.json";

onMounted(() => {
  drawTaiwan();
  drawBarColum();
  drawBarLine();
  drawpieRate();
  window.addEventListener("resize", function () {
    taiwanChart.resize();
    pieRateChart.resize();
    barColumChart.resize();
    barLineChart.resize();
  });
});

const img = useGlobImg();

/**選項 */
const options = reactive({
  county_town: resource.county_town,
  year: resource.year,
});

const optionsTowns = computed(() => {
  if (params.county !== "" && params.county !== "all") {
    return options.county_town
      .filter((i) => params.county.includes(i.label))
      .reduce((acc, item) => acc.concat(item.children), []);
  }
  return [];
});

const params = reactive({
  year: "2024",
  county: "all",
  town: "all",
});

/**票數統計 */
const voteInfo = reactive({
  all: voteAll,
  2024: vote2024,
  2020: vote2020,
});

/**變更年分 */
const changeSearchYear = () => {
  params.county = "all";
  params.town = "all";
  drawTaiwan();
  drawpieRate();
};

/**變更縣市 */
const changeSearchCounty = () => {
  params.town = "all";
  drawpieRate();
};

const changeSearchTown = () => {
  drawpieRate();
};

const changeList = (key) => {
  if (params.county == "all" && params.town == "all") {
    params.county = key; // 更新縣市
    params.town = "all";
  } else {
    params.town = key; // 更新區域
  }
  drawpieRate();
};

const statisticTitle = computed(() => {
  if (params.county !== "all" && params.town == "all") {
    return `${params.county}總統得票`;
  }
  if (params.county !== "all" && params.town !== "all") {
    return `${params.county}${params.town}總統得票`;
  }
  return "全臺縣市總統得票";
});

const overviewTitle = computed(() => {
  if (params.county !== "all" && params.town == "all") {
    return `各鄉鎮市區投票總覽`;
  }
  if (params.county !== "all" && params.town !== "all") {
    return `各村里投票總覽`;
  }
  return "各縣市投票總覽";
});

/**票數清單 */
const voteList = computed(() => {
  const result = voteInfo[params.year].county || {};

  // 縣市
  if (params.county !== "all" && params.town == "all") {
    return result[params.county]?.towns || {};
  }
  // 地區
  if (params.county !== "all" && params.town !== "all") {
    return result[params.county].towns[params.town]?.village || {};
  }

  return result;
});

const voteCandidate = computed(() => {
  const result = voteInfo[params.year] || {};

  // 縣市
  if (params.county !== "all" && params.town == "all") {
    return result.county[params.county] || {};
  }
  // 地區
  if (params.county !== "all" && params.town !== "all") {
    return result.county[params.county].towns[params.town] || {};
  }

  return result.all;
});

/**政黨資料 */
const partyInfo = reactive({
  民進黨: {
    pic: "face-3",
    color: "#91cc75",
  },
  國民黨: {
    pic: "face-1",
    color: "#5470c6",
  },
  無黨籍: {
    pic: "face-5",
    color: "#7e7e7e",
  },
  親民黨: {
    pic: "face-4",
    color: "#faa658",
  },
  民眾黨: {
    pic: "face-2",
    color: "#4dc1bf",
  },
});

const handleClub = (party) => {
  const all = yearsCandidateData.value[params.year].candidate || {};
  return all[party];
};

/**處理顏色 */
const hanleColor = (party) => {
  return partyInfo[party].color;
};

/**處理列表姓名圖片 */
const hanleListName = (countyTown) => {
  const all = yearsCandidateData.value[params.year].candidate || {};
  const candData = voteList.value[countyTown]?.candidate || {}; // 使用可选链避免错误

  let highestParty = null;
  let highestTotal = 0;

  // 遍歷候選人數據，找到票數最高的政黨
  Object.entries(candData).forEach(([party, data]) => {
    if (data.total > highestTotal) {
      highestTotal = data.total;
      highestParty = party; // 保存最高票数的政黨
    }
  });

  // 根据最高票数的政黨 all 數據中提取相应的信息
  const highestCandidate = all[highestParty] || {
    name: "未知",
    pic: "face-none",
  };

  return highestCandidate; // 返回最高票数的候选人信息
};

/**年度候選人處理圖顏色 */
const yearsCandidateData = computed(() => {
  const result = voteInfo.all || {};

  Object.values(result).forEach((val) => {
    Object.keys(val.candidate).forEach((c) => {
      val.candidate[c].pic = partyInfo[c]?.pic;
      val.candidate[c].color = partyInfo[c]?.color;
    });
  });

  return result;
});

const cityCoords = {
  新北市: [121.6739, 24.91571],
  高雄市: [120.666, 23.01087],
  臺中市: [120.9417, 24.23321],
  臺北市: [121.5598, 25.09108],
  桃園市: [121.2168, 24.93759],
  臺南市: [120.2513, 23.1417],
  彰化縣: [120.4818, 23.99297],
  屏東縣: [120.62, 22.54951],
  雲林縣: [120.3897, 23.75585],
  苗栗縣: [120.9417, 24.48927],
  嘉義縣: [120.574, 23.45889],
  新竹縣: [121.1252, 24.70328],
  南投縣: [120.9876, 23.83876],
  宜蘭縣: [121.7195, 24.69295],
  新竹市: [120.9647, 24.80395],
  基隆市: [121.7081, 25.10898],
  花蓮縣: [121.3542, 23.7569],
  嘉義市: [120.4473, 23.47545],
  臺東縣: [120.9876, 22.98461],
  金門縣: [119.6186, 24.43679],
  澎湖縣: [119.6151, 23.56548],
  連江縣: [119.9397, 25.19737],
};

/**台灣地圖 */
const taiwanMap = ref("");
let taiwanChart = null;
const drawTaiwan = async () => {
  taiwanChart = echarts.init(taiwanMap.value);
  echarts.registerMap("taiwan", taiwanJSON); //註冊可用的地圖

  const option = {
    // 數據系列
    series: [
      {
        type: "map",
        map: "taiwan",
        geoIndex: 1,
        aspectScale: 1,
        roam: true,
        zoom: 1.2,
        scaleLimit: {
          min: 1.2,
          max: 3,
        },
        center: [120.7, 23.6],
        // 高亮
        emphasis: Object.keys(voteList.value).map((key) => ({
          itemStyle: {
            color: hanleListName(key).color || "#ffff",
          },
        })),
        // 選中
        select: {
          disabled: true, // 禁用
        },
        label: {
          show: true,
          formatter: "{b}",
          color: "#fff",
          textBorderColor: "#000",
          textBorderWidth: 2,
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "sans-serif",
        },
        data: Object.keys(voteList.value).map((key) => ({
          name: key,
          value: 0,
          itemStyle: {
            areaColor: hanleListName(key).color || "#ffffff",
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        })),
      },
    ],
    nameMap: {
      taiwan: "臺灣",
    },
    // 顯示資訊
    tooltip: {
      trigger: "item",
      formatter: "{b}",
    },
  };

  taiwanChart.setOption(option);

  taiwanChart.on("click", function (p) {
    const coords = cityCoords[p.name]; // 獲取對應的坐標
    params.county = p.name;
    params.town = "all";

    taiwanChart.setOption({
      series: [
        {
          zoom: 3,
          center: coords,
        },
      ],
    });
  });
};

/**圓餅圖 */
const pieRate = ref("");
let pieRateChart = null;
const drawpieRate = () => {
  pieRateChart = echarts.init(pieRate.value);

  const rateValid = voteCandidate.value.rate;

  const option = {
    series: [
      {
        type: "pie",
        radius: ["80%", "100%"],
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        data: [
          {
            value: rateValid,
            itemStyle: {
              color: "#D4009B",
            },
          },
          {
            value: 100 - rateValid,
            itemStyle: {
              color: "#E2E8F0",
            },
          },
        ],
      },
    ],
  };

  pieRateChart.setOption(option);
};

/**柱狀圖 */
const barColum = ref("");
let barColumChart = null;
const drawBarColum = async () => {
  barColumChart = echarts.init(barColum.value);

  // 準備每個年份的候選人得票數數據
  const seriesData = [];
  const years = Object.keys(yearsCandidateData.value);

  // 獲取所有政黨名稱
  const partyNames = new Set();
  years.forEach((year) => {
    const candidates = yearsCandidateData.value[year].candidate;
    Object.keys(candidates).forEach((party) => partyNames.add(party));
  });

  // 為每個政黨創建一個系列
  partyNames.forEach((party) => {
    const data = years.map((year) => {
      const totalVotes =
        yearsCandidateData.value[year].candidate[party]?.total || 0; // 提取得票數，若不存在則設為0
      return totalVotes;
    });

    // 獲取顏色，從所有年份中獲取該政黨的顏色
    const color =
      years
        .map((year) => yearsCandidateData.value[year].candidate[party]?.color)
        .find((c) => c) || "#000000"; // 默認顏色為黑色

    seriesData.push({
      name: party,
      type: "bar",
      barWidth: "10%",
      data: data,
      itemStyle: {
        color: color, // 設置顏色
      },
    });
  });

  const option = {
    // 顯示
    tooltip: {
      trigger: "axis",
    },
    // 邊距
    grid: {
      top: "10%",
      bottom: "10%",
      left: "10%",
      right: "2%",
    },
    xAxis: {
      type: "category",
      data: years, // X 軸顯示年份
      axisPointer: {
        type: "shadow",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => `${value / 10000}萬`, // 添加单位“萬”
      },
    },
    series: seriesData,
  };

  barColumChart.setOption(option);
};

/**折線圖 */
const barLine = ref("");
let barLineChart = null;
const drawBarLine = async () => {
  barLineChart = echarts.init(barLine.value);

  // 準備每個年份的候選人得票數數據
  const seriesData = [];
  const years = Object.keys(yearsCandidateData.value);

  // 獲取所有政黨名稱
  const partyNames = new Set();
  years.forEach((year) => {
    const candidates = yearsCandidateData.value[year].candidate;
    Object.keys(candidates).forEach((party) => partyNames.add(party));
  });

  // 為每個政黨創建一個系列
  partyNames.forEach((party) => {
    const data = years.map((year) => {
      const rateVotes =
        yearsCandidateData.value[year].candidate[party]?.rate || 0; // 提取得票數，若不存在則設為0
      return rateVotes;
    });

    // 獲取顏色，從所有年份中獲取該政黨的顏色
    const color =
      years
        .map((year) => yearsCandidateData.value[year].candidate[party]?.color)
        .find((c) => c) || "#000000"; // 默認顏色為黑色

    seriesData.push({
      name: party,
      type: "line",
      data: data,
      itemStyle: {
        color: color, // 設置顏色
      },
    });
  });

  const option = {
    grid: {
      left: "1%",
      right: "4%",
      top: "10%",
      bottom: "2%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    toolbox: {
      show: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: true, //置中
      data: years,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: seriesData,
  };

  barLineChart.setOption(option);
};
</script>
<style lang="scss">
.statistic {
  display: flex;

  .statistic__map {
    position: relative;
    width: 30%;
    height: calc(100vh - 60px);
    position: sticky;
    top: 60px;
    background: #e4faff;

    #taiwanMap {
      width: 100%;
      height: 100%;
      background: #e4faff;
    }
    .cand__list {
      position: absolute;
      bottom: 20px;
      left: 20px;
      display: flex;
      gap: 6px;
      background: #fff;
      border-radius: 50px;
      padding: 4px 10px;
    }
    .cand__item {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;

      span {
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 50px;
        background: #aaa;
      }
      p {
        font-size: 10px;
        font-weight: 400;
        line-height: 14px;
        text-align: right;
      }
    }
  }
  .statistic__main {
    width: 70%;
    box-sizing: border-box;
  }
  .statistic__wrap {
    padding: 32px 48px;

    h2 {
      font-size: 28px;
      font-weight: 700;
      line-height: 42px;
      color: #334155;
      margin-bottom: 24px;
    }
  }
  // 總統得票數
  .president {
    padding: 16px;
    border-radius: 12px;
    background: #f3f4f4;
    margin-bottom: 16px;

    h3 {
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
      margin-top: 8px;
      margin-bottom: 16px;
      color: #334155;
    }

    .president__row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .president__col {
      background: #ffffff;
      border-radius: 12px;
    }
    .club {
      padding: 30px 24px;
      flex-grow: 1;

      .club__list {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 12px;
      }
      .club__item {
        display: flex;
        flex-grow: 1;
        gap: 12px;
      }
      .club__pic {
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: #7e7e7e;
        padding: 10px;
      }
      .club__text {
        position: relative;

        h4 {
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          color: #64748b;
          margin-bottom: 2px;

          &.elected {
            &::after {
              content: "";
              position: absolute;
              width: 24px;
              height: 24px;
              top: 20px;
              right: 20px;
              background: no-repeat center url("@/assets/icon/elected.svg");
            }
          }
        }
        h5 {
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          color: #334155;
          margin-bottom: 2px;
        }
        p {
          font-size: clamp(14px, 0.8vw, 16px);
          font-weight: 400;
          line-height: 24px;
          color: #334155;

          strong {
            font-weight: 700;
          }
        }
      }
      .club__percent {
        width: 100%;
        height: 18px;
        border-radius: 50px;
        background: #8082ff;
        display: flex;
        border-radius: 50px;
        overflow: hidden;
      }
      .club__line {
        text-align: center;

        span {
          font-size: 12px;
          font-weight: 400;
          line-height: 14px;
          text-align: center;
          color: #fff;
        }
      }
    }
    .rate {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      padding: 18px 24px;
      flex-grow: 1;

      .rate__graph {
        position: relative;
        width: 124px;
        height: 124px;

        .rate__sub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          small {
            display: block;
            text-align: center;
            font-size: 14px;
            font-weight: 400;
            line-height: 21px;
            margin-bottom: 4px;
          }
          strong {
            display: block;
            font-size: 18px;
            font-weight: 700;
            line-height: 30px;
            text-align: center;
            color: #d4009b;
          }
        }
        #pieRate {
          width: 100%;
          height: 100%;
        }
      }
      .rate__list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 8px;
        flex-grow: 1;
      }
      .rate__item {
        h4 {
          font-size: 14px;
          font-weight: 400;
          line-height: 21px;
          color: #64748b;
          margin-bottom: 4px;
        }
        strong {
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          color: #334155;
        }
      }
    }
  }
  // 歷屆得票數
  .history {
    margin-bottom: 40px;

    .history__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .history__col {
      padding: 24px 16px;
      border-radius: 12px;
      border: 1px solid #dee2e6;
      flex-grow: 1;
    }
    .history__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 12px;

      h3 {
        font-size: 20px;
        font-weight: 700;
        line-height: 30px;
        color: #334155;
        flex-grow: 1;
      }
    }
    .header__list {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-grow: 1;
    }
    .header__item {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #334155;
      margin-right: 4px;

      span {
        display: inline-block;
        border-radius: 10px;
        background: #8082ff;
        width: 8px;
        height: 8px;
        margin-right: 4px;
      }
    }
    .history__bar {
      width: 100%;
      height: 220px;
      background: #ffff;
      margin: 0 auto;

      #barColum,
      #barLine {
        width: 100%;
        height: 100%;
      }
    }
  }
  // 各縣市投票總覽
  .overview {
    h3 {
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
      margin-top: 8px;
      margin-bottom: 16px;
      color: #334155;
    }
    table {
      width: 100%;
    }
    th {
      background-color: #e9ecef;
      color: #334155;
      width: 12vw;
      padding: 12px 8px;
      text-align: left;
    }
    td {
      width: 12vw;
      padding: 8px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #334155;

      &:nth-child(1) {
        h4 {
          display: block;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          text-align: left;
        }
      }
      &:last-child {
        text-align: center;

        .arrow {
          width: 10px;
          height: 10px;
        }
      }
    }
    tr {
      cursor: pointer;
      border-bottom: 1px solid #dddddd;
      background: #ffff;

      &:hover {
        background: #f9f9f9;
      }
    }
    tr:last-of-type {
      border-bottom: 1px solid #dddddd;
    }
    .overview__percent {
      width: 100%;
      height: 8px;
      border-radius: 50px;
      background: #8082ff;
      display: flex;
      border-radius: 50px;
      overflow: hidden;
    }
    .overview__line {
      text-align: center;
    }
    .overview__peopel {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .overview__pic {
      box-sizing: border-box;
      display: inline-block;
      width: 24px;
      height: 24px;
      padding: 4px;
      border-radius: 50%;
      background: #aaaa;
      margin-right: 8px;
    }
  }
}
.footer {
  background: #e9ecef;
  padding: 16px 0;
  text-align: center;
  color: #334155;
}

@media only screen and (max-width: 1440px) {
  .statistic {
    flex-wrap: wrap;

    .history {
      .history__row {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}

@media only screen and (max-width: 1200px) {
  .statistic {
    flex-wrap: wrap;

    .statistic__map {
      position: relative;
      width: 100%;
      height: 400px;
      top: 0px;
    }
    .statistic__main {
      width: 100%;
    }
    .statistic__wrap {
      padding: 32px 16px;
    }
  }
}

@media only screen and (max-width: 768px) {
  .hidden-mobile {
    display: none; // 默認隱藏
  }
}
</style>
