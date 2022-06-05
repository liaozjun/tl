module.exports = {
  //用户部署的基本url,如果不配置默认为部署所在域的根目录，如果不要部署到子路径，则需要配置该项。如果设为空，转移后的使用相对路径引用文件。并且将所有的css js都放到了根目录
  publicPath: '',

  //输出文件夹，我这里设为www,主要是和Cordova配合生成安卓应用的。
  outputDir: '../www',

  //不生成map
  productionSourceMap: false,

  // 包含运行时编译器的 Vue 构建版本
  runtimeCompiler: true,

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': []
      }
    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: false,
      theme: false
    }
  }
}
    
  
