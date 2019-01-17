import ScrollBase from './Scroll.base';
import { DEFAULT_CONFIG, EVENT_TYPE_VALUE, BUTTON_TYPE, EVENT_TYPE, PROBE_TYPE } from '../constants';
import eventUtil from '../utils/eventUtil';
import getNow from '../utils/getNow';
import preventStopEvent from '../utils/preventStopEvent';
import scrollTo from '../helpers/scrollTo';
import filterBounce from '../utils/filterBounce';

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
        const { deltaX: _deltaX, deltaY: _deltaY } = _handleDelta();
        // console.log('_deltaY-->', _deltaY, _that.y);
        const { newX: _newX, newY: _newY } = _handleNewPos(_deltaX, _deltaY);
        // console.log('_newY-->', _newX, _newY);
        if (!_that.moved) {
            _that.$emit(EVENT_TYPE.SCROLL_START, {
                x: _that.x,
                y: _that.y
            });
            _that.moved = true;
        }
        scrollTo(_newX, _newY, _that, _opts);

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
        function _handleDelta () {
            const _point = event.touches ? event.touches[0] : event;
            let deltaY = _point.pageY - _that.pointY;
            let deltaX = _point.pageX - _that.pointX;
            _that.distY += deltaY;
            _that.distX += deltaX;
            const _absDistX = Math.abs(_that.distX);
            const _absDistY = Math.abs(_that.distY);
            if (!_that.directionLocked && !_opts.freeScroll) {
                if (_absDistX - _absDistY > _opts.directionLockThreshold) {
                    _that.directionLocked = 'x';
                } else if (_absDistY - _absDistX >= _opts.directionLockThreshold) {
                    _that.directionLocked = 'y';
                } else {
                    _that.directionLocked = 'n';
                }
            }
            if (_that.directionLocked === 'x') {
                if (_opts.eventPassthrough === 'horizontal') {
                    _that.initiated = false;
                    return;
                } else if (_opts.eventPassthrough === 'vertical') {
                    eventUtil.preventDefault();
                }
                deltaY = 0;
            } else if (_that.directionLocked === 'y') {
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
        function _handleNewPos (deltaX, deltaY) {
            let _newX = _that.x + deltaX;
            let _newY = _that.y + deltaY;
            const {left, right, top, bottom} = filterBounce();
            console.log(_newY, _that.maxScrollY, bottom);
            if (_newX < _that.maxScrollX || _newX > _that.minScrollX ||
                _newY < _that.maxScrollY || _newY > _that.minScrollY) {
                // const {left, right, top, bottom} = filterBounce();
                if (_newX < _that.maxScrollX && right) {
                    _newX = _that.maxScrollX + (_that.maxScrollX - _newX) / 3;
                } else if (_newX > _that.minScrollX && left) {
                    _newX = _that.minScrollX + (_newX - _that.minScrollX) / 3;
                }
                if (_newY < _that.maxScrollY && bottom) {
                    _newY = _that.maxScrollY + (_that.maxScrollY - _newY) / 3;
                } else if (_newY > _that.minScrollY && top) {
                    _newY = _that.minScrollY + (_newY - _that.minScrollY) / 3;
                }
            }
            return {
                newX: _newX,
                newY: _newY
            };
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
    }
}
