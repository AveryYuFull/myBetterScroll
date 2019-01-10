/**
 * 是否可以阻止元素的默认行为
 *
 * @export
 * @param {HTMLElement} el dom元素
 * @param {Object} exceptions 异常匹配对象
 * @returns {Boolean} 返回是否阻止异常
 */
export default function isPreventDefaultErr (el, exceptions) {
    if (!el) {
        return true;
    }
    if (!exceptions) {
        return false;
    }

    let res = false;
    for (let key in exceptions) {
        const _item = exceptions[key];
        if (_item instanceof RegExp) {
            res = _item.test(el[key]);
            if (res) {
                break;
            }
        }
    }
    return res;
}
