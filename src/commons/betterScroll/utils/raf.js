import getNow from './getNow';

(function () {
    let _lastTime = 0;
    let _vendors = ['webkit', 'moz', 'ms'];
    for (let i = 0; i < _vendors.length && window.requestAnimationFrame; i++) {
        window.requestAnimationFrame = window[_vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[_vendors[i] + 'CancelAnimationFrame'] || window[_vendors[i] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            const _nowTime = getNow();
            const _timeToCall = Math.max(0, 17 - (_nowTime - _lastTime)); // 最大时间间隔为17ms，最小时间间隔为0ms
            const _timerId = setTimeout(() => {
                if (callback instanceof Function) {
                    callback();
                }
            }, _timeToCall);
            _lastTime = _nowTime + _timeToCall;
            return _timerId;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (timerId) {
            clearTimeout(timerId);
        };
    }
})();

export default {
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame
};
