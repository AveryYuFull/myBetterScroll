import scrollTo from './scrollTo';

/**
 * 重新重置位置
 * 如果滚动条的位置超过了可以滑动的最大距离／小于最小距离就需要重新重置滚动条的位置
 * @param {Number} x 水平的当前位置
 * @param {Number} y 垂直的当前位置
 * @param {Number} time 回弹的动画时间
 * @param {Object} easing 动画规则对象
 * @param {Object} options 可选参数
 * @param {Object} options.minScroll 可滑动距离下限
 * @param {Number} options.minScroll.x 横向可滑动距离下限
 * @param {Number} options.minScroll.y 横向可滑动距离下限
 * @param {Object} options.maxScroll 滑动距离上限
 * @param {Number} options.maxScroll.x 横向可滑动距离上限
 * @param {Number} options.maxScroll.y 纵向可滑动距离上限*
 * @param {Scroll} options.bScroll BScroll 对象
 * @param {Object} options.opts 可选参数
 * @returns {Boolean} 返回是否重置位置成功
 * @private
 */
export default function resetPosition (x, y, time, easing, options) {
    const { minScroll, maxScroll, bScroll, opts } = options;
    const _tmpX = x;
    const _tmpY = y;
    const { x: maxScrollX, y: maxScrollY } = maxScroll;
    const { x: minScrollX, y: minScrollY } = minScroll;

    x = _resetPosition(x, maxScrollX, minScrollX);
    y = _resetPosition(y, maxScrollY, minScrollY);
    if (x === _tmpX && y === _tmpY) {
        return false;
    }
    scrollTo(x, y, time, easing, bScroll, opts);
    return true;
}

/**
 * 重置滚动条位置
 * @param {Number} pos 水平/垂直滚动条位置
 * @param {Number} maxScroll 水平／垂直滚动条最大可以滑动距离
 * @param {Number} minScroll 水平／垂直滚动条最小可以滑动距离
 * @returns {Number} 返回过滤后的位置
 */
function _resetPosition (pos, maxScroll, minScroll) {
    if (pos < maxScroll) {
        pos = maxScroll;
    } else if (pos > minScroll) {
        pos = minScroll;
    }
    return pos;
}
