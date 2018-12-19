import extend from './extend';
import EventModule from './EventModule';

export default class DefaultOptions extends EventModule {
    defaultOptions = {}; // 默认选项
    name = ''; // 默认类名
    constructor (options = {}) {
        super();
        let _that = this;
        _that.setDefaultOptions(options);
    }
    /**
   * 获取默认选项
   *
   * @param {any} options 当前选项
   * @returns {any}
   * @memberof Service
   */
    getOptions (...args) {
        let _that = this;
        let options = args && args[0];
        if (options) {
            options = extend.apply(null, [].concat([{}, _that.defaultOptions || {}], args));
        } else if (_that.defaultOptions) {
            options = extend({}, _that.defaultOptions || {});
        }
        return options;
    }
    /**
   * 设置默认选项
   *
   * @param {any} options 选项
   * @memberof Service
   */
    setDefaultOptions (options) {
        let _that = this;
        if (options) {
            _that.defaultOptions = extend({}, _that.defaultOptions || {}, options);
        }
    }
}
