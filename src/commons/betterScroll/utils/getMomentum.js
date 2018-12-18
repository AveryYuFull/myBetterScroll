/**
 * 根据滑动的时间和距离算出动量
 * @param {Number} currPos 当前位置
 * @param {Number} lastPos 最后滑动距离
 * @param {Number} duration 时间
 * @param {Number} lowerRange 最小范围
 * @param {Number} highRange 最大范围
 * @param {Number} wrapSize 包裹元素的宽度／高度
 * @param {Object} opts 可选参数
 * @returns {Object} 返回算出的动量和动画时间
 * @exports
 */
export default function getMomentum (currPos, lastPos, duration, lowerRange, highRange, wrapSize, opts) {
    const _deltaDistance = currPos - lastPos;
    const _speed = Math.abs(_deltaDistance) / duration;
    const { deceleration, swipeTime, swipeBounceTime } = opts;
    let _time = swipeTime;
    let _scale = 15;
    let _destPos = (_speed / deceleration) * (_deltaDistance > 0 ? 1 : -1) + currPos;

    if (_destPos < lowerRange) {
        _destPos = wrapSize ? (lowerRange - wrapSize / (_speed * _scale)) : lowerRange;
        _time = swipeBounceTime;
    } else if (_destPos > highRange) {
        _destPos = wrapSize ? (highRange + wrapSize / (_speed * _scale)) : highRange;
        _time = swipeBounceTime;
    }
    return {
        duration: _destPos,
        time: _time
    };
}
