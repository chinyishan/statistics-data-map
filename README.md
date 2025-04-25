# 總統開票全台地圖（Taiwan Election Map）

## 專案簡介

本專案為個人 Side Project，目的是練習資料視覺化與地理圖資應用，結合 Vue、Nuxt 與 ECharts，打造出互動式的台灣全區縣市開票結果地圖。使用者可點選地圖查看各縣市的候選人得票情況，並搭配圖表展示票數分布。

## Demo 連結

<a href="https://statistics-data-map.vercel.app/" target="_blank">台灣歷年總統 都幾?</a>

## 使用技術

- Vue3：前端核心框架
- Nuxt3：用於伺服器端渲染（SSR）與路由架構
- ECharts：資料視覺化（地圖圖層、圓餅圖、長條圖等）
- SCSS：樣式管理與響應式設計

## 專案特色

- 全台互動式地圖，呈現各縣市得票狀況
- 整合 ECharts 圖表，動態顯示票數與比例
- 支援 RWD，手機與平板裝置皆可良好瀏覽
- Nuxt 實作頁面分割與效能優化
- 設計簡潔、資訊聚焦，提升使用者操作體驗

## 專案啟動方式

```
# 安裝依賴
npm install

# 開發模式啟動
npm run dev

# 編譯與部署
npm run build
npm run start
```

## 學習重點

- 地理資料（GeoJSON）結合圖表資料的處理邏輯
- Vue 元件與 Nuxt 路由架構的整合應用
- ECharts 視覺化圖層控制與地圖事件綁定
- 前端資料結構的整合與資料來源模擬

## 網頁 UI 資料來源

<a href="https://2023.thef2e.com/works" target="_blank">六角學院的比賽中參賽者所提供的 UI 設計稿資料</a>
