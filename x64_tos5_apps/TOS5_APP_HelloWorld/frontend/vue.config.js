const {defineConfig} = require('@vue/cli-service')
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    transpileDependencies: true,
    filenameHashing: true, //文件哈希
    devServer: {
        proxy: {
            '/v2': {
                target: 'http://10.18.13.128:8181/',
                pathRewrite: {
                    '^/static': '/v2/static'
                }
            },
            '/images': {
                target: 'http://10.18.13.128:8181/',
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                "@": resolve("src"),
            },
            extensions: ['.js', '.vue', '.json']
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
        config.module
            .rule('wasm')
            .test(/\.wasm$/)
            .use('wasm-loader')
            .loader('wasm-loader')
            .end()
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({bypassOnDebug: true})
            .end()
    }
})
