import ScrollBase from './Scroll.base';
import { DEFAULT_CONFIG, TOUCH_EVENT, MOUSE_EVENT, DIRECTION } from '../constants';

/**
 * 核心的滚动条事件逻辑的处理模块
 *
 * @export
 * @class ScrollCore
 * @extends {ScrollBase}
 */
export default class ScrollCore extends ScrollBase {
    /**
     * 默认配置参数
     *
     * @memberof ScrollCore
     */
    defaultOptions = DEFAULT_CONFIG;

    /**
     * 初始化事件类型
     *
     * @memberof ScrollCore
     */
    initialEvt = null;

    /**
     * 记录滚动的位置
     *
     * @memberof ScrollCore
     */
    pos = null;

    /**
     * 滚动条的水平位置
     *
     * @memberof ScrollCore
     */
    x = 0;

    /**
     * 滚动条的垂直位置
     *
     * @memberof ScrollCore
     */
    y = 0;

    /**
     * 记录水平滚动的距离
     *
     * @memberof ScrollCore
     */
    distX = 0;
    /**
     * 记录垂直滚动的距离
     *
     * @memberof ScrollCore
     */
    distY = 0;

    /**
     * 滚动方向
     *
     * @memberof ScrollCore
     */
    lockDirection = DIRECTION.V;

    constructor (el, options) {
        super(el, options);

        const _that = this;
        _that.setDefaultOptions(options);
    }

    /**
     * mousedown/touchstart 回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _start (evt) {
        console.log('start', evt, evt instanceof TouchEvent);
        const _that = this;
        const _opts = _that.defaultOptions;

        let _eventType = ((evt instanceof TouchEvent) && TOUCH_EVENT) || MOUSE_EVENT;
        if (_eventType === MOUSE_EVENT) {
            if (evt.button !== 0) {
                return;
            }
        }

        if (!_opts.enabled || (_that.initialEvt && _that.initialEvt !== _eventType)) {
            return;
        }
        _that.initialEvt = _eventType;

        _that.pos = ((evt.touches) && evt.touches[0]) || evt;
        _that.x = 0;
        _that.y = 0;
        _that.distX = 0;
        _that.distY = 0;
        if (_opts.getTime instanceof Function) {
            _that.startTime = _opts.getTime();
        } else {
            _that.startTime = Date.now();
        }
    }

    /**
     * mousemove/touchmove 回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _move (evt) {
        console.log('_move');
        const _that = this;
        const _opts = _that.defaultOptions;
        if (!_opts.enabled ||
            (!_opts.freeScroll &&!_opts.scrollX && !_opts.scrollY) ||
            !_that.initialEvt) {
            return;
        }
        let pos = ((evt.touches) && evt.touches[0]) || evt;
        let deltaX = pos.pageX - _that.pos.pageX;
        let deltaY = pos.pageY - _that.pos.pageY;
        _that.pos = pos;

        let _distX = (_that.distX += deltaX);
        let _distY = (_that.distY += deltaY);
        let _nowTime = null;
        if (_opts.getTime instanceof Function) {
            _nowTime = _opts.getTime();
        } else {
            _nowTime = Date.now();
        }
        if (_distX > _opts.momentumLimitDistance && (_nowTime - _that.startTime) < _opts.directionLockThreshold) {
            if (_distX - _distY > _opts.directionLockThreshold) {
                _that.lockDirection = DIRECTION.H;
                deltaY = 0;
            } else {
                _that.lockDirection = DIRECTION.V;
                deltaX = 0;
            }
            // if (_opts.eventPassthrough) {
            //     if (_that.lockDirection)
            // }
            _that.x = _that.x + deltaX;
            _that.y = _that.y + deltaY;
            _that._scrollTo();
        }
    }

    /**
     * mouseup/touchend 回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _end (evt) {
        const _that = this;
        console.log('_end');
        _that.moveable = false;
    }

    _scrollTo () {
        const _that = this;
        const _scroller = _that.scroller;
        console.log(_scroller, _that.x, _that.y);
        _scroller.style.transform = `translate3d(${_that.x}px, ${_that.y}px, 0)`;
    }
}
