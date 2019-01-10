/**
 *检测浏览器是否支持passive
 *
 * @export
 * @returns {*}
 */
export default function supportPassive () {
    let _support = false;

    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function() {
                _support = true;
            }
        });
        window.addEventListener('test', null, opts);
    } catch (err) {
    }

    return _support;
}
