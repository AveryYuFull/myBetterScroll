import isBrowser from './isBrowser';

// 返回prefix style
const vendor = (function () {
    if (!isBrowser()) {
        return false;
    }

    const _transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    };
    let _elemStyle = document.createElement('div').style;

    for (let key in _transformNames) {
        if (_elemStyle[_transformNames[key]] !== 'undefined') {
            return key;
        }
    }
    return false;
})();

/**
 * 过滤元素的样式
 *
 * @export
 * @param {String} style 元素的样式
 * @returns {*}
 */
export default function prefixStyle (style) {
    if (!style || !vendor) {
        return null;
    }

    let res = null;
    if (vendor === 'standard') {
        if (style === 'transitionEnd') {
            res = 'transitionend';
        }
        res = style;
    } else {
        res = vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }

    return res;
}
