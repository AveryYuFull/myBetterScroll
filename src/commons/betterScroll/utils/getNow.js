/**
 * 获取当前时间戳
 *
 * @export
 * @returns {Number} 返回当前的时间戳
 */
export default function getNow () {
    return (window && window.performance) ? (window.performance.now() + window.performance.timing.navigationStart) : Date.now();
}
