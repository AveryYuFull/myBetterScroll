import prefixStyle from './prefixStyle';

/**
 * 判断是否有对应的style属性
 * @param {String} prop 判断是否有对应的属性
 * @returns {Boolean} 是否有对应的属性，如果有，就返回true，否则返回false
 */
export function hasStyle (prop) {
    let res = false;
    if (prop) {
        const _elemStyle = document.createElement('div').style;
        if (_elemStyle) {
            prop = prefixStyle(prop);
            res = prop && typeof _elemStyle[prop] !== 'undefined';
        }
    }
    return res;
}
