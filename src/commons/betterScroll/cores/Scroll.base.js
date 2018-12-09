import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG } from '../constants';

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
        const _target = (( _opts && _opts.useWrapper) && _that.wrapper) || window;
        const _initEventListener = _opts.initEventListener;

        if (_initEventListener instanceof Function) {
            const _getEventType = _opts.getEventType;
            let _evtType = {};
            if (_getEventType instanceof Function) {
                _evtType = _getEventType();
            }
            if (_evtType) { // 注册mousedown/mousemove/mouseup事件
                _initEventListener(_that.wrapper, _evtType['event_start'], this, true);
                _initEventListener(_target, [_evtType['event_move'], _evtType['event_end']], this, true);
            }
        }
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
        }
    }

    /**
     * 初始化
     *
     * @param {HTMLElement} el dom元素
     * @returns {*}
     * @memberof ScrollInit
     */
    _init (el) {
        if (!el) {
            console.error('element is required');
            return;
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
            return;
        }

        _that.wrapper = _wrapper;
        _that.scroller = _scroller;

        _that._handleDomEvent();
    }
}
