<template>
  <div class="app-container">
    <header class="header">
      <div class="header__main">
        <div class="header__logoWrap">
          <div class="header__logo">
            <img src="@/assets/icon/logo.svg" alt="logo" />
          </div>
          <h1 class="header__title">台灣歷年總統 都幾?</h1>
        </div>
        <div class="header__select">
          <p>選擇年份</p>
          <div class="select__group">
            <select
              name="year"
              id="year"
              v-model="params.year"
              @change="actionSearchYear"
            >
              <option
                v-for="(item, index) in options.year"
                :key="index"
                :value="item.key"
              >
                {{ item.label }}
              </option>
            </select>
            <select name="county" id="county" v-model="params.county">
              <option value="all">all</option>
              <option
                v-for="(item, index) in options.county_town"
                :key="index"
                :value="item.key"
              >
                {{ item.label }}
              </option>
            </select>
            <select name="town" id="town" v-model="params.town">
              <option value="all">all</option>
              <option value="松山區">松山區</option>
              <option value="信義區">信義區</option>
            </select>
          </div>
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
      </div>
      <div class="statistic__main">
        <h2>全臺縣市總統得票</h2>
        <section class="president">
          <h3>總統得票數</h3>
          <div class="president__row">
            <div class="president__col club">
              <ul class="club__list">
                <li
                  class="club__item"
                  v-for="(item, index) in candidateData[params.year].candidate"
                  :key="index"
                >
                  <div class="club__pic" :style="{ background: item.color }">
                    <img src="@/assets/icon/face-2.svg" alt="face" />
                  </div>
                  <div class="club__text">
                    <h4>{{ index }}</h4>
                    <h5>{{ item.name }}</h5>
                    <p>
                      <strong>{{ item.total }}</strong
                      >票
                    </p>
                  </div>
                </li>
              </ul>
              <div class="club__line"></div>
            </div>
            <div class="president__col rate">
              <div class="rate__graph">
                <div id="pieRate" ref="pieRate"></div>
              </div>
              <ul class="rate__list">
                <li class="rate__item">
                  <h4>投票數</h4>
                  <strong>{{ candidateData[params.year].total }}</strong>
                </li>
                <li class="rate__item">
                  <h4>投票率</h4>
                  <strong>{{ candidateData[params.year].rate }} %</strong>
                </li>
                <li class="rate__item">
                  <h4>有效票數</h4>
                  <strong>{{ candidateData[params.year].valid }}</strong>
                </li>
                <li class="rate__item">
                  <h4>無效票數</h4>
                  <strong>{{ candidateData[params.year].invalid }}</strong>
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
                    v-for="(item, index) in partInfo"
                    :key="index"
                  >
                    <span :style="{ background: item.color }"></span>{{ index }}
                  </li>
                </ul>
              </div>
              <div class="history__bar">
                <div id="barColum" ref="barColum"></div>
              </div>
            </div>
            <div class="history__col">
              <div class="history__header">
                <h3>歷屆政黨得票數</h3>
                <ul class="header__list">
                  <li
                    class="header__item"
                    v-for="(item, index) in partInfo"
                    :key="index"
                  >
                    <span :style="{ background: item.color }"></span>{{ index }}
                  </li>
                </ul>
              </div>
              <div class="history__bar">
                <div id="barRate" ref="barRate"></div>
              </div>
            </div>
          </div>
        </section>
        <section class="overview">
          <h3>各縣市投票總覽</h3>
          <table>
            <thead>
              <tr>
                <th>縣市</th>
                <th>得票率</th>
                <th>當選人</th>
                <th>投票數</th>
                <th>投票率</th>
                <th>功能</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in voteInfo['2024'].county" :key="index">
                <td>{{ index }}</td>
                <td>{{ '得票率' }}</td>
                <td>{{ '當選人' }}</td>
                <td>{{ item.total }}</td>
                <td>{{ item.rate }}</td>
                <td>></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import taiwanJSON from '@/assets/json/taiwan.json';
import voteAll from '@/assets/json/vote-all.json';
import vote2024 from '@/assets/json/vote-2024.json';
import resource from '@/assets/json/resource.json';

onMounted(() => {
  window.addEventListener('resize', function () {
    taiwanChart.resize();
    barColumChart.resize();
    pieRateChart.resize();
  });
  drawTaiwan();
  drawBarColum();
  drawpieRate();
});

/**選項 */
const options = reactive({
  county_town: resource.county_town,
  year: resource.year,
});

console.log(options, 'options');

const partInfo = reactive({
  民進黨: {
    pic: 'face-2',
    color: '#91cc75',
  },
  國民黨: {
    pic: 'face-1',
    color: '#5470c6',
  },
  無黨籍: {
    pic: 'face-5',
    color: '#7e7e7e',
  },
  親民黨: {
    pic: 'face-4',
    color: '#faa658',
  },
  民眾黨: {
    pic: 'face-3',
    color: '#4dc1bf',
  },
});

const params = reactive({
  year: '2024',
  county: '臺北市',
  town: '松山區',
});

/**票數統計 */
const voteInfo = reactive({
  all: voteAll,
  2024: vote2024,
});

console.log(voteInfo['2024'].county);

const candidateData = computed(() => {
  const result = voteInfo.all || {};
  Object.values(result).forEach((val) => {
    Object.keys(val.candidate).forEach((c) => {
      val.candidate[c].pic = partInfo[c]?.pic;
      val.candidate[c].color = partInfo[c]?.color;
    });
  });
  return result;
});

const countyRegions = reactive({
  南投縣: { name: '南投縣', color: '#F8C471' },
  臺中市: { name: '臺中市', color: '#85C1E9' },
  臺北市: { name: '臺北市', color: '#FF6B6B' },
  臺南市: { name: '臺南市', color: '#A3E4D7' },
  臺東縣: { name: '臺東縣', color: '#AED6F1' },
  嘉義市: { name: '嘉義市', color: '#FAD7A0' },
  嘉義縣: { name: '嘉義縣', color: '#E59866' },
  基隆市: { name: '基隆市', color: '#F1948A' },
  宜蘭縣: { name: '宜蘭縣', color: '#98D8C8' },
  屏東縣: { name: '屏東縣', color: '#D7BDE2' },
  彰化縣: { name: '彰化縣', color: '#F1948A' },
  新北市: { name: '新北市', color: '#45B7D1' },
  新竹市: { name: '新竹市', color: '#BB8FCE' },
  新竹縣: { name: '新竹縣', color: '#F7DC6F' },
  桃園縣: { name: '桃園縣', color: '#FFA07A' },
  澎湖縣: { name: '澎湖縣', color: '#A2D9CE' },
  花蓮縣: { name: '花蓮縣', color: '#F9E79F' },
  苗栗縣: { name: '苗栗縣', color: '#82E0AA' },
  連江縣: { name: '連江縣', color: '#FADBD8' },
  金門縣: { name: '金門縣', color: '#D2B4DE' },
  雲林縣: { name: '雲林縣', color: '#73C6B6' },
  高雄市: { name: '高雄市', color: '#F5B7B1' },
});

const taiwanMap = ref('');
let taiwanChart = null;

/**台灣地圖 */
const drawTaiwan = async () => {
  taiwanChart = echarts.init(taiwanMap.value);
  echarts.registerMap('taiwan', taiwanJSON); //注册可用的地图

  const option = {
    // 數據系列
    series: [
      {
        type: 'map',
        map: 'taiwan',
        geoIndex: 1,
        aspectScale: 1,
        roam: true,
        zoom: 1.15,
        scaleLimit: {
          min: 1.15,
          max: 3,
        },
        center: [120.6, 23.7],
        // 高亮
        // emphasis: {
        //   disabled: true, // 禁用
        // },
        // 選中
        // select: {
        //   disabled: true, // 禁用
        // },
        data: Object.keys(countyRegions).map((key) => ({
          name: key,
          value: 0,
          itemStyle: {
            areaColor: countyRegions[key].color || '#ffffff', //countyRegions[key].color
            borderColor: '#aaaa',
            borderWidth: 1,
          },
        })),
      },
    ],
    nameMap: {
      taiwan: '臺灣',
    },
    // 顯示資訊
    tooltip: {
      trigger: 'item',
      formatter: '{b}',
    },
  };

  taiwanChart.setOption(option);
};

const changeCounty = (name) => {
  const selectedRegion = Object.keys(countyRegions).find((key) => key === name);
  if (selectedRegion) {
    taiwanChart.setOption({
      series: [
        {
          data: Object.keys(countyRegions).map((key) => ({
            name: key,
            value: 0,
            itemStyle: {
              areaColor: key === name ? countyRegions[key].color : '#ffffff', // 修改此行
              borderColor: '#aaaa',
              borderWidth: 1,
            },
          })),
        },
      ],
    });
  }
};

/**圓餅圖參數 */
const pieRate = ref('');
let pieRateChart = null;

/**圓餅圖繪製 */
const drawpieRate = async () => {
  pieRateChart = echarts.init(pieRate.value);

  const option = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
        ],
      },
    ],
  };

  pieRateChart.setOption(option);
};

/**柱狀圖參數 */
const barColum = ref('');
let barColumChart = null;

/**柱狀圖繪製 */
const drawBarColum = async () => {
  barColumChart = echarts.init(barColum.value);

  // 準備每個年份的候選人得票數數據
  const seriesData = [];
  const years = Object.keys(candidateData.value);

  // 獲取所有政黨名稱
  const partyNames = new Set();
  years.forEach((year) => {
    const candidates = candidateData.value[year].candidate;
    Object.keys(candidates).forEach((party) => partyNames.add(party));
  });

  // 為每個政黨創建一個系列
  partyNames.forEach((party) => {
    const data = years.map((year) => {
      const totalVotes = candidateData.value[year].candidate[party]?.total || 0; // 提取得票數，若不存在則設為0
      return totalVotes;
    });

    // 獲取顏色，從所有年份中獲取該政黨的顏色
    const color =
      years
        .map((year) => candidateData.value[year].candidate[party]?.color)
        .find((c) => c) || '#000000'; // 默認顏色為黑色

    seriesData.push({
      name: party,
      type: 'bar',
      barWidth: '10%',
      data: data,
      itemStyle: {
        color: color, // 設置顏色
      },
    });
  });

  const option = {
    // 圖例
    // legend: {
    //   data: Array.from(partyNames), // 使用所有政黨名稱作為圖例
    // },
    // 顯示
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}', // 顯示政黨得票數
    },
    grid: {
      top: '10%',
      bottom: '10%',
      left: '10%',
      right: '2%',
    },
    xAxis: {
      type: 'category',
      data: years, // X 軸顯示年份
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => `${value / 10000}萬`, // 添加单位“萬”
      },
    },
    series: seriesData,
  };

  barColumChart.setOption(option);
};
</script>
<style lang="scss">
.statistic {
  display: flex;

  .statistic__map {
    // width: 500px;
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
  }
  .statistic__main {
    // width: calc(100% - 500px);
    width: 70%;
    box-sizing: border-box;
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
      // flex-wrap: wrap;
    }
    .president__col {
      width: 48%;
      background: #ffffff;
      border-radius: 12px;
    }
    .club {
      padding: 30px 24px;
      // flex-grow: 1;

      .club__list {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 12px;
      }
      .club__item {
        // display: flex;
        // justify-content: flex-start;
        // align-items: start;
        display: flex;
        // flex-grow: 1;
        gap: 12px;
      }
      .club__pic {
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: #7e7e7e;
        padding: 10px;
        // margin-right: 12px;
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
              content: '';
              position: absolute;
              width: 24px;
              height: 24px;
              top: 20px;
              right: 20px;
              background: no-repeat center url('@/assets/icon/elected.svg');
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
          // font-size: 16px;
          font-size: clamp(14px, 0.8vw, 16px);
          font-weight: 400;
          line-height: 24px;
          color: #334155;

          strong {
            font-weight: 700;
          }
        }
      }
      .club__line {
        width: 100%;
        height: 18px;
        border-radius: 50px;
        background: #8082ff;
      }
    }
    .rate {
      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      padding: 18px 24px;
      // margin-left: 16px;

      .rate__graph {
        width: 124px;
        height: 124px;
        // margin-right: 40px;

        #pieRate {
          width: 100%;
          height: 100%;
        }
      }
      .rate__list {
        width: 60%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        // grid-template-columns: repeat(auto-fill, 40%);
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
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 49%);
      grid-gap: 0px 12px;
    }
    .history__col {
      padding: 24px 16px;
      border-radius: 12px;
      border: 1px solid #dee2e6;
    }
    .history__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h3 {
        font-size: 20px;
        font-weight: 700;
        line-height: 30px;
        color: #334155;
      }
    }
    .header__list {
      display: flex;
      justify-content: flex-end;
      align-items: center;
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
      #barRate {
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
      font-family: 'Oswald', sans-serif;
      border-collapse: collapse;
    }
    th {
      background-color: #e9ecef;
      color: #334155;
      width: 12vw;
      padding: 8px;
      text-align: left;
    }
    td {
      background-color: #ffffff;
      width: 12vw;
      padding: 12px 8px;
      text-align: left;
    }
    tr {
      border-bottom: 1px solid #dddddd;
    }
    tr:last-of-type {
      border-bottom: 1px solid #dddddd;
    }
  }
}
</style>
