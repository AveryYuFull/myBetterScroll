/**
 * 获取元素的样式属性
 * @export
 * @param {HTMLElement} el dom元素对象
 * @param {String} prop 元素属性
 * @returns {Any} 返回属性值
 */
export default function getStyle (el, prop) {
    if (!el) {
        return null;
    }
    let res = null;
    if (window && window.getComputedStyle instanceof Function) {
        res = window.getComputedStyle(el, null);
    } else if (el.curentStyle) {
        res = el.curentStyle();
    }
    if (res && prop) {
        res = res[prop];
    }
    return res;
}
