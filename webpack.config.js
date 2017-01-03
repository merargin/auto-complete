module.exports = {
    entry: __dirname+ '/src/index.js',
    output: {
        path: __dirname+'/public/',
        publicPath: __dirname+'/public/',
        filename: 'bundle.js'
    },
    devServer: {
        inline: true,
        port: 8001
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                        presets: ['es2015', 'react', 'stage-2']
                }
            },
	        {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    }

}
