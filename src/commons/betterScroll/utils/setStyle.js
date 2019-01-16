/**
 * 设置dom元素的style
 * @param {HTMLElement} el 目标元素
 * @param {String} prop 属性名
 * @param {String} val 属性值
 */
export default function setStyle (el, prop, val) {
    if (!el || !prop) {
        return;
    }
    const _elStyle = el.style;
    if (_elStyle) {
        _elStyle[prop] = val;
    }
}
