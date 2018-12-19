import { isType } from './isType';

/**
 * 拷贝对象
 *
 * @export
 * @param {Object} target 默认对象(如果为boolean的时候flase为浅拷贝，true为深拷贝，默认为深拷贝)
 * @param {Object} rest 被拷贝的对象
 * @returns {Object} target
 */
export default function extend (target, ...rest) {
    let isDeep = true;
    let n = 0;
    if (rest && rest.length < 1) {
        return typeof target === 'boolean' ? {} : target;
    }
    if (typeof target === 'boolean') {
        isDeep = target;
        target = rest[0];
        n = 1;
    }

    for (let i = (0 + n); i < rest.length; i++) {
        let source = rest[i];
        if (source instanceof Object) {
            if (isDeep) {
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        const sourceItem = source[key];
                        if (isObjectAndArray(sourceItem)) {
                            let children = (isObjectAndArray(target[key]) && target[key]) || ((sourceItem instanceof Array) ? [] : {});
                            target[key] = extend(children, sourceItem);
                        } else {
                            if (typeof sourceItem !== 'undefined') {
                                target[key] = sourceItem;
                            } else if (typeof target[key] === 'undefined') {
                                target[key] = sourceItem;
                            }
                        }
                    }
                }
            } else {
                target = Object.assign(target, source);
            }
        }
    }
    return target;

    /**
     * 判断是否为对象
     *
     * @param {*} obj 对象
     * @returns {Boolean}}
     */
    function isObjectAndArray (obj) {
        return (obj && (isType(obj, 'Array') || isType(obj, 'Object')) && (!obj.constructor || obj.constructor === Object)) || false;
    }
}
