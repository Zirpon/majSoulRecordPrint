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
        //path: path.resolve(__dirname, "dist"),
        path: path.resolve(__dirname, "../assets/dist"),
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin()],
    },
    devServer: {
        client:{
            overlay: false,
        },
        static: "./dist",
    },
    plugins: [
        //自动生成目标html文件
        new HtmlWebpackPlugin({
            title: "blog test",
            template: path.resolve(__dirname, "index.html"),
            inject: "body",
            favicon: "favicon.ico",
            // 通过minify属性可以压缩html文件
            minify:false
            /*{
                // 移除空格
                collapseWhitespace:true,
                // 移出注释
                removeComments:true,
            },*/

        }),
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
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    }
};