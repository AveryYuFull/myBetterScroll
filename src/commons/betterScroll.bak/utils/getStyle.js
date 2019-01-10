/**
 * 获取元素的样式（如果有prop，就获取指定的元素样式，如果没有prop，就获取全部的样式）
 *
 * @export
 * @param {HTMLElement} el dom元素节点
 * @param {String} prop 元素样式属性
 * @returns {String|Object} 返回元素的样式列表、指定样式
 */
export default function getStyle (el, prop) {
    let res = null;

    if (el) {
        res = (window && window.getComputedStyle)
            ? window.getComputedStyle(el, null) : el.currentStyle;
        if (res && prop) {
            res = res[prop];
        }
    }
    return res;
}
