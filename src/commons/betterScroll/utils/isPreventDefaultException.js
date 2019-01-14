/**
 * 判断是否可以阻止事件的默认行为
 * @param {HTMLElement} el 元素对象
 * @param {Object} options 可选参数
 * @returns {Boolean} 是否可以阻止事件的默认行为
 * @exports
 */
export default function isPreventDefaultException (el, options) {
    let res = false;
    if (el && options instanceof Object) {
        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                const _item = options[key];
                if (_item instanceof RegExp) {
                    res = _item.test(el[key]);
                } else {
                    res = _item === el[key];
                }
                if (res) {
                    break;
                }
            }
        }
    }
    return res;
}
