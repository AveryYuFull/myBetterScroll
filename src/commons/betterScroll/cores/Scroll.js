import ScrollCore from './Scroll.core';
import { DEFAULT_CONFIG } from '../constants';
import domObserverFactory from './domObserver';

export default class Scroll extends ScrollCore {
    defaultOptions = DEFAULT_CONFIG;

    constructor (el, options) {
        super(options);
        const _that = this;
        _that._init(el, options);
    }

    /**
     * 启动better-scroll
     * @memberof Scroll
     */
    enable () {
        const _that = this;
        _that.enable = true;
    }

    disable () {
        const _that = this;
        _that.enable = false;
    }

    /**
     * 初始化数据
     * @param {HTMLElement|String} el dom元素
     * @param {Object} options 可选参数
     */
    _init (el, options) {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (!_that._getElements(el)) {
            return;
        }
        _that._handleOptions(options);
        _that.enable();
        _that._watchTransition();
        if (_opts.autoBlur) {
            _that._handleAutoBlur();
        }
        _that._refresh();
        if (_opts.observeDOM) {
            _that.domObserver = domObserverFactory();
            _that.domObserver.observe(_that.scroller, {
                cb: _that._refresh.bind(_that),
                muObserverOptions: _opts.muObserverOptions,
                width: _that.scrollerWidth,
                height: _that.scrollerHeight
            });
        }
        _that._initEventListener();
    }
}
