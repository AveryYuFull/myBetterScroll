import ScrollCore from './Scroll.core';
import { DEFAULT_CONFIG } from '../constants';

export default class Scroll extends ScrollCore {
    defaultOptions = DEFAULT_CONFIG;

    constructor (options) {
        super(options);
        const _that = this;
        _that.setDefaultOptions(options);
    }
}
