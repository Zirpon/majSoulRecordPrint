const  path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    mode: "development",
    //查看带包后的源代码
    devtool : "inline-source-map",
    entry: "./src/index.js",
    output: {
        //filename: "[name].[contenthash].js",
        filename: "dist.js",
        path: path.resolve(__dirname, "dist"),
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin()],
    },
    devServer: {
        static: "./dist",
    },
    plugins: [
        //自动生成目标html文件
        //new HtmlWebpackPlugin({
        //    title: "blog test",
        //}),
        //分析文件大小插件
        //new BundleAnalyzerPlugin(),
    ],
    module:{
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg||jpg|gif|jpeg)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                }
            },
        ]
    }
};