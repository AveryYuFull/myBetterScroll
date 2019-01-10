/**
 * 获取元素列表
 * @param {HTMLElement|String} el 元素列表，元素选择器
 * @param {HTMLElement} pEl 查询父元素
 * @returns {HTMLElement} 元素列表
 * @exports
 */
export default function getElements (el, pEl = document) {
    let _el;
    if (el) {
        if (typeof el === 'string') {
            _el = pEl.querySelectorAll(el);
        } else if (typeof el.length !== 'number') {
            _el = [el];
        }
    } else if (pEl && pEl !== document && pEl.children && pEl.children.length > 0) {
        _el = pEl.children;
    }

    if (_el && _el.length === 0) {
        _el = undefined;
    }
    if (_el && !(_el instanceof Array)) {
        _el = [_el];
    }
    return _el || [];
}
