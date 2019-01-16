import getRect from '../../utils/getRect';
import DefaultOptions from '../../utils/DefaultOptions';

class DomUpdatePattern extends DefaultOptions {
    // 默认可选参数
    defaultOptions = {};
    // 监听dom元素变化队列
    listenerQueue = [];
    // 是否开始监听队列中dom元素的变化
    startObserve = false;
    // 定时器
    timer = null;
    // 队列中dom元素变化记录
    mutations = [];

    /**
     * 构造方法
     * @param {Object} options 可选参数
     * @param {Function} options.oserverCb 监听到元素结构（宽度／高度）变化的回调方法
     * @param {Number} options.domUpdateInterval 监听dom元素的时间间隔
     */
    constructor (options) {
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);
    }

    /**
     * 开始监听队列的dom元素的变化
     * @private
     */
    _startObserveQueue () {
        const _that = this;
        if (!_that.startObserve) {
            _that._observeQueue();
            _that.startObserve = true;
        }
    }

    /**
     * 观察队列
     */
    _observeQueue () {
        const _that = this;
        const _opts = _that.defaultOptions;

        _checkQueue();

        /**
         * 检查dom元素的变化
         * @param {HTMLElement} listener 目标监听器
         */
        function _check (listener) {
            const _rect = getRect(listener.target);
            const _width = _rect.width || 0;
            const _height = _rect.height || 0;
            if (_width !== listener.width || _height !== listener.height) {
                listener.width = _width;
                listener.height = _height;
                _that.mutations.push(listener);
            }
        }

        /**
         * 检查队列的变化
         */
        function _checkQueue () {
            _that.mutations = [];
            const _listenerQueue = _that.listenerQueue;
            _listenerQueue.forEach(item => {
                if (item && item.target) {
                    _check(item);
                }
            });
            if (_opts.oserverCb instanceof Function) {
                _opts.oserverCb(_that.mutations);
            }
            clearTimeout(_that._timer);
            _that._timer = setTimeout(() => {
                _checkQueue();
            }, _opts.domUpdateInterval);
        }
    }

    /**
     * 将监听目标添加到队列
     * @param {HTMLElement} listener 监听器
     * @returns {HTMLElement} 返回插入到队列中的监听对象
     */
    _pushQueue (listener) {
        const _that = this;
        if (!listener || !listener.target) {
            return null;
        }
        const _listenerQueue = _that.listenerQueue;
        const _listener = _listenerQueue.find(item => item === listener.target);
        if (!_listener) {
            _listenerQueue.push(listener);
        }
        return _listener;
    }

    /**
     * 将监听目标从队列中移除
     * @param {HTMLElement} listener 监听器
     * @returns {HTMLElement} 返回移除的监听器对象
     */
    _removeQueue (listener) {
        if (!listener) {
            return null;
        }
        const _that = this;
        let res = null;
        _that.listenerQueue = _that.listenerQueue.filter(item => {
            if (item === listener.target) {
                res = listener;
                return false;
            }
            return true;
        });
        return res;
    }

    /**
     * 检查dom元素宽度／高度是否改变
     * @param {HTMLElement} target 观察目标
     * @param {Object} options 配置参数
     * @param {Number} options.width 目标元素的宽度
     * @param {Number} options.height 目标元素的高度
     */
    observe (target, options) {
        const _that = this;
        if (!target) {
            return;
        }
        _that._pushQueue({
            target: target,
            width: options.width,
            height: options.height
        });
        _that._startObserveQueue();
    }

    /**
     * 阻止观察者观察任何改变
     */
    disconnect () {
        const _that = this;
        _that.startObserve = false;
        if (_that.timer) {
            clearTimeout(_that.timer);
        }
    }

    /**
     * 取出记录队列中的记录
     * @returns {Array} 返回记录队列中的记录
     */
    takeRecords () {
        const _that = this;
        return _that.mutations;
    }
}

/**
 * 实例化DomUpdateFactory类
 * @param {Object} options 可选参数
 * @returns {DomUpdatePattern} 返回实例后的DomUpdatePattern对象
 */
export default function domUpdateFactory (options) {
    return new DomUpdatePattern(options);
}
