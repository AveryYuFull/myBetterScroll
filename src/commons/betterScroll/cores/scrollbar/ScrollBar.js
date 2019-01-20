import DefaultOptions from '../../utils/DefaultOptions';
import { DEFAULT_CONFIG, SCROLL_TYPE } from '../../constants';
import genDom from '../../utils/genDom';

class Scrollbar extends DefaultOptions {
    // 默认配置信息
    defaultOptions = DEFAULT_CONFIG;

    /**
     *Creates an instance of Scrollbar.
     * @param {Scroll} bScroll bScroll对象实例
     * @param {Object} options 可选参数
     * @memberof Scrollbar
     */
    constructor (bScroll, options) {
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);
        _that.bScroll = bScroll;
        _that._init();
    }

    /**
     * 初始化
     * @memberof Scrollbar
     */
    _init () {
        const _that = this;
        const _bScroll = _that.bScroll;
        let _scrollbarX = null;
        let _scrollbarY = null;
        if (_bScroll && _bScroll.hasScrollX) {
            _scrollbarX = _that._genScrollbar(SCROLL_TYPE.HORIZONTAL);
        }
        if (_bScroll && _bScroll.hasScrollY) {
            _scrollbarY = _that._genScrollbar(SCROLL_TYPE.VERTICAL);
        }
        _that._insertScrollbar(_scrollbarX);
        _that._insertScrollbar(_scrollbarY);
    }

    /**
     * 将scrollbar插入到scroll中
     * @param {HTMLElement} scrollbar scrollbar
     * @memberof Scrollbar
     */
    _insertScrollbar (scrollbar) {
        const _that = this;
        const _bScroll = _that.bScroll;
        if (_bScroll && _bScroll.wrapper && scrollbar) {
            _bScroll.wrapper.appendChild(scrollbar);
        }
    }

    /**
     * 创建滚动条
     * @param {String} direction 滚动条方向
     * @memberof Scrollbar
     */
    _genScrollbar (direction) {
        let _scrollbarParams = null;
        let _indicatorParams = null;
        let _scrollbar = null;
        let _indicator = null;

        if (direction === SCROLL_TYPE.HORIZONTAL) {
            _scrollbarParams = ['div', {
                attrs: {
                    class: [`bscroll-horizontal-scrollbar`]
                },
                cssText: 'position: absolute; height: 8px; left: 2px; right: 2px; bottom: 2px;'
            }];
            _indicatorParams = ['div', {
                attrs: {
                    class: 'bscroll-indicator'
                },
                cssText: 'position: absolute; height: 100%; background-color: rgba(0, 0, 0, 0.5); border-raduis: 3px;'
            }];
        } else if (SCROLL_TYPE.VERTICAL) {
            _scrollbarParams = ['div', {
                attrs: {
                    class: ['bscroll-vertical-scrollbar']
                },
                cssText: 'position: absolute; top: 2px; bottom: 2px; right: 0; width: 8px;'
            }];
            _indicatorParams = ['div', {
                attrs: {
                    class: 'bscroll-indicator'
                },
                cssText: 'position: absolute; width: 100%; background-color: rgba(0, 0, 0, 0.5); border-radius: 3px;'
            }];
        }
        _scrollbar = _scrollbarParams && genDom.apply(null, _scrollbarParams);
        _indicator = _indicatorParams && genDom.apply(null, _indicatorParams);
        if (_scrollbar && _indicator) {
            _scrollbar.appendChild(_indicator);
        }
        return _scrollbar;
    }
}

/**
 * 实例化scrollbar对象的工厂方法
 * @export
 * @param {Scroll} bScroll Scroll对象
 * @param {Object} options 可选参数
 */
export default function scrollbarFactory (bScroll, options) {
    return new Scrollbar(bScroll, options);
}
