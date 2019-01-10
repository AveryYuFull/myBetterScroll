import { isType } from '../utils/isType';

/**
 * 缓存dom元素
 */
let _cacheDom = {};

/**
 * 创建dom元素
 * @param {String} tag dom元素的tag(默认为div)
 * @param {Object} options 可选参数
 * @param {Object} options.attrs 属性
 * @param {Array} options.attrs.class className
 * @param {Array} options.attrs.style css文本
 * @param {String} options.innerTxt 内联文本
 * @param {String} options.innerHtml 内联html
 * @returns {HTMLElement} 返回创建的dom元素
 */
export default function generateDom (tag, options) {
    tag = tag || 'div';
    let _dom = _cacheDom[tag] = _cacheDom[tag] || document.createElement(tag);
    _dom = _dom.cloneNode();
    if (_dom && options) {
        let _attrs = options.attrs;
        for (let key in _attrs) { // 设置属性
            if (_attrs.hasOwnProperty(key)) {
                let _item = _attrs[key];
                if (key) {
                    if (isType(_item, 'Array')) {
                        _item = _item.join(' ');
                    }
                    _dom.setAttribute(key, _item || '');
                }
            }
        }

        const _innerTxt = options.innerText;
        if (_innerTxt) { // innerText 文本
            _dom.innerText = _innerTxt;
        }
        const _innerHtml = options.innerHtml;
        if (_innerHtml) { // innerHtml
            _dom.innerHtml = _innerHtml;
        }
    }
    return _dom;
}
