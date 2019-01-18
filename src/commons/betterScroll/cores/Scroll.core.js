import ScrollBase from './Scroll.base';
import { DEFAULT_CONFIG, EVENT_TYPE_VALUE,
    BUTTON_TYPE, EVENT_TYPE, PROBE_TYPE,
    MOVING_DIRECTION, LOCKED_DIRECTION,
    ANIMATE_TYPE } from '../constants';
import eventUtil from '../utils/eventUtil';
import getNow from '../utils/getNow';
import preventStopEvent from '../utils/preventStopEvent';
import scrollTo from '../helpers/scrollTo';
import filterBounce from '../utils/filterBounce';
import { ease } from '../utils/ease';
import momentum from '../helpers/momentum';
import { cancelAnimationFrame } from '../utils/raf';

export default class ScrollCore extends ScrollBase {
    defaultOptions = DEFAULT_CONFIG;

    constructor (options) {
        super(options);
        const _that = this;
        _that._handleOptions(options);
    }

    /**
     * 滚动开始前
     * @param {Event} event 滚动事件对象
     * @memberof ScrollCore
     */
    _start (event) {
        const _that = this;
        const _opts = _that.defaultOptions;
        let _evtType = event instanceof MouseEvent ? EVENT_TYPE_VALUE.MOUSE_EVENT : EVENT_TYPE_VALUE.TOUCH_EVENT;
        if (_evtType === EVENT_TYPE_VALUE.MOUSE_EVENT) {
            const _button = eventUtil.getButton(event);
            if (_button !== BUTTON_TYPE.LEFT_MOUSE) {
                return;
            }
        }
        if (!_that.enabled || (_that.initiated && _that.initiated !== _evtType)) {
            return;
        }
        _that.initiated = _evtType;
        preventStopEvent(event, _opts);
        _that.moved = false;
        const _point = event.touches ? event.touches[0] : event;
        _that.pointX = _point.pageX;
        _that.pointY = _point.pageY;
        _that.startX = _that.x;
        _that.startY = _that.y;
        _that.absStartX = _that.x;
        _that.absStartY = _that.y;
        _that.distX = 0;
        _that.distY = 0;
        _that.directionLocked = 0;
        _that.startTime = getNow();
        _that.directionX = 0;
        _that.directionY = 0;

        _that.$emit(EVENT_TYPE.BEFORE_SCROLL_START, {
            x: _that.x,
            y: _that.y
        });
    }

    /**
     * 滚动滚动条
     * @param {Event} event 滚动事件对象
     * @memberof ScrollCore
     */
    _move (event) {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _evtType = (event instanceof MouseEvent) ? EVENT_TYPE_VALUE.MOUSE_EVENT : EVENT_TYPE_VALUE.TOUCH_EVENT;
        if (!_that.enabled || _that.initiated !== _evtType) {
            return;
        }
        preventStopEvent(event, _opts);

        const _timestamp = getNow();
        const { deltaX: _deltaX, deltaY: _deltaY } = _getDelta();
        const { newX: _newX, newY: _newY } = _getNewPos(_deltaX, _deltaY);

        if (!_that.moved) {
            _that.$emit(EVENT_TYPE.SCROLL_START, {
                x: _that.x,
                y: _that.y
            });
            _that.moved = true;
        }
        scrollTo(_newX, _newY, 0, ease.bounce, _that, _opts);

        if (_timestamp - _that.startTime > _opts.momentumLimitTime) {
            _that.startTime = _timestamp;
            _that.startX = _that.x;
            _that.startY = _that.y;
            if (_opts.probeType === PROBE_TYPE.NORMAL) {
                _that.$emit(EVENT_TYPE.SCROLL, {
                    x: _that.x,
                    y: _that.y
                });
            }
        }

        /**
         * 过滤delta属性
         * @returns {Object} 返回过滤好的delta属性
         */
        function _getDelta () {
            const _point = event.touches ? event.touches[0] : event;
            let deltaY = _point.pageY - _that.pointY;
            let deltaX = _point.pageX - _that.pointX;
            _that.distY += deltaY;
            _that.distX += deltaX;
            _that.pointX = _point.pageX;
            _that.pointY = _point.pageY;
            const _absDistX = Math.abs(_that.distX);
            const _absDistY = Math.abs(_that.distY);
            if (!_that.directionLocked && !_opts.freeScroll) {
                if (_absDistX - _absDistY > _opts.directionLockThreshold) {
                    _that.directionLocked = LOCKED_DIRECTION.HORIZONTAL;
                } else if (_absDistY - _absDistX >= _opts.directionLockThreshold) {
                    _that.directionLocked = LOCKED_DIRECTION.VERTICAL;
                } else {
                    _that.directionLocked = LOCKED_DIRECTION.NO;
                }
            }
            if (_that.directionLocked === LOCKED_DIRECTION.HORIZONTAL) {
                if (_opts.eventPassthrough === 'horizontal') {
                    _that.initiated = false;
                    return;
                } else if (_opts.eventPassthrough === 'vertical') {
                    eventUtil.preventDefault();
                }
                deltaY = 0;
            } else if (_that.directionLocked === LOCKED_DIRECTION.VERTICAL) {
                if (_opts.eventPassthrough === 'vertical') {
                    _that.initiated = false;
                    return;
                } else if (_that.eventPassthrough === 'horizontal') {
                    eventUtil.preventDefault();
                }
                deltaX = 0;
            }
            deltaX = _that.hasScrollX ? deltaX : 0;
            deltaY = _that.hasScrollY ? deltaY : 0;
            return {
                deltaX,
                deltaY
            };
        }

        /**
         * 过滤新的位置
         * @param {Number} deltaX 水平方向移动的距离
         * @param {Number} deltaY 垂直方向移动的距离
         * @returns {Object} 返回新的位置
         */
        function _getNewPos (deltaX, deltaY) {
            let _newX = _that.x + deltaX;
            let _newY = _that.y + deltaY;
            const {left, right, top, bottom} = filterBounce(_opts.bounce);
            _newX = _filterNewPos(_newX, _that.x, _that.minScrollX, _that.maxScrollX, {
                bounceMin: left,
                bounceMax: right
            }, deltaX);
            _newY = _filterNewPos(_newY, _that.y, _that.minScrollY, _that.maxScrollY, {
                bounceMin: top,
                bounceMax: bottom
            }, deltaY);
            return {
                newX: _newX,
                newY: _newY
            };

            /**
             * 过滤滚动条的位置
             * @param {Number} pos 目标过滤的位置
             * @param {Number} lastPos 最后一次的滚动条的位置
             * @param {Number} minScroll 最小可以滚动的距离
             * @param {Number} maxScroll 最大可以滚动的距离
             * @param {Boolean} bounce 滚动超过滚动距离的一边是否支持回弹动画
             * @param {Number} delta 滑动的距离
             * @returns {Number} 返回过滤后的位置
             */
            function _filterNewPos (pos, lastPos, minScroll, maxScroll, bounce, delta) {
                /**
                 * bounceMin 滚动超过最小的滚动距离的一边是否支持回弹动画
                 * bounceMax 滚动超过最大的滚动距离的一边是否支持回弹动画
                 */
                const { bounceMin, bounceMax } = bounce;
                if (pos > minScroll || pos < maxScroll) {
                    if ((pos > minScroll && bounceMin) ||
                        (pos < maxScroll && bounceMax)) {
                        pos = lastPos + delta / 3;
                    } else {
                        pos = pos > minScroll ? minScroll : maxScroll;
                    }
                }
                return pos;
            }
        }
    }

    /**
     * 滑动结束
     * @param {Event} event 事件对象
     * @memberof ScrollCore
     */
    _end (event) {
        if (!event) {
            return;
        }
        const _that = this;
        const _opts = _that.defaultOptions;
        const _evtType = (event instanceof MouseEvent) ? EVENT_TYPE_VALUE.MOUSE_EVENT : EVENT_TYPE_VALUE.TOUCH_EVENT;
        if (!_that.enabled || _that.initiated !== _evtType) {
            return;
        }
        _that.initiated = false;
        preventStopEvent(event, _opts);

        _that.$emit(EVENT_TYPE.TOUCH_END, {
            x: _that.x,
            y: _that.y
        });

        if (_that._resetPosition()) {
            return;
        }

        _that.endTime = getNow();
        let _newX = _that.x;
        let _newY = _that.y;
        let _duration = 0;
        const _distX = _that.x - _that.absStartX;
        const _distY = _that.y - _that.absStartY;
        _that.directionX = _distX < 0 ? MOVING_DIRECTION.LEFT : MOVING_DIRECTION.RIGHT;
        _that.directionY = _distY < 0 ? MOVING_DIRECTION.TOP : MOVING_DIRECTION.BOTTOM;
        const _absDistX = Math.abs(_distX);
        const _absDistY = Math.abs(_distY);
        if (_that.endTime - _that.startTime < _opts.momentumLimitTime &&
            (_absDistX > _opts.momentumLimitDistance || _absDistY > _opts.momentumLimitDistance)) { // 开启动量
            const { left, right, top, bottom } = filterBounce(_opts.bounce);
            let _wrapSizeX = 0;
            let _wrapSizeY = 0;
            const _time = _that.endTime - _that.startTime;
            if ((_that.directionX === MOVING_DIRECTION.LEFT && right) ||
                (_that.directionX === MOVING_DIRECTION.RIGHT && left)) {
                _wrapSizeX = _that.wrapperWidth;
            }
            if ((_that.directionY === MOVING_DIRECTION.TOP && bottom) ||
                (_that.directionY === MOVING_DIRECTION.BOTTOM && top)) {
                _wrapSizeY = _that.wrapperHeight;
            }
            const _momentumX = _that.hasScrollX
                ? momentum(_that.startX, _that.x, _time, _wrapSizeX, _that.minScrollX, _that.maxScrollX, _opts)
                : { destination: _that.x, duration: 0 };
            const _momentumY = _that.hasScrollY
                ? momentum(_that.startY, _that.y, _time, _wrapSizeY, _that.minScrollY, _that.maxScrollY, _opts)
                : { destination: _that.y, duration: 0 };
            _duration = Math.max(_momentumX.duration, _momentumY.duration);
            _newX = _momentumX.destination;
            _newY = _momentumY.destination;
        }
        scrollTo(_newX, _newY, _duration, ease.swipe, _that, _opts);
    }

    /**
     * 使用transition开启动画方式动画结束的回调
     * @param {Event} event 事件对象
     */
    _transitionEnd (event) {
        const _that = this;
        const _type = (event && event.type) || ANIMATE_TYPE.TRANSITION;

        if (_type === ANIMATE_TYPE.ANIMATION) { // 通过requestAnimation开启的动画
            _that.isAnimating = false;
            cancelAnimationFrame(_that.animateAnimation);
        } else { // 通过css3的transition开启的动画
            _that.isInTransition = false;
        }
        _that._resetPosition();
    }
}
