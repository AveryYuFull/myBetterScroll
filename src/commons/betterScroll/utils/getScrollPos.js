import getStyle from './getStyle';

/**
 * 获取元素的滚动位置
 * @param {HTMLElement} el dom元素
 * @param {Boolean} useTransform 是否使用transform来移动元素
 * @returns {Object} 返回元素的滚动位置
 */
export default function getScrollPos (el, useTransform) {
    let _pos = {
        x: 0,
        y: 0
    };
    const _style = getStyle(el);
    if (!el || !_style) {
        return _pos;
    }

    if (useTransform) {
        let _matrix = _style[style.transform];
        _matrix = _matrix && _matrix.split(',');
        if (_matrix) {
            _pos = {
                x: _matrix[12] || _matrix[4],
                y: _matrix[13] || _matrix[5]
            };
        }
    } else {
        const _left = _style['left'];
        const _top = _style['top'];
        _pos = {
            x: (_left && _left.replace(/[^-.\d]/, '')) || 0,
            y: (_top && _top.replace(/[^-.\d]/, '')) || 0
        };
    }
    return _pos;
}
