import { entriesToCss, toArray, definePreset } from '@unocss/core';
import { presetUno } from '@unocss/preset-uno';

const UNSUPPORTED_CHARS = [".", ":", "%", "!", "#", "(", ")", "[", "/", "]", ",", "$", "{", "}", "@", "+", "^", "&", "<", ">", "'", "\\", '"', "*", "="];

function encodeNonSpaceLatin(str) {
  const regex = /[^A-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\ ]+/gi;
  if (!regex.test(str))
    return str;
  if (str.includes(" $$ "))
    return str;
  function encode(str2) {
    let encoded = "";
    for (let i = 0; i < str2.length; i++)
      encoded += str2.charCodeAt(i);
    return encoded;
  }
  return str.replace(regex, (match) => encode(match));
}

function preflights(options) {
  if (options.preflight) {
    return [
      {
        layer: "preflights",
        getCSS({ theme, generator }) {
          if (theme.preflightBase) {
            let entries = Object.entries(theme.preflightBase);
            if (options.preflight === "on-demand") {
              const keys = new Set(Array.from(generator.activatedRules).map((r) => r[2]?.custom?.preflightKeys).filter(Boolean).flat());
              entries = entries.filter(([k]) => keys.has(k));
            }
            if (entries.length > 0) {
              let css = entriesToCss(entries);
              if (options.variablePrefix !== "un-") {
                css = css.replace(/--un-/g, `--${options.variablePrefix}`);
              }
              const roots = toArray(theme.preflightRoot ?? ["page,::before,::after", "::backdrop"]);
              return roots.map((root) => `${root}{${css}}`).join("");
            }
          }
        }
      }
    ];
  }
}

function transformerApplet(options = {}) {
  const _UNSUPPORTED_CHARS = [...UNSUPPORTED_CHARS, ...options.unsupportedChars ?? []];
  const ESCAPED_UNSUPPORTED_CHARS = _UNSUPPORTED_CHARS.map((char) => `\\${char}`);
  const charTestReg = new RegExp(`[${ESCAPED_UNSUPPORTED_CHARS.join("")}]`);
  const charReplaceReg = new RegExp(`[${ESCAPED_UNSUPPORTED_CHARS.join("")}]`, "g");
  const negativeReplaceReg = /^-+/;
  return {
    name: "transformer-applet",
    enforce: "pre",
    async transform(s, _, ctx) {
      let code = s.toString();
      const { uno, tokens } = ctx;
      const { matched } = await uno.generate(code, { preflights: false });
      const replacements = Array.from(matched).filter((i) => charTestReg.test(i)).filter((i) => !i.includes("=") || i.includes("[url("));
      for (let replace of replacements) {
        let replaced = replace.replace(charReplaceReg, "_a_");
        replaced = encodeNonSpaceLatin(replaced);
        const util = await uno.parseToken(replace);
        const layer = util?.[0]?.[4]?.layer;
        replace = replace.replace(negativeReplaceReg, "");
        replaced = replaced.replace(negativeReplaceReg, "");
        uno.config.shortcuts.push([replaced, replace, { layer }]);
        tokens.add(replaced);
        code = code.replaceAll(replace, replaced);
      }
      s.overwrite(0, s.original.length, code);
    }
  };
}

function variantSpaceAndDivide(options) {
  const betweenElements = options?.betweenElements ?? ["view", "button", "text", "image"];
  return [
    (matcher) => {
      if (matcher.startsWith("_"))
        return;
      if (/space-[xy]-.+$/.test(matcher) || /divide-/.test(matcher)) {
        return {
          matcher,
          selector: (input) => {
            const selectors = betweenElements.map((el) => {
              const res = [];
              betweenElements.forEach((e) => {
                res.push(`${input}>${el}+${e}`);
              });
              return res.join(",");
            });
            return selectors.join(",");
          }
        };
      }
    }
  ];
}
function variantWildcard(options) {
  const wildcardElements = options?.wildcardElements ?? ["view", "button", "text", "image"];
  return [
    (matcher) => {
      if (matcher.startsWith("_"))
        return;
      if (/\*:.*/.test(matcher)) {
        return {
          matcher,
          selector: (input) => {
            const newInput = input.replace(/\s?>\s?\*/g, "");
            const selectors = wildcardElements.map((el) => `${newInput}>${el}`);
            return selectors.join(",");
          }
        };
      }
    }
  ];
}

const presetApplet = definePreset((options = {}) => {
  options.preflight = options.preflight ?? true;
  options.variablePrefix = options.variablePrefix ?? "un-";
  const _UNSUPPORTED_CHARS = [...UNSUPPORTED_CHARS, ...options.unsupportedChars ?? []];
  function unoCSSToAppletProcess(str) {
    const ESCAPED_ESCAPED_UNSUPPORTED_CHARS = _UNSUPPORTED_CHARS.map((char) => `\\\\\\${char}`);
    const charTestReg = new RegExp(`${ESCAPED_ESCAPED_UNSUPPORTED_CHARS.join("|")}`);
    const charReplaceReg = new RegExp(`${ESCAPED_ESCAPED_UNSUPPORTED_CHARS.join("|")}`, "g");
    if (charTestReg.test(str))
      str = str.replace(charReplaceReg, "_a_");
    return str;
  }
  const _presetUno = presetUno({ ...options, preflight: false });
  _presetUno.rules?.pop();
  _presetUno.variants?.splice(1, 1, ...variantSpaceAndDivide(options), ...variantWildcard(options));
  return {
    ..._presetUno,
    name: "unocss-preset-applet",
    preflights: preflights(options),
    postprocess: [
      (util) => {
        if (util.selector) {
          util.selector = unoCSSToAppletProcess(util.selector);
          util.selector = encodeNonSpaceLatin(util.selector);
        }
        return util;
      }
    ],
    configResolved(config) {
      if (!config.transformers)
        config.transformers = [];
      config.transformers.push(transformerApplet(options));
    }
  };
});

export { presetApplet as default, presetApplet, transformerApplet };
