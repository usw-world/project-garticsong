const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const ErrorHandlePlugin = require("./error-handle-plugin");

console.log("mode is (usoock) :: ", mode);

module.exports = {
	// entry: prod ? { 'build/bundle': ['./src/main.js'] } : { "static/bundle": ["./src/main.js"] },
	entry: prod ? { 'build/bundle': ['./src/main.js'] } : { "bundle": ["./src/main.js"] },
	resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte/package.json'))
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: path.join(__dirname, '/public'),
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: !prod
						},
						emitCss: prod,
						hotReload: !prod
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				// required to prevent errors from Svelte on Webpack 5+
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			},
			// {
			// 	test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
			// 	use: {
			// 		loader: 'url-loader?limit=100000'
			// 	}
			// },
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
				use: {
					loader: "file-loader",
					// options: {
					// 	publicPath: path.join(__dirname, "public")
					// }
				},
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		// new ErrorHandlePlugin()
	],
	devtool: prod ? false : 'source-map',
	// devtool: 'source-map',
	devServer: {
		hot: true,
		port: process.env.PORT || 2000,
		// static: [
		// 	{
		// 		directory: path.join(__dirname, "public"),
		// 	},
		// 	{
		// 		directory: path.join(__dirname, "/build"),
		// 		publicPath: "/static/"
		//  }
		// ]
	},
	stats: {
		warningsFilter: [
			(warning) => {
				const {moduleName, message} = warning;
				return !(!moduleName.match(/.\/src\/GameRoom\/Questioner.svelte/) || !message.match(/Unused CSS selector/));
			}
		]
	}
};