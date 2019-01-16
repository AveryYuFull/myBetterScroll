/* eslint-disable max-lines */
import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, style, EVENT_TYPE, PROBE_TYPE } from '../constants';
import getElements from '../utils/getElements';
import hasStyle from '../utils/hasStyle';
import eventUtil from '../utils/eventUtil';
import getEvents from '../utils/getEvents';
import getRect from '../utils/getRect';
import getStyle from '../utils/getStyle';
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/raf';
import getScrollPos from '../utils/getScrollPos';
import getNow from '../utils/getNow';
import filterBounce from '../utils/filterBounce';

export default class ScrollBase extends DefaultOptions {
    defaultOptions = DEFAULT_CONFIG;

    constructor (options) {
        super(options);
        const _that = this;
        _that._handleOptions(options);
    }

    /**
     * 获取元素
     * @param {HTMLElement|String} el dom元素标识
     * @return {Boolean} 获取元素成功／失败
     */
    _getElements (el) {
        const _that = this;
        _that.wrapper = getElements(el)[0];
        if (!_that.wrapper) {
            console.error('需要传入包裹元素');
            return false;
        }

        _that.scroller = _that.wrapper && _that.wrapper.children[0];
        if (!_that.scroller) {
            console.error('需要传入滚动元素');
            return false;
        }

        return true;
    }

    /**
     * 处理options
     * @param {Object} options options参数
     */
    _handleOptions (options) {
        const _that = this;
        if (options) {
            // 是否开启硬件加速
            options.HWCompositing = options.HWCompositing && hasStyle('perspective');
            // 是否使用transform移动位置
            options.useTransform = options.useTransform && hasStyle('transform');
            // 是否使用transition动画
            options.useTransition = options.useTransition && hasStyle('transition');
            options.scrollX = options.scrollX && options.eventPassthrough !== 'horizontal';
            options.scrollY = options.scrollY && options.eventPassthrough !== 'vertical';
            options.freeScroll = options.freeScroll && !options.eventPassthrough;
            options.directionLockThreshold = options.eventPassthrough ? 0 : options.directionLockThreshold;
        }
        _that.setDefaultOptions(options);
    }

    /**
     * 设置动画监听变量
     */
    _watchTransition () {
        const _that = this;
        if (!(Object.defineProperty instanceof Function)) {
            return;
        }

        let _isInTransition = false;
        const _opts = _that.defaultOptions;
        const _key = _opts && _opts.useTransition ? 'isInTransition' : 'isAnimating';
        Object.defineProperty(_that, _key, {
            get () {
                return _isInTransition;
            },
            set (newVal) {
                _isInTransition = newVal;
                const _elems = _that.scroller.children ? _that.scroller.children : [_that.scroller];
                /**
                 * 当设置元素pointerEvents为none时，元素将永远不会成为鼠标事件的target
                 * 所以当滚动条在滚动中，滚动中的元素不应该成为鼠标事件的target
                 */
                const _pointerEvents = _isInTransition ? 'none' : 'auto';
                if (_elems && _elems instanceof Array) {
                    for (let i = 0; i < _elems.length; i++) {
                        const _el = _elems[i];
                        _el.style.pointerEvents = _pointerEvents;
                    }
                }
            }
        });
    }

    /**
     * 注册事件监听器
     */
    _initEventListener () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _pointerEvents = getEvents();
        const _target = _opts.bindToWrapper ? _that.scroller : window;

        let _args = [
            [window, _opts.listenerEvents, _that._handleEvent.bind(_that), true],
            [_that.scroller, _pointerEvents[0], _that._handleEvent.bind(_that), true],
            [_target, _pointerEvents.slice(0), _that._handleEvent.bind(_that), true],
            [_that.scroller, style.transitionEnd, _that._handleEvent.bind(_that), true]
        ];
        _args.forEach(item => {
            if (item) {
                eventUtil.initEventListener.apply(null, item);
            }
        });
    };

    /**
     * 事件处理程序
     * @param {Event} event 事件对象
     */
    _handleEvent (event) {
        if (!event) {
            return;
        }
        const _that = this;
        const _type = (event.type || '') + '';
        switch (_type) {
            case 'orientationchange':
            case 'resize':
                _that._resize(event);
                break;
            case 'mousedown':
            case 'touchstart':
                _that._start(event);
                break;
            case 'mousemove':
            case 'touchmove':
                _that._move(event);
                break;
            case 'mouseup':
            case 'mousecancel':
            case 'touchup':
            case 'touchcancel':
                _that._end(event);
                break;
            case 'transitionend':
                _that._transitionEnd(event);
        }
    }

    /**
     * 重新计算scroller元素相关属性
     */
    _refresh () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _isStatic = getStyle(_that.wrapper, 'position') === 'static';
        const _wrapperRect = getRect(_that.wrapper);
        const _scrollerRect = getRect(_that.scroller);
        _that.scrollerHeight = _scrollerRect.height;
        _that.scrollerWidth = _scrollerRect.width;
        _that.wrapperWidth = _wrapperRect.width;
        _that.wrapperHeight = _wrapperRect.height;
        let _relativeX = 0;
        let _relativeY = 0;
        if (_isStatic) {
            _relativeY = _scrollerRect.top - _wrapperRect.top;
            _relativeX = _scrollerRect.left - _wrapperRect.left;
        }

        _init(_that.wrapperHeight, _that.scrollerHeight, _relativeY, _opts.scrollY, 'Y');
        _init(_that.wrapperWidth, _that.scrollerWidth, _relativeX, _opts.scrollX, 'X');

        _that.$emit(EVENT_TYPE.REFRESH);

        /**
         * 计算出ScrollX和ScrollY
         * @param {Number} wrapperSize wrapper元素的高度/宽度
         * @param {Number} scrollerSize 滚动元素的高度/宽度
         * @param {Number} relativePos 滚动元素相对wrapper元素的距离
         * @param {Boolean} scrollEnable 横向/纵向是否可以滚动
         * @param {String} dir 滚动方向（横向/纵向）
         */
        function _init (wrapperSize, scrollerSize, relativePos, scrollEnable, dir = 'X') {
            let maxScroll = wrapperSize - scrollerSize;
            let minScroll = 0;
            if (relativePos) {
                maxScroll -= relativePos;
                minScroll = -relativePos;
            }
            let hasScroll = scrollEnable && (maxScroll < minScroll);
            if (!hasScroll) {
                maxScroll = minScroll;
                scrollerSize = wrapperSize;
            }
            _that['maxScroll' + dir] = maxScroll;
            _that['minScroll' + dir] = minScroll;
            _that['hasScroll' + dir] = hasScroll;
            if (dir === 'X') {
                _that.scrollerWidth = _that.wrapperWidth;
            } else {
                _that.scrollerHeight = _that.wrapperHeight;
            }
        }
    }

    /**
     * 当滚动条处于滚动状态，就应该让页面中的处于focus的元素blur
     * @memberof ScrollBase
     */
    _handleAutoBlur () {
        const _that = this;
        _that.$on(EVENT_TYPE.SCROLL_START, () => {
            const _activeElement = document.activeElement;
            if (_activeElement && (_activeElement.tagName === 'INPUT' || _activeElement.tagName === 'TEXTAREA')) {
                if (_activeElement.blur instanceof Function) {
                    _activeElement.blur();
                }
            }
        });
    }

    /**
     * 为滚动条设置样式
     * @param {String} prop 属性名
     * @param {String} val 属性值
     * @memberof ScrollBase
     */
    _setScrollerStyle (prop, val) {
        const _that = this;
        if (!prop || !val) {
            return;
        }
        const _scrollerStyle = _that.scroller && _that.scroller.style;
        _scrollerStyle && (_scrollerStyle[prop] = val);
    }

    /**
     * 实时且在momentum动画过程中发送scroll事件
     * @memberof ScrollBase
     */
    _startProbe () {
        const _that = this;
        const _opts = _that.defaultOptions;

        /**
         * 动态的派发scroll事件
         */
        function _startProbe () {
            const _pos = getScrollPos(_that.scroller, _opts.useTransform);
            _that.$emit(EVENT_TYPE.SCROLL, _pos);
            if (!_that.isInTransition) {
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
     * 使用requestAnimationFrame进行动画
     * @param {Number} x 水平移动的位置
     * @param {Number} y 垂直移动的位置
     * @param {Number} duration 动画的时长
     * @param {*} easing 动画曲线函数
     */
    _animate (x, y, duration, easing) {
        const _that = this;
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
                _that._translate(x, y);
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
            _that._translate(_newX, _newY);
            if (_that.isAnimating) {
                _that.animateAnimation = requestAnimationFrame(_startAnimate);
            }
        }
        if (_that.isAnimating) {
            _that.animateAnimation = requestAnimationFrame(_startAnimate);
        }
    }

    /**
     * 滚动到指定位置
     * @param {Number} x 水平滑动的距离
     * @param {Number} y 垂直滑动的距离
     * @param {Number} time 动画时间
     * @param {*} easing 动画方法
     * @memberof ScrollBase
     */
    _scrollTo (x, y, time, easing) {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (x === _that && y === _that.y) {
            return;
        }
        const _isInTransition = time && _opts.useTransition;
        if (!time || _isInTransition) {
            _that.isInTransition = _isInTransition;
            _that._setTransitionTime(time);
            _that._setTransitionTimingFunction(easing.style);
            _that._translate(x, y);
            if (time && _opts.probeType === PROBE_TYPE.REAL_MOMENTUM_TIME) {
                _that._startProbe();
            } else if (_opts.probeType === PROBE_TYPE.REAL_TIME) {
                _that.$emit(EVENT_TYPE.SCROLL, {
                    x: _that.x,
                    y: _that.y
                });
            }
        } else {
            _that._animate(x, y, time, easing.fn);
        }
    }

    /**
     * 设置滚动条的动画时长
     * @param {number} [time=0] 动画时长
     * @memberof ScrollBase
     */
    _setTransitionTime (time = 0) {
        const _that = this;
        _that._setScrollerStyle(style.transitionDuration, `${time}ms`);
    }

    /**
     * 设置动画动画函数
     * @param {*} easing 动画规则
     * @memberof ScrollBase
     */
    _setTransitionTimingFunction (easing) {
        const _that = this;
        _that._setScrollerStyle(style.transitionTimingFunction, easing);
    }

    /**
     * 滑动滚动条
     * @param {Number} x 水平滑动的距离
     * @param {Number} y 垂直滑动的距离
     * @memberof ScrollBase
     */
    _translate (x, y) {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (_opts.useTransform) {
            const _hwCompositing = (_opts.HWCompositing && 'translateZ(0)') || '';
            _that._setScrollerStyle(style.transform, `translate(${x}px, ${y}px) ${_hwCompositing}`);
        } else {
            _that._setScrollerStyle('left', `${x}px`);
            _that._setScrollerStyle('top', `${y}px`);
        }
        _that.x = x;
        _that.y = y;
    }
}
