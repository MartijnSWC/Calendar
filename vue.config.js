const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
   lintOnSave: false,
  // crossorigin: 'anonymous',
	// productionSourceMap: false,
	// integrity: true,
})
