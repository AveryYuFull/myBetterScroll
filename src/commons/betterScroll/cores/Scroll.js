import ScrollCore from './Scroll.core';
import { DEFAULT_CONFIG } from '../constants';

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
        _that.enabled = true;
    }

    disable () {
        const _that = this;
        _that.enabled = false;
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
        _that.x = 0;
        _that.y = 0;
        _that._handleOptions(options);
        _that.enable();
        _that._watchTransition();
        if (_opts.autoBlur) {
            _that._handleAutoBlur();
        }
        _that._refresh();
        if (_opts.observeDOM) {
            _that._initDomObserver();
        }
        _that._initEventListener();
    }
}
