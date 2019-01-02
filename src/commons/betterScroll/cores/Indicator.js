import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG } from '../constants';

export default class Indicator extends DefaultOptions {
    /**
     * 默认配置信息
     */
    defaultOptions = DEFAULT_CONFIG;

    constructor (scroller, options) {
        super(options);
        const _that = this;
        _that.setDefaultOptions(options);

        _that._init();
    }

    _init () {
        const _that = this;
        const _opts = _that.defaultOptions;
        _that.scroller = scroller;
        _that.fade = _opts && _opts.fade;
        _that.interactive = _opts && _opts.interactive;
    }

    /**
     * 刷新scrollbar
     */
    refresh() {
        const _that = this;
    }
}
