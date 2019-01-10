import ScrollCore from './Scroll.core';
import { DEFAULT_CONFIG } from '../constants';

export default class ScrollInit extends ScrollCore {
    /**
     * 默认配置参数
     *
     * @memberof ScrollInit
     */
    defaultOptions = DEFAULT_CONFIG;

    constructor (el, options) {
        super(el, options);

        const _that = this;
        _that.setDefaultOptions(options);
    }
}
