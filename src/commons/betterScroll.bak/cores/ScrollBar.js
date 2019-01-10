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

        _that._initSelfEvtListener();

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
     * 监听自定义事件监听器
     */
    _initSelfEvtListener () {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (_that.scroller) {
            /**
             * 注册监听refresh回调事件
             */
            _that.scroller.$on(EVENT_TYPE.refresh, () => {
                _eachIndicator(_that.indicators, (indicator) => {
                    indicator.refresh();
                });
            });

            const _scrollbar = _opts && _opts.scrollbar;
            if ((typeof _scrollbar === 'boolean' && _scrollbar) ||
                (_scrollbar && _scrollbar.fade)) { // 监听滚动条显示/隐藏事件
                let _evtTypes = {
                    [EVENT_TYPE.scrollStart]: [false],
                    [EVENT_TYPE.scrollStart]: [true],
                    [EVENT_TYPE.scrollEnd]: [false]
                };
                for (let key in _evtTypes) {
                    if (_evtTypes.hasOwnProperty(key)) {
                        _that.scroller.$on(key, () => {
                            _eachIndicator(_that.indicators, (indicator) => {
                                indicator.handleFade.apply(indicator, _evtTypes[key]);
                            });
                        });
                    }
                }
            }
        }

        /**
         * 遍历滚动条bar
         * @param {Array} indicators 滚动条bar
         * @param {Function} cb 回调方法
         */
        function _eachIndicator (indicators, cb) {
            if (indicators && indicators.length > 0) {
                indicators.forEach((indicator) => {
                    if (cb instanceof Function &&
                        indicator instanceof Indicator) {
                        cb(indicator);
                    }
                });
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
