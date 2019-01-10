import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, style } from '../constants';
import getElements from '../utils/getElements';
import hasStyle from '../utils/hasStyle';
import eventUtil from '../utils/eventUtil';
import getEvents from '../utils/getEvents';

export default class ScrollBase extends DefaultOptions {
    defaultOptions = DEFAULT_CONFIG;

    constructor (el, options) {
        super(options);
        const _that = this;
        _that._init(el, options);
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
            console.error('需要纯乳滚动元素');
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
            [window, ['orientationchange', 'resize'], _that._handleEvent.bind(_that), true],
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
        const _type = (event.type || '') + '';
        switch (_type) {
            case 'orientationchange':
            case 'resize':
                _that._resize();
                break;
            case 'mousedown':
            case 'touchstart':
                _that._start();
                break;
            case 'mousemove':
            case 'touchmove':
                _that._move();
                break;
            case 'mouseup':
            case 'mousecancel':
            case 'touchup':
            case 'touchcancel':
                _that._end();
                break;
            case 'transitionend':
                _that._transitionEnd();
        }
    }

    /**
     * 实例化dom节点变化观察器对象
     * @returns {MutationObserver} 节点观察期对象
     */
    _instanceObserver () {
        let _observer = null;

        if (typeof window.MutationObserver !== 'undefined') {
            let _immediateRefresh = false;
            let _defferRefresh = false;
            _observer = new MutationObserver((mutations) => {
                if (!mutations) {
                    return;
                }
                for (let i = 0; i < mutations.length; i++) {
                    const _mutaion = mutations[i];
                    const _type = _mutaion && _mutaion.type;
                    const _target = _mutaion && _mutaion.target;
                    if (_type !== 'attributes') {
                        _immediateRefresh = true;
                        break;
                    } else if (_target !== _that.scroller) {
                        _defferRefresh = true;
                        break;
                    }
                }
            });
            _observer.observe();
        }

        _that._instanceObserver = function () {
            return _observer;
        };
        return _observer;
    }

    /**
     * 初始化dom节点变化观察器
     */
    _initDomObserver () {
        const _that = this;
        if (typeof window.MutationObserver !== 'undefined') {
            const _observer = _that._instanceObserver((mu));
        } else {
            _that._checkDomUpdate();
        }
    }

    /**
     * 初始化数据
     * @param {HTMLElement|String} el dom元素
     * @param {Object} options 可选参数
     */
    _init (el, options) {
        const _that = this;
        if (!_that._getElements(el)) {
            return;
        }
        _that._handleOptions(options);
        _that._initEventListener();
    }
}
