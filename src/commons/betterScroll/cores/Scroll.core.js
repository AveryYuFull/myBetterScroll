import ScrollBase from './Scroll.base';
import { DEFAULT_CONFIG, EVENT_TYPE_VALUE, BUTTON_TYPE, EVENT_TYPE } from '../constants';
import eventUtil from '../utils/eventUtil';
import getNow from '../utils/getNow';
import preventStopEvent from '../utils/preventStopEvent';

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

        const _point = event.touches ? event.touches[0] : event;
        let _deltaY = _point.pageY - _that.pointY;
        let _deltaX = _point.pageX - _that.pointX;
        _that.distY += _deltaY;
        _that.distX += _deltaX;
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
            } else if (_that.eventPassthrough === 'vertical') {
                eventUtil.preventDefault();
            }
            _deltaY = 0;
        } else if (_that.directionLocked === 'y') {
            if (_opts.eventPassthrough === 'vertical') {
                _that.initiated = false;
                return;
            } else if (_that.eventPassthrough === 'horizontal') {
                eventUtil.preventDefault();
            }
            _deltaX = 0;
        }
        _deltaX = _that.hasScrollX ? _deltaX : 0;
        _deltaY = _that.hasScrollY ? _deltaY : 0;

        let _newX = _that.x + _deltaX;
        let _newY = _that.y + _deltaY;
        if (_newX < _that.maxScrollX || _newX > _that.minScrollX ||
            _newY < _that.maxScrollY || _newY > _that.minScrollY) {
            const bounce = _opts.bounce;
            let left = false;
            let right = false;
            let top = false;
            let bottom = false;
            if (bounce) {
                left = typeof bounce.left === 'undefined' ? true : bounce.left;
                right = typeof bounce.right === 'undefined' ? true : bounce.right;
                top = typeof bounce.top === 'undefined' ? true : bounce.top;
                bottom = typeof bounce.bottom === 'undefined' ? true : bounce.bottom;
            }
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
    }
}
