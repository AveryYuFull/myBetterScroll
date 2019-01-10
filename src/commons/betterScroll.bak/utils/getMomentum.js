/**
 * 根据滑动的时间和距离算出动量
 * @param {Number} currPos 当前位置
 * @param {Number} lastPos 最后滑动距离
 * @param {Number} time 时间
 * @param {Number} lowerMargin 最小范围
 * @param {Number} upperMargin 最大范围
 * @param {Number} wrapSize 包裹元素的宽度／高度
 * @param {Object} opts 可选参数
 * @returns {Object} 返回算出的动量和动画时间
 * @exports
 */
export default function getMomentum (currPos, lastPos, time, lowerMargin, upperMargin, wrapSize, opts) {
    const _distance = currPos - lastPos;
    const _speed = Math.abs(_distance) / time;
    const { deceleration, swipeTime, swipeBounceTime } = opts;
    let _duration = swipeTime;
    let _rate = 15;
    let _destPos = (_speed / deceleration) * (_distance > 0 ? 1 : -1) + currPos;

    if (_destPos < lowerMargin) {
        _destPos = wrapSize ? Math.max(lowerMargin - (wrapSize / 4), lowerMargin - (wrapSize / (_speed * _rate))) : lowerMargin;
        _duration = swipeBounceTime;
    } else if (_destPos > upperMargin) {
        _destPos = wrapSize ? Math.max(upperMargin + (wrapSize / 4), upperMargin + (wrapSize / (_speed * _rate))) : upperMargin;
        _duration = swipeBounceTime;
    }
    return {
        destination: _destPos,
        duration: _duration
    };
}
