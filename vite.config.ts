import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression' // 解决构建压缩
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'


export default defineConfig(env => {
    const root = process.cwd()
    const envConfig = loadEnv(env.mode, root)
    return {
        plugins: [
            // basicSsl(),
            vue(),
            eslintPlugin({
                cache: false, // 取消检查缓存
                exclude: [ // 忽略的文件&目录
                    '**/node_modules/**',
                    '**/dist/**',
                    '**/public/**'
                ]
            }),
            viteCompression({
                // 生成压缩包gz
                verbose: true, // 输出压缩成功
                disable: true, // 是否禁用
                // filter // 默认为  /\.(js|mjs|json|css|html)$/i
                threshold: 1, // 体积大于阈值会被压缩，单位是b
                algorithm: 'gzip', // 压缩算法
                ext: '.gz'// 生成的压缩包后缀
            })
        ],
        base: './',
        build: {
            chunkSizeWarningLimit: 500,
            minify: 'esbuild',
            cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
            reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@img': path.resolve(__dirname, 'src/assets/img'),
                '@c': path.resolve(__dirname, 'src/components'),
                '@views': path.resolve(__dirname, 'src/views')
            }
        },
        css: {
            modules: {
                scopeBehaviour: 'local',
                generateScopedName: '[local]___[hash:base64:5]',
                localsConvention: 'camelCase'
            },
            preprocessorOptions: {
                scss: {},
                less: {
                    javascriptEnabled: true
                }
            }
        },
        server: {
            open: false,
            host: '0.0.0.0',
            port: 1111,
            https: false,
            proxy: {
                '/api': {
                    target: envConfig.VITE_APP_BASE_API || 'https://www.xiaoli.vip',
                    changOrigin: true,
                    secure: false,
                    logLevel: 'error',
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        }
    }
})
