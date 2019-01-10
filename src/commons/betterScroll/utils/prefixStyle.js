import isBrowser from './isBrowser';

/**
 * 定义兼容transform名称
 * @private
 */
const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
};

// 样式前缀
const vendor = (function () {
    let res = null;
    if (!isBrowser()) {
        res = null;
    } else {
        const _elemStyle = document.createElement('object').style;
        if (!_elemStyle) {
            res = null;
        } else {
            for (let key in transformNames) {
                if (transformNames.hasOwnProperty(key)) {
                    const _val = transformNames[key];
                    if (typeof _elemStyle[_val] !== 'undefined') {
                        res = key;
                        break;
                    }
                }
            }
        }
    }
    return res;
})();

/**
 * 样式添加前缀
 * @param {String} style 样式
 * @returns {String} 拼接好的样式
 */
export default function prefixStyle (style) {
    if (!vendor || !style) {
        return null;
    }

    if (vendor === 'standard') {
        if (style === 'transitionEnd') {
            style = 'transitionend';
        }
    } else {
        style = vendor + style.charAt(0).toLocaleUpperCase + style.substr(1);
    }
    return style;
}
