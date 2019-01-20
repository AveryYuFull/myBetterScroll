const _cacheDom = {};

/**
 * 创建dom元素
 * @export
 * @param {string} [tag='div'] dom元素的标签
 * @param {Object} options 可选参数
 * @param {Object} options.attrs dom元素的属性
 * @param {Array} options.attrs.class class属性
 * @param {String} options.cssText dom元素的cssText
 * @param {String} options.innerText dom元素的innerText
 * @param {String} options.innerHTML dom元素的innerHTML
 * @returns {HTMLElement} 返回创建的dom元素
 * Eg:
 * {
 *      tag: 'div',
 *      options: {
 *          attrs: {
 *              class: ['a', 'b']
 *          },
 *          cssText: 'abc',
 *          innerText: 'abc',
 *          innerHTML: '<div>abd</div>'
 *      }
 * }
 */
export default function genDom (tag = 'div', options) {
    console.log(tag, options)
    let _dom = _cacheDom[tag] = _cacheDom[tag] || document.createElement(tag);
    _dom = _dom.cloneNode();
    if (_dom && options) {
        // 处理dom元素的属性
        for (let optKey in options) {
            if (options.hasOwnProperty(optKey)) {
                let _optItem  = options[optKey];
                if (!_optItem || !optKey) {
                    continue;
                }

                if (optKey === 'attrs') {
                    for (let key in _optItem) {
                        if (_optItem.hasOwnProperty(key)) {
                            let _item = _optItem[key];
                            if (_item instanceof Array) {
                                _item = _item.join(' ');
                            }
                            if (_item) {
                                _dom.setAttribute(key, _item);
                            }
                        }
                    }
                } else {
                    _dom.style[optKey] = _optItem;
                }
            }
        }
    }

    return _dom;
}