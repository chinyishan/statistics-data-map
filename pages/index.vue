<template>
  <div class="app-container">
    <div class="statistic-wrap">
      <div class="statistic-map">
        <div id="taiwanMap" ref="taiwanMap"></div>
      </div>
      <div class="statistic-people">
        <div class="people-select">
          <select
            name="year"
            id="year"
            v-model="selectYear"
            @change="actionSearch"
          >
            <option value="112">112</option>
            <option value="111">111</option>
            <option value="110">110</option>
          </select>
          <select
            name="county"
            id="county"
            v-model="selectCounty"
            @change="changeCounty(selectCounty)"
          >
            <option
              v-for="(item, index) in countyRegions"
              :key="index"
              :value="index"
              :label="index"
            ></option>
          </select>
        </div>
        <div class="people-colum">
          <div id="barColum" ref="barColum"></div>
        </div>
        <ul>
          <li v-for="(item, index) in test" :key="index"></li>
        </ul>
        <ul class="people-list">
          <li
            class="people-item"
            v-for="(itemm, index) in peopleData"
            :key="index"
          >
            <h3>{{ itemm.site_id }}</h3>
            <p>年底人口數 : {{ itemm.people_total }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import taiwanJSON from "../../assets/json/county.json";

onMounted(() => {
  window.addEventListener("resize", function () {
    myChart.resize();
    barChart.resize();
  });
  drawTaiwan();
  drawBar();
  actionSearch();
});

const test = reactive({
  民眾黨: {
    total: 366854,
    rate: 23.79,
  },
  民進黨: {
    total: 587899,
    rate: 38.13,
  },
  國民黨: {
    total: 587258,
    rate: 38.08,
  },
});

const selectYear = ref("112");
const selectCounty = ref("新北市");
const populationInfo = reactive({
  data: {},
});
// const url = computed(
//   () =>
//     `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP048/${selectYear.value}`
// );
// const actionSearch = async () => {
//   const response = await $fetch(url.value);
//   populationInfo.data = response;
// };

const peopleData = computed(() => {
  const result = populationInfo.data.responseData || [];
  const filterResult = result.filter((item) =>
    item.site_id.startsWith(selectCounty.value)
  );
  return filterResult;
});

const countyRegions = reactive({
  南投縣: { name: "南投縣", color: "#F8C471" },
  臺中市: { name: "臺中市", color: "#85C1E9" },
  臺北市: { name: "臺北市", color: "#FF6B6B" },
  臺南市: { name: "臺南市", color: "#A3E4D7" },
  臺東縣: { name: "臺東縣", color: "#AED6F1" },
  嘉義市: { name: "嘉義市", color: "#FAD7A0" },
  嘉義縣: { name: "嘉義縣", color: "#E59866" },
  基隆市: { name: "基隆市", color: "#4ECDC4" },
  宜蘭縣: { name: "宜蘭縣", color: "#98D8C8" },
  屏東縣: { name: "屏東縣", color: "#D7BDE2" },
  彰化縣: { name: "彰化縣", color: "#F1948A" },
  新北市: { name: "新北市", color: "#45B7D1" },
  新竹市: { name: "新竹市", color: "#BB8FCE" },
  新竹縣: { name: "新竹縣", color: "#F7DC6F" },
  桃園縣: { name: "桃園縣", color: "#FFA07A" },
  澎湖縣: { name: "澎湖縣", color: "#A2D9CE" },
  花蓮縣: { name: "花蓮縣", color: "#F9E79F" },
  苗栗縣: { name: "苗栗縣", color: "#82E0AA" },
  連江縣: { name: "連江縣", color: "#FADBD8" },
  金門縣: { name: "金門縣", color: "#D2B4DE" },
  雲林縣: { name: "雲林縣", color: "#73C6B6" },
  高雄市: { name: "高雄市", color: "#F5B7B1" },
});

const taiwanMap = ref("");
let myChart = null;

const drawTaiwan = async () => {
  myChart = echarts.init(taiwanMap.value);
  echarts.registerMap("taiwan", taiwanJSON); //注册可用的地图

  const option = {
    // 數據系列
    series: [
      {
        type: "map",
        map: "taiwan",
        geoIndex: 1,
        aspectScale: 1,
        roam: true,
        zoom: 1,
        scaleLimit: {
          min: 1,
          max: 2,
        },
        center: [120, 24],
        // emphasis: {
        //   disabled: true, // 禁用高亮效果
        // },
        // select: {
        //   disabled: true, // 禁用选中效果
        // },
        data: Object.keys(countyRegions).map((key) => ({
          name: key,
          value: 0,
          itemStyle: {
            areaColor: "#ffffff", //countyRegions[key].color
            borderColor: "#aaaa",
            borderWidth: 1,
          },
        })),
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: "{b}",
    },
  };

  myChart.setOption(option);
};

const changeCounty = (name) => {
  const selectedRegion = Object.keys(countyRegions).find((key) => key === name);
  if (selectedRegion) {
    myChart.setOption({
      series: [
        {
          data: Object.keys(countyRegions).map((key) => ({
            name: key,
            value: 0,
            itemStyle: {
              areaColor: key === name ? countyRegions[key].color : "#ffffff", // 修改此行
              borderColor: "#aaaa",
              borderWidth: 1,
            },
          })),
        },
      ],
    });
  }
};

const barColum = ref("");
let barChart = null;

const drawBar = async () => {
  barChart = echarts.init(barColum.value);

  const option = {
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: ["product", "2015", "2016", "2017"],
      source: [
        { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
        { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
        { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
        { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
      ],
    },
    xAxis: { type: "category" },
    yAxis: {},
    series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
  };

  barChart.setOption(option);
};
</script>
<style lang="scss">
.statistic-wrap {
  display: flex;
}

.statistic-map {
  width: 500px;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  background: #e4faff;

  #taiwanMap {
    width: 100%;
    height: 100%;
    background: #ffff;
    margin: 0 auto;
  }
}

.statistic-people {
  width: 60%;
  box-sizing: border-box;
  padding: 20px;

  .people-select {
    margin-bottom: 20px;
  }

  .people-colum {
    width: 100%;
    height: 300px;

    #barColum {
      width: 100%;
      height: 100%;
      background: #ffff;
      margin: 0 auto;
    }
  }

  .people-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #aaaa;

    h3 {
      font-size: 16px;
      font-weight: 400;
      color: #202020;
    }

    p {
      font-size: 14px;
      color: #535353;
    }
  }
}
</style>
