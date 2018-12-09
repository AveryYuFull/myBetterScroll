/**
 * 获取事件类型
 * @param {String} type 事件类型
 * @returns {Object} 返回事件类型对象
 */
export default function getEventType (type) {
    let _res = null;
    if ('ontouchstart' in window || type === 'touchstart') {
        _res = {
            isTouchable: true,
            event_start: 'touchstart',
            event_move: 'touchmove',
            event_end: 'touchend'
        };
    } else {
        _res = {
            isTouchable: false,
            event_start: 'mousedown',
            event_move: 'mousemove',
            event_end: 'mouseup'
        };
    }
    return _res;
}
