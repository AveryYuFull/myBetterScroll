import setStyle from '../utils/setStyle';
import { style, PROBE_TYPE } from '../constants';
import getNow from '../utils/getNow';
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/raf';
import getScrollPos from '../utils/getScrollPos';
import { ease } from '../utils/ease';

// 滚动条实例对象
let _bScroll = null;
// 可选参数
let _opts = null;

/**
 * 滚动到指定位置
 * @param {Number} x 水平滑动的距离
 * @param {Number} y 垂直滑动的距离
 * @param {Scroll} bScroll BScroll 对象
 * @param {Object} options 可选参数
 * @param {Number} time 动画时间
 * @param {*} easing 动画方法
 */
export default function scrollTo (x, y, bScroll, options, time, easing = ease.bounce) {
    console.log('scrollTo-->', x, y, bScroll, options, time, easing);
    if (!bScroll) {
        return;
    }
    const _that = bScroll;
    _bScroll = bScroll;
    _opts = options;
    const _isInTransition = time && _opts.useTransition;
    if (!time || _isInTransition) {
        _that.isInTransition = _isInTransition;
        _setTransition(time, easing);
        _translate(x, y);
        if (time && _opts.probeType === PROBE_TYPE.REAL_MOMENTUM_TIME) {
            _startProbe();
        } else if (_opts.probeType === PROBE_TYPE.REAL_TIME) {
            _that.$emit(EVENT_TYPE.SCROLL, {
                x: _that.x,
                y: _that.y
            });
        }
    } else {
        _animate(x, y, time, easing.fn);
    }
}

/**
 * 实时且在momentum动画过程中发送scroll事件
 */
function _startProbe () {
    const _that = _bScroll;
    /**
     * 动态的派发scroll事件
     */
    function _startProbe () {
        const _pos = getScrollPos(_that.scroller, _opts.useTransform);
        _that.$emit(EVENT_TYPE.SCROLL, _pos);
        if (!bScroll.isInTransition) {
            _that.$emit(EVENT_TYPE.SCROLL_END, _pos);
        } else {
            _that.probeAnimation = requestAnimationFrame(_startProbe);
        }
    }
    if (_that.isInTransition) {
        _that.probeAnimation = requestAnimationFrame(_startProbe);
    }
}

/**
 * 设置transition属性
 * @param {Number} time 动画时间
 * @param {*} easing 动画方法
 */
function _setTransition (time, easing) {
    const _that = _bScroll;
    _that.setTransitionTime(time);
    _that.setTransitionTimingFunction(easing.style);
}

/**
 * 滑动滚动条
 * @param {Number} x 水平滑动的距离
 * @param {Number} y 垂直滑动的距离
 */
function _translate (x, y) {
    const _that = _bScroll;
    if (_opts.useTransform) {
        const _hwCompositing = (_opts.HWCompositing && 'translateZ(0)') || '';
        setStyle(_that.scroller, style.transform, `translate(${x}px, ${y}px) ${_hwCompositing}`);
    } else {
        setStyle(_that.scroller, 'left', `${x}px`);
        setStyle(_that.scroller, 'top', `${y}px`);
    }
    _that.x = x;
    _that.y = y;
}

/**
 * 使用requestAnimationFrame进行动画
 * @param {Number} x 水平移动的位置
 * @param {Number} y 垂直移动的位置
 * @param {Number} duration 动画的时长
 * @param {*} easing 动画曲线函数
 */
function _animate (x, y, duration, easing) {
    const _that = _bScroll;
    const _startTime = getNow();
    const _endTime = _startTime + duration;
    const _distanceX = x - _that.x;
    const _distanceY = y - _that.y;
    _that.isAnimating = true;

    /**
     * 开始动画
     * @param {Number} nowTime 当前的动画时间
     */
    function _startAnimate () {
        let _nowTime = getNow();
        if (nowTime >= _endTime) {
            _that.isAnimating = false;
            _translate(x, y);
            _that.$emit(EVENT_TYPE.SCROLL, {
                x: _that.x,
                y: _that.y
            });
            if (!_that.isAnimating) {
                _that.$emit(EVENT_TYPE.SCROLL_END, {
                    x: _that.x,
                    y: _that.y
                });
            }
            return;
        }
        _nowTime = (_nowTime - _startTime) / duration;
        const _newX = easing(_nowTime) * _distanceX + _that.x;
        const _newY = easing(_nowTime) * _distanceY + _that.y;
        _translate(_newX, _newY);
        if (_that.isAnimating) {
            _that.animateAnimation = requestAnimationFrame(_startAnimate);
        }
    }
    if (_that.isAnimating) {
        _that.animateAnimation = requestAnimationFrame(_startAnimate);
    }
}
