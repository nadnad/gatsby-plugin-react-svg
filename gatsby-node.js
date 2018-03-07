exports.modifyWebpackConfig = ({config, stage}, pluginOptions) => {
	if ([
		'develop',
		'develop-html',
		'build-html',
		'build-javascript'
	].includes(stage)) {
		const { include, exclude } = pluginOptions;

		// Remove svg from url-loader config
		config.loader('url-loader', {
			test: /\.(jpg|jpeg|png|gif|mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				name: `static/[name].[hash:8].[ext]`,
			}
		});
		
		// Readd url-loader if in/excludes are specified
		if (include || exclude) {
			config.loader('url-loader-svg', {
				test: /\.svg$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: `static/[name].[hash:8].[ext]`,
          classIdPrefix: '[name]-[hash:8]__',
				},
				include: exclude,
				exclude: include
			});			
		}

    const svgoOpts = {
      prefixIds: true
    }
		
		config.loader('svg-react-loader', {
			test: /\.svg$/,
			loaders: [
        'file-loader',
        `svgo-loader?${JSON.stringify(svgoOpts)}`,
        'svg-react-loader'
      ],
			include,
			exclude
		});
	}

	return config;
}
