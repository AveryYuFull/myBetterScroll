import Scroll from './cores/Scroll';

/**
 * 创建Scroll对象的工厂方法
 * @export
 * @param {HTMLElement|String} el dom元素
 * @param {Object} options 可选参数
 * @returns {Scroll} 返回Scroll对象
 */
export default function scrollFactory (el, options) {
    return new Scroll(el, options);
}
