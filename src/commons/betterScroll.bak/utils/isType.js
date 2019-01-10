/**
 * 判断类型
 *
 * @export
 * @param {*} obj 对象
 * @param {string} str 类型字符串
 * @returns {Boolean}
 */
export function isType (obj, str) {
    let res = false;
    try {
        res = Object.prototype.toString.call(obj) === '[object ' + str + ']';
    } catch (error) {}

    return res;
}
