import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, SCROLL_DIRECTION, EVENT_TYPE } from '../constants';
import Indicator from './Indicator';
import extend from '../utils/extend';

export default class ScrollBar extends DefaultOptions {
    defaultOptions = DEFAULT_CONFIG;

    /**
     * indicators 数组
     */
    indicators = [];

    constructor (scroller, options) {
        super(options);
        const _that = this;
        this.setDefaultOptions(options);
        _that.scroller = scroller;

        _that._init();
    }

    /**
     * 初始化滚动条
     */
    _init () {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (_opts.scrollY) {
            _createIndicator(SCROLL_DIRECTION.VERTICAL);
        }
        if (_opts.scrollX) {
            _createIndicator(SCROLL_DIRECTION.HORIZONTAL);
        }

        /**
         * 注册监听refresh回调事件
         */
        _that.scroller.$on(EVENT_TYPE.refresh, () => {
            _that.indicators.forEach(indicator => {
                if (indicator instanceof Indicator) {
                    indicator.refresh();
                }
            });
        });

        /**
         * 创建scrollbar
         * @param {String} direction 滚动条方向
         */
        function _createIndicator (direction) {
            const _scrollbar = _that._createScrollBar(direction);
            _that.indicators.push(new Indicator(_that.scroller, extend({}, _opts, {
                el: _scrollbar,
                direction
            })));
            _insertIntoWrap(_scrollbar);
        }

        /**
         * 将scrollbar插入到wrapper中
         * @param {HTMLElement} scrollbar scrollbar对象
         */
        function _insertIntoWrap (scrollbar) {
            const _wrapper = _that.scroller && _that.scroller.wrapper;
            if (_wrapper) {
                _wrapper.appendChild(scrollbar);
            }
        }
    }

    /**
     * 创建滚动条
     * @param {String} direction 方向
     * @returns {HTMLElement} 返回创建的dom元素
     */
    _createScrollBar (direction) {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _direction = direction;
        const _wrapper = _opts.generateDom('div', {
            attrs: {
                class: (() => {
                    return _direction === SCROLL_DIRECTION.VERTICAL
                        ? ['bscroll-vertical-wrapper'] : ['bscroll-horizontal-wrapper'];
                })(),
                style: (() => {
                    let res = 'position: absolute; ';
                    if (_direction === SCROLL_DIRECTION.VERTICAL) {
                        res += 'top: 2px; bottom: 2px; right: 0; width: 8px;';
                    } else {
                        res += 'bottom: 2px; left: 2px; right: 2px; height: 8px;';
                    }
                    return res;
                })()
            }
        });
        const _indicator = _opts.generateDom('div', {
            attrs: {
                class: 'bscroll-indicator',
                style: (() => {
                    let res = 'position: absolute; background: rgba(0, 0, 0, 0.5); border-radius: 2px; top: 0;';
                    return _direction === SCROLL_DIRECTION.VERTICAL ? (res += ' width: 100%') : (res += ' height: 100%;');
                })()
            }
        });
        if (_wrapper && _indicator) {
            _wrapper.appendChild(_indicator);
        }
        return _wrapper;
    }
}
