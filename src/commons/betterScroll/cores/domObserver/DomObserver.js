import DefaultOptions from '../../utils/DefaultOptions';
import domUpdateFactory from './DomUpdatePattern';
import muObserverFactory from './MuObserverPattern';
import { OBJECT_TYPE } from '../../constants';

class DomObserver extends DefaultOptions {
    defaultOptions = {};
    // dom节点变化监听器
    domObserver = null;

    constructor (options) {
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);

        _that._init();
    }

    /**
     * 初始化
     * @param {String} type 对象类型
     */
    _init () {
        const _that = this;
        const _opts = _that.defaultOptions;
        let _type = (_opts.type || '') + '';
        _type = _type !== OBJECT_TYPE.MU_OBSERVER_PATTERN ? OBJECT_TYPE.DOM_UPDATE_PATTERN : _type;
        if (_type === OBJECT_TYPE.MU_OBSERVER_PATTERN) {
            _that.domObserver = _that._instance(_type, _opts);
        } else {
            _that.domObserver = _that._instance(OBJECT_TYPE.DOM_UPDATE_PATTERN, _opts);
        }
    }

    /**
     * 对象类型
     * @param {String} type 对象类型
     * @param {Object} options 可选参数
     * @param {Function} options.cb 回调方法
     * @param {Function} options.oserverCb MutationObserver的变动回调函数
     * @returns {Any} 返回实例后的对象
     */
    _instance (type, options) {
        const _that = this;
        let _obj = null;
        const _opts = _that.getOptions(options);
        switch ((type || '') + '') {
            case OBJECT_TYPE.DOM_UPDATE_PATTERN:
                _obj = domUpdateFactory(_opts);
                break;
            case OBJECT_TYPE.MU_OBSERVER_PATTERN:
                _obj = muObserverFactory(_opts);
                break;
        }
        return _obj;
    }

    /**
     * 初始化dom节点变化观察器
     * @param {HTMLElement} el dom节点
     * @param {Object} options 配置参数
     */
    observe (el, options) {
        const _that = this;
        const _opts = _that.getOptions(options);
        if (_that.domObserver) {
            _that.domObserver.observe(el, _opts);
        }
    }

    /**
     * 阻止观察者观察任何改变
     */
    disconnect () {
        const _that = this;
        if (_that.domObserver) {
            _that.domObserver.disconnect(el, _opts);
        }
    }

    /**
     * 取出记录队列中的记录
     * @returns {Array} 返回记录队列中的记录
     */
    takeRecords () {
        const _that = this;
        let _records = null;
        if (_that.domObserver) {
            _records = _that.domObserver.takeRecords();
        }
        return _records;
    }
}

/**
 * 实例化DomUpdateFactory类
 * @param {Object} options 可选参数
 * @returns {DomObserver} 返回实例后的DomObserver对象
 */
export default function domObserverFactory (options) {
    return new DomObserver(options);
}
