const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
      // relative paths so the build works from a gh-pages sub-path
      publicPath: isProd ? './' : '/',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: { transpileOnly: !isProd },
        },
        {
          test: /\.css$/,
          use: [
            // css лежит в dist/css/, поэтому ассеты относительно него — на уровень выше
            isProd ? { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } } : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|webp|svg|woff2?)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      isProd && new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' }),
    ].filter(Boolean),
    devtool: isProd ? false : 'eval-cheap-module-source-map',
    devServer: {
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    },
  };
};
