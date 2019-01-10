/**
 * 获取dom元素rect
 * @param {String} el 获取
 * @returns {Object} 返回rect对象
 */
export default function getRect (el) {
    if (!el) {
        return null;
    }
    let _res = null;
    if (el instanceof window.SVGElement) { // 由于svg元素是没有offset属性，所以通过offset来获取元素的相对位置和大小
        const _rect = el.getBoundingClientRect();
        if (_rect) {
            _res = {
                top: _rect.top,
                left: _rect.left,
                width: _rect.width,
                height: _rect.height
            };
        } else {
            _res = {
                top: el.offsetTop,
                left: el.offsetLeft,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        }
    }
    return _res;
}
