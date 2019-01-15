import getRect from '../../utils/getRect';
import DefaultOptions from '../../utils/DefaultOptions';

class DomUpdatePattern extends DefaultOptions {
    // 默认可选参数
    defaultOptions = {};

    constructor (el, options) {
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);
        _that.el = el;
    }

    /**
     * 检查dom元素宽度／高度是否改变
     * @param {Number} width 初始元素的宽度
     * @param {Number} height 初始元素的高度
     */
    checkDomUpdate (width, height) {
        const _that = this;
        const _opts = _that.defaultOptions;
        let _timer = null;

        /**
         * 检查scroller元素的变化
         */
        function _check () {
            const _rect = getRect(_that.el);
            const _width = _rect.width || 0;
            const _height = _rect.height || 0;
            if (_width !== width || _height !== height) {
                if (_opts.cb instanceof Function) {
                    const _res = _opts.cb();
                    width = _res.width;
                    height = _res.height;
                }
            }

            clearTimeout(_timer);
            _timer = setTimeout(() => {
                _check();
            }, _opts.checkDomUpdateTimer);
        }
        _check();
    }
}

/**
 * 实例化DomUpdateFactory类
 * @param {HTMLElement} el dom元素
 * @param {Object} options 可选参数
 * @returns {DomUpdatePattern} 返回实例后的DomUpdatePattern对象
 */
export default function domUpdateFactory (el, options) {
    return new DomUpdatePattern(el, options);
}
