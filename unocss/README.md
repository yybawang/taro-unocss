unocss 官方库在 Vite 环境下会加入一个 escape-view 的特殊符号，小程序无法解析特殊符号，vite 文件夹是改了源码去掉特殊符号编译之后的

preset-applet 自带配置会影响三元运算符的?，且配置不支持 ? 号覆盖，这里也改了源码再编译的
