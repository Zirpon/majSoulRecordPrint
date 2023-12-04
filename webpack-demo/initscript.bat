GOTO START

npm init -y
npm install --safe-dev webpack webpack-cli 
npm install --safe-dev style-loader css-loader
npm install --safe-dev html-webpack-plugin
npm install --safe-dev babel-loader @babel/core @babel/preset-env @babel/preset-react
npm install --safe-dev terser-webpack-plugin
npm install --safe-dev webpack-dev-server 
npm install --safe-dev webpack-bundle-analyzer
npm install --safe-dev echarts recharts

// 编译js 生成 index.html
npx webpack
// 生成服务器 运行调试
npm run start

:START

npx webpack
