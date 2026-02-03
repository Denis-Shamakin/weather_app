const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/main.ts',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash].js',
      clean: true,
      publicPath: '/',
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vue: '@vue/runtime-dom',
      },
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            reactivityTransform: false,
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: isDev,
          },
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern',
                sassOptions: {
                  indentedSyntax: false,
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
      }),
      new DotenvPlugin(),
      new VueLoaderPlugin(),
    ],

    devServer: isDev
      ? {
          static: {
            directory: path.resolve(__dirname, 'public'),
          },
          compress: true,
          port: 3000,
          hot: true,
          historyApiFallback: true,
          client: {
            overlay: {
              warnings: false,
              errors: true,
            },
          },
        }
      : undefined,

    devtool: isDev ? 'eval-source-map' : 'source-map',

    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },

    performance: {
      hints: isDev ? false : 'warning',
    },
  };
};
