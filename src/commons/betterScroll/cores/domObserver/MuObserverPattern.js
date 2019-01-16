import DefaultOptions from '../utils/DefaultOptions';

/**
 * MutationObserver功能类
 * @exports
 */
class MuObserverPattern extends DefaultOptions {
    defaultOptions = {};

    /**
     * 构造方法
     * @param {Object} options 配置参数
     * @param {Function} oserverCb MutationObserver的变动回调函数
     * @param {Function} cb 回调方法
     */
    constructor (options) {
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);
        _that._init();
    }

    /**
     * 初始化
     * @private
     */
    _init () {
        const _that = this;
        const _opts = _that.defaultOptions;
        _that.oserverCb = (_opts && _opts.oserverCb) || _that._oserverCb();
        _that.observer = new MutationObserver(_that.oserverCb.bind(_that));
    }

    /**
     * 默认的MutationObserver的回调方法
     * @returns {Function} 返回一个变动默认的处理方法
     */
    _oserverCb () {
        let _timer = null;
        return function (mutations) {
            if (!mutations) {
                return;
            }
            let _immediateRefresh = false;
            let _defferRefresh = false;
            for (let i = 0; i < mutations.length; i++) {
                const _mutaion = mutations[i];
                const _type = _mutaion && _mutaion.type;
                const _target = _mutaion && _mutaion.target;
                if (_type !== 'attributes') {
                    _immediateRefresh = true;
                    break;
                } else if (_target !== _that.scroller) {
                    _defferRefresh = true;
                    break;
                }
            }
            const _opts = _that.defaultOptions;
            if (_immediateRefresh) {
                if (_opts && (_opts.cb instanceof Function)) {
                    _opts.cb();
                }
            } else if (_defferRefresh) {
                clearTimeout(_timer);
                _timer = setTimeout(() => {
                    if (_opts && (_opts.cb instanceof Function)) {
                        _opts.cb();
                    }
                }, 60);
            }
        };
    }

    /**
     * 设置观察目标
     * @param {HTMLElement} target 观察目标
     * @param {Object} options 通过对象成员来设置观察选项
     */
    observe (target, options) {
        const _that = this;
        const _observer = _that.observer;
        if (_observer && (_observer.observer instanceof Function)) {
            _observer.observer(target, options);
        }
    }

    /**
     * 阻止观察者观察任何改变
     */
    disconnect () {
        const _that = this;
        const _observer = _that.observer;
        if (_observer && (_observer.disconnect instanceof Function)) {
            _observer.disconnect();
        }
    }

    /**
     * 取出记录队列中的记录
     * @returns {Array} 返回记录队列中的记录
     */
    takeRecords () {
        const _that = this;
        const _observer = _that.observer;
        if (_observer && (_observer.takeRecords instanceof Function)) {
            return _observer.takeRecords;
        }
    }
}

/**
 * 实例化MuObserverPattern对象工厂
 * @param {Object} options 可选参数
 * @returns {MuObserverPattern} 返回实例化后的MuObserverPattern对象
 */
export default function muObserverFactory (options) {
    return new MuObserverPattern(options);
}
