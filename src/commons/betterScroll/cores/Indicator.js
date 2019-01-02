import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, EVENT_TYPE } from '../constants';

export default class Indicator extends DefaultOptions {
    /**
     * 默认配置信息
     */
    defaultOptions = DEFAULT_CONFIG;

    constructor (el, scroller, options) {
        super(options);
        const _that = this;
        _that.setDefaultOptions(options);
        _that.el = el;
        _that.scroller = scroller;
        _that._init();
    }

    _init () {
        const _that = this;
        const _opts = _that.defaultOptions;

        _that.fade = _opts && _opts.fade;
        _that.interactive = _opts && _opts.interactive;
        if (_that.scroller) {
            _that.scroller.$on(EVENT_TYPE.refresh, () => {
                _that._refresh();
            });
        }
    }

    /**
     * 刷新scrollbar
     */
    _refresh() {
        const _that = this;
        console.log('_refresh');
    }
}
