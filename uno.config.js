import {
  defineConfig,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'
import {
  presetRemRpx,
  transformerAttributify,
} from "unocss-applet";
import presetChinese from "unocss-preset-chinese";
import presetEase from "unocss-preset-ease";
import presetApplet from './unocss/preset-applet';

const isApplet = process.env.TARO_ENV !== "h5" ?? false;

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetChinese(),
    presetEase(),
    presetApplet(),
    presetRemRpx({ mode: isApplet ? "rem2rpx" : "rpx2rem" }),
  ],
  theme: {
    colors: {
      primary: '#1772F6',
      secondary: '#3b85f1',
    },
  },
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    // Don't change the following order
    transformerAttributify(),
  ],
})
