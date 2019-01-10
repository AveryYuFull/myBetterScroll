import ScrollBase from './Scroll.base';
import { DEFAULT_CONFIG } from '../constants';

export default class ScrollCore extends ScrollBase {
    defaultOptions = DEFAULT_CONFIG;

    constructor (options) {
        super(options);
        const _that = this;
        _that.setDefaultOptions(options);
    }
}
