import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, EVENT_TYPE,
    style } from '../constants';

export default class ScrollBase extends DefaultOptions {
    /**
     * 默认配置参数
     *
     * @memberof ScrollInit
     */
    defaultOptions = DEFAULT_CONFIG;

    /**
     * 包裹元素
     *
     * @memberof ScrollInit
     */
    wrapper = null;

    /**
     * 滚动元素
     *
     * @memberof ScrollInit
     */
    scroller = null;

    constructor (el, options) {
        super(el, options);

        const _that = this;
        _that.setDefaultOptions(options);

        _that._init(el);
    }

    /**
     * 注册事件
     */
    _handleDomEvent () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _target = ((_opts && _opts.bindToWrapper) && _that.wrapper) || window;
        const _initEventListener = _opts.initEventListener;

        let _evtType = _opts.getEventType();
        if (_evtType) { // 注册mousedown/mousemove/mouseup事件
            _initEventListener(_that.wrapper, _evtType['event_start'], this, true);
            _initEventListener(_target, [_evtType['event_move'], _evtType['event_end']], this, true);
        }

        _initEventListener(_that.scroller, style.transitionEnd, this);
    }

    /**
     * 获取元素dom节点
     *
     * @param {String|HTMLElement} el 元素选择器/dom节点对象
     * @returns {Boolean} 获取元素是否成功
     * @memberof ScrollBase
     */
    _querySelector (el) {
        if (!el) {
            console.error('element is required');
            return false;
        }
        const _that = this;
        let _wrapper = el;
        let _scroller = null;
        if (typeof el === 'string') {
            _wrapper = document.querySelector(el);
        }
        _scroller = _wrapper && _wrapper.children[0];
        if (!_scroller) {
            console.error('scroll element is required');
            return false;
        }

        _that.wrapper = _wrapper;
        _that.scroller = _scroller;
        return true;
    }

    /**
     * 管理动画状态
     * @private
     */
    _watchTransition () {
        if (typeof Object.defineProperty === 'undefined') {
            return;
        }
        const _that = this;
        let _isInTransition = false;
        const _opts = _that.defaultOptions;
        const _key = _opts.useTransition ? 'isInTransition' : 'isAnimating';
        Object.defineProperty(_that, _key, {
            get () {
                return _isInTransition;
            },
            set (val) {
                _isInTransition = val;
            }
        });
    }

    /**
     * 页面重新刷新数据
     *
     * @memberof ScrollBase
     */
    _refresh () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _wrapper = _that.wrapper;
        const _scroller = _that.scroller;

        let _style = _opts.getStyle(_wrapper, 'position');
        let _isWrapperStatic = _style ? _style === 'static' : true;

        let _wrapRect = _opts.getRect(_wrapper);
        _that.wrapW =_wrapRect.width;
        _that.wrapH = _wrapRect.height;

        let _scrollRect = _opts.getRect(_scroller);
        _that.scrollW = _scrollRect.width;
        _that.scrollH = _scrollRect.height;

        // 获取reletiveX、reletiveY
        let _reletiveX = _scrollRect.left;
        let _reletiveY = _scrollRect.top;
        if (_isWrapperStatic) {
            _reletiveX -= _wrapper.left;
            _reletiveY -= _wrapper.top;
        }

        _that.maxScrollX = _that.wrapW - _that.scrollW;
        _that.maxScrollY = _that.wrapH - _that.scrollH;
        _that.minScrollX = 0;
        _that.minScrollY = 0;
        if (_that.maxScrollX < 0) {
            _that.maxScrollX -= _reletiveX;
            _that.minScrollX = -_reletiveX;
        }
        if (_that.maxScrollY < 0) {
            _that.maxScrollY -= _reletiveY;
            _that.minScrollY = -_reletiveY;
        }

        let _hasVScroll = _that.hasVScroll = _opts.scrollY && (_that.maxScrollY < _that.minScrollY);
        let _hasHScroll = _that.hasHScroll = _opts.scrollX && (_that.maxScrollX < _that.minScrollX);
        if (!_hasVScroll) {
            _that.maxScrollY = _that.minScrollY;
            _that.scrollH = _that.wrapH;
        }
        if (!_hasHScroll) {
            _that.maxScrollX = _that.minScrollX;
            _that.scrollW = _that.wrapW;
        }

        _that.$emit(EVENT_TYPE.refresh);
    }

    /**
     * 事件回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollBase
     */
    handleEvent (evt) {
        const _that = this;
        const _type = evt && evt.type;
        switch (_type) {
            case 'mousedown':
            case 'touchstart':
                _that._start(evt);
                break;
            case 'mousemove':
            case 'touchmove':
                _that._move(evt);
                break;
            case 'mouseup':
            case 'touchend':
                _that._end(evt);
                break;
            case 'webkitTransitionEnd':
            case 'oTransitionEnd':
            case 'MSTransitionEnd':
            case 'transitionend':
                _that._transitionEnd(evt);
                break;
        }
    }

    /**
     * 初始化
     *
     * @param {HTMLElement} el dom元素
     * @memberof ScrollInit
     */
    _init (el) {
        const _that = this;
        if (!_that._querySelector(el)) {
            return;
        }
        _that._handleDomEvent();
        _that._watchTransition();
        _that._refresh();
    }
}
