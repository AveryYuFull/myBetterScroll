import ScrollInit from './cores/Scroll.init';

/**
 * bs实现
 * @param {*} el dom元素
 * @param {*} options 可选参数
 * @returns {*}
 */
export default function BetterScroll (el, options) {
    return new ScrollInit(el, options);
}
