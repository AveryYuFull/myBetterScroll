import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, style, EVENT_TYPE, OBJECT_TYPE } from '../constants';
import getElements from '../utils/getElements';
import hasStyle from '../utils/hasStyle';
import eventUtil from '../utils/eventUtil';
import getEvents from '../utils/getEvents';
import getRect from '../utils/getRect';
import getStyle from '../utils/getStyle';
import domObserverFactory from './domObserver/DomObserver';
import setStyle from '../utils/setStyle';

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
     * 设置滚动条的动画时长
     * @param {number} [time=0] 动画时长
     * @memberof ScrollBase
     */
    setTransitionTime (time = 0) {
        const _that = this;
        setStyle(_that.scroller, style.transitionDuration, `${time}ms`);
    }

    /**
     * 设置动画动画函数
     * @param {*} easing 动画规则
     * @memberof ScrollBase
     */
    setTransitionTimingFunction (easing) {
        const _that = this;
        setStyle(_that.scroller, style.transitionTimingFunction, easing);
    }

    /**
     * 初始化dom监听器
     */
    _initDomObserver () {
        const _that = this;
        const _opts = _that.defaultOptions;
        let observerOpts = null;
        if (window && typeof window.MutationObserver !== 'undefined') {
            observerOpts = {
                type: OBJECT_TYPE.MU_OBSERVER_PATTERN,
                cb: _that._refresh.bind(_that)
            };
        } else {
            observerOpts = {
                type: OBJECT_TYPE.DOM_UPDATE_PATTERN,
                observeCb: _that._refresh.bind(_that),
                domUpdateInterval: _opts.domUpdateInterval
            };
        }
        _that.domObserver = domObserverFactory(observerOpts);
        _that.domObserver.observe(_that.scroller, {
            muObserverOptions: _opts.muObserverOptions,
            width: _that.scrollerWidth,
            height: _that.scrollerHeight
        });
    }
}
