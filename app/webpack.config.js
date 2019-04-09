var HTMLWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig1 = new HTMLWebpackPlugin({
	template: __dirname + "/customerView.html",
	filename: "customerView.html",
	inject: "head"
});

var HTMLWebpackPluginConfig2 = new HTMLWebpackPlugin({
	template: __dirname + "/primaView.html",
	filename: "primaView.html",
	inject: "head"
});

module.exports = {
	mode: "production",
	entry: 	{	customer: __dirname + "/customerFilters.js", 
				prima: __dirname + "/primaFilters.js",
				hla: __dirname + "/hla.js"
			},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	output: {
		filename: "[name].js",
		path: __dirname + "/build"
	},
	plugins: [],
	node: {
		fs: 'empty'
	}
};

