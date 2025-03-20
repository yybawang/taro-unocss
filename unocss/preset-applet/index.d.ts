import * as _unocss_core from '@unocss/core';
import { SourceCodeTransformer } from '@unocss/core';
import * as _unocss_preset_uno_index from '@unocss/preset-uno/index';
import { PresetUnoOptions } from '@unocss/preset-uno';

interface PresetAppletOptions extends PresetUnoOptions {
    /**
     * Unsupported characters in applet, will be added to the default value
     * @default ['.', ':', '%', '!', '#', '(', ')', '[', '/', ']', ',', '$', '{', '}', '@', '+', '^', '&', '<', '>', '\'', '\\', '"', '?', '*']
     */
    unsupportedChars?: string[];
    /**
     * Space Between and Divide Width Elements
     * @default ['view', 'button', 'text', 'image']
     */
    betweenElements?: string[];
    /**
     * Space Between and Divide Width Elements
     * @default ['view', 'button', 'text', 'image']
     */
    wildcardElements?: string[];
}

interface TransformerAppletOptions {
    /**
     * Unsupported characters in applet, will be added to the default value
     * @default ['.', ':', '%', '!', '#', '(', ')', '[', '/', ']', ',', '$', '{', '}', '@', '+', '^', '&', '<', '>', '\'', '\\', '"', '?', '*', '=']
     */
    unsupportedChars?: string[];
}
declare function transformerApplet(options?: TransformerAppletOptions): SourceCodeTransformer;

declare const presetApplet: _unocss_core.PresetFactory<_unocss_preset_uno_index.Theme, PresetAppletOptions>;

export { type PresetAppletOptions, presetApplet as default, presetApplet, transformerApplet };
