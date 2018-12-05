
let _elem

export function generateElem (tag, opts) {
  tag = tag || 'div'
  const _opts = opts || {}
  _elem = _elem || document.createElement(tag)
  let _node = _elem.cloneNode()

  // 添加className
  const _clsArr = _formatData(_opts.cls)
  _clsArr.forEach(cls => {
    if (cls) {
      _node.classList.add(cls)
    }
  })

  // 添加innerText
  if (_opts.innerTxt) {
    _node.innerText = _opts.innerTxt
  }

  // 添加innerHtml
  if (_opts.innerHtm) {
    _node.innerHtml = _opts.innerHtm
  }

  return _node

  /**
     * 格式化数据
     * @param {String|Array} data 需要格式化的数据
     * @returns {Array} 格式化为数组的数据对象
     * @private
     */
  function _formatData (data) {
    if (!data || typeof data !== 'string' || !Array.isArray(data)) {
      return []
    }

    let _res = data
    if (typeof _res === 'string') {
      _res = [_res]
    }
    return _res
  }
}
