import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, EVENT_TYPE } from '../constants';
import Indicator from './Indicator';

export default class ScrollBar extends DefaultOptions {
    /**
     * 默认配置信息
     * @memberof ScrollBar
     */
    defaultOptions = DEFAULT_CONFIG;

    /**
     * 滚动对象
     */
    scroller = null;

    /**
     * 缓存scrollbar
     */
    cacheBar = {};

    /**
     * 滚动条列表
     */
    indicators = [];

    constructor (scroller, options) {
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);
        _that.scroller = scroller;
        _that._init();
    }

    /**
     * 初始化滚动条
     * @memberof ScrollBar
     * @private
     */
    _init () {
        const _that = this;
        if (_that.scroller.hasVScroll) {
            const _vScrollbar = _that._createScrollbar('vertical');
            _that._insertScroller(_vScrollbar);
            _that.indicators.push(new Indicator(_vScrollbar, _that.scroller, _that.defaultOptions));
        }
        if (_that.scroller.hasHScroll) {
            const _hScrollbar = _that._createScrollbar('horizontal');
            _that._insertScroller(_hScrollbar);
            _that.indicators.push(new Indicator(_hScrollbar, _that.scroller, _that.defaultOptions));
        }

        if (_that.scroller) {
            _that.scroller.$on(EVENT_TYPE.refresh, () => {
                console.log('refresh');
                _that._refresh();
            });
        }
    }

    /**
     * 将scrollbar插入到滚动条组件
     * @param {HTMLElement} scrollbar 滚动条bar
     */
    _insertScroller (scrollbar) {
        const _that = this;
        const _wrapper = _that.scroller && _that.scroller.wrapper;
        if (scrollbar && _wrapper) {
            _wrapper.appendChild(scrollbar);
        }
    }

    /**
     * 创建滚动条
     * @param {String} direction 滚动条方向
     * @returns {HTMLElement} 返回滚动条对象
     */
    _createScrollbar (direction) {
        const _that = this;
        let res = null;
        if (_that.cacheBar[direction]) {
            res = _that.cacheBar[direction];
        } else {
            const _opts = _that.defaultOptions;
            const _scrollbarOpts = {
                attrs: {
                    class: direction === 'vertical' ? 'better-vertical-scrollbar' : 'better-horizontal-scrollbar',
                    style: (function () {
                        let res = 'position: absolute;';
                        if (direction === 'vertical') {
                            res += ' top: 2px; bottom: 2px; right: 0; width: 8px;';
                        } else if (direction === 'horizontal') {
                            res += ' left: 2px; right: 2px; bottom: 2px; height: 8px;';
                        }
                        return res;
                    })()
                }
            };
            const _indicatorOpts = {
                attrs: {
                    class: 'bscroll-indicator',
                    style: (function () {
                        let res = 'position: absolute; background: rgba(0, 0, 0, 0.5); border-radius: 3px;';
                        if (direction === 'vertical') {
                            res += ' width: 100%;';
                        } else if (direction === 'horizontal') {
                            res += ' height: 100%;';
                        }
                        return res;
                    })()
                }
            };
            const _scrollerbar = res = _opts.generateDom('div', _scrollbarOpts);
            const _indicator = _opts.generateDom('div', _indicatorOpts);

            _scrollerbar.appendChild(_indicator);
        }
        return res;
    }
}
