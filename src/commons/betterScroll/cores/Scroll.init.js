import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG } from '../constants';

export default class ScrollInit extends DefaultOptions {
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
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);

        _that._init(el);
    }

    _handleDomEvent () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _target = (( _opts && _opts.useWrapper) && _that.wrapper) || window;
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
        
    }
}