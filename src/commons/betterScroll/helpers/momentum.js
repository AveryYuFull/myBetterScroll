/**
 * 根据速度计算出动量
 * @param {Number} startPos 开始位置
 * @param {Number} curPos 当前位置
 * @param {Number} time 时间间隔
 * @param {Number} wrapSize 包裹元素的大小
 * @param {Number} minScroll 滑动距离的下限
 * @param {Number} maxScroll 滑动距离的上限
 * @param {Object} options 可选参数
 * @returns {Object} 返回计算后的滑动位置
 */
export default function momentum (startPos, curPos, time, wrapSize, minScroll, maxScroll, options) {
    if (!startPos || !curPos || !time || !options) {
        return {
            destination: curPos,
            duration: 0
        };
    }

    const _distance = curPos - startPos;
    const _speed = Math.abs(_distance) / time;
    /**
     * deceleration: 减速度，表示momentum动画的减速度(默认值为0.001)
     * swipeTime: momentum动画的时间
     * swipeTime: momentum动画的回弹动画时间
     */
    const { deceleration, swipeBounceTime, swipeTime } = options;
    let _newPos = curPos + (_speed / deceleration) * (_distance < 0 ? -1 : 1);
    let _duration = swipeTime;
    let _rate = 15;
    if (_newPos > minScroll) {
        _newPos = wrapSize ? Math.min(minScroll + wrapSize / 4, minScroll + wrapSize / (_speed * _rate))
            : minScroll;
        _duration = swipeBounceTime;
    } else if (_newPos < maxScroll) {
        _newPos = wrapSize ? Math.max(maxScroll - wrapSize / 4, maxScroll - wrapSize / (_speed * _rate))
            : maxScroll;
        _duration = swipeBounceTime;
    }
    return {
        destination: _newPos,
        duration: _duration
    };
}
