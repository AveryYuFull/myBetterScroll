/**
 * 获取dom元素的rect数据
 *
 * @export
 * @param {HTMLElement} el dom 元素节点
 * @returns {Object|Null} 返回元素的节点位置和大小信息
 */
export default function getRect (el) {
    let res = null;
    if (el) {
        if (el instanceof window.SVGElement) {
            let _res = el.getBoundingClientRect();
            res = {
                width: _res.width,
                height: _res.height,
                top: _res.top,
                left: _res.left
            };
        } else {
            res = {
                width: el.offsetWidth,
                height: el.offsetHeigth,
                top: el.offsetTop,
                left: el.offsetLeft
            };
        }
    }

    return res;
}
