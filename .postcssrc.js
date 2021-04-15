module.exports = ({ file }) => {
    let isVant = file && file.dirname && file.dirname.indexOf("vant") > -1;
    let rootValue = isVant ? 16 : 32; // 判断条件 请自行调整
    return {
      plugins: {
        'postcss-pxtorem': {
          rootValue: rootValue, //根目录的字体大小设为32px
          propList: ['*','font-size','!border','border-radius','!box-shadow','!text-shadow'] ,//proplist:是那些属性需要转换成rem，全部
          minPixelValue: 2 //最小转换单位.2px
        },
      }
    }
  };
