/**
 * 获取当前时间
 * @returns {Number} 返回当前时间
 */
export default function getNow () {
    let _now = 0;
    if (window && window.performace) {
        _now = window.performance.now() + window.performance.timing.navigationStart;
    } else {
        _now = Date.now();
    }
    return _now;
}
