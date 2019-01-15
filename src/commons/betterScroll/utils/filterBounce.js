/**
 * 过滤bounce
 * @param {Object|Boolean} bounce 回弹动画属性配置对象
 * @returns {Object} 返回过滤后的bounce值
 */
export default function filterBounce (bounce) {
    let _bounce = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };

    if (bounce) {
        _bounce.left = typeof bounce.left === 'undefined' ? true : bounce.left;
        _bounce.right = typeof bounce.right === 'undefined' ? true : bounce.right;
        _bounce.top = typeof bounce.top === 'undefined' ? true : bounce.top;
        _bounce.bottom = typeof bounce.bottom === 'undefined' ? true : bounce.bottom;
    }
    return _bounce;
}
