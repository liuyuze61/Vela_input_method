import { dict } from './dic.js'

let SimpleInputMethod = {
    dict: {},
    pinyinSet: new Set() // 存储所有有效的拼音
}

SimpleInputMethod.initDict = function() {
    this.dict.py2hz = dict;
    this.dict.py2hz2 = {};
    this.dict.py2hz2['i'] = 'i'; // i比较特殊，没有符合的汉字，所以特殊处理

    // 构建有效拼音集合
    for (let key in this.dict.py2hz) {
        this.pinyinSet.add(key);
        if (!this.dict.py2hz2[key[0]]) {
            this.dict.py2hz2[key[0]] = this.dict.py2hz[key];
        }
    }
};

// 判断是否是有效的拼音
SimpleInputMethod.isValidPinyin = function(pinyin) {
    return this.pinyinSet.has(pinyin);
};

// 获取所有以某前缀开头的拼音
SimpleInputMethod.getPinyinByPrefix = function(prefix) {
    const result = [];
    for (let pinyin of this.pinyinSet) {
        if (pinyin.startsWith(prefix)) {
            result.push(pinyin);
        }
    }
    return result;
};

SimpleInputMethod.getSingleHanzi = function(pinyin){
    return this.dict.py2hz2[pinyin] || this.dict.py2hz[pinyin] || '';
}

SimpleInputMethod.getHanzi = function(pinyin) {
    let result = this.getSingleHanzi(pinyin);
    if (result) return [result.split(''), pinyin];

    let temp = '';
    let start = Math.min(pinyin.length, 6);

    for (let i = start; i >= 1; i--) {
        let str = pinyin.substr(0, i);
        let rs = this.getSingleHanzi(str);
        if (rs) return [rs.split(''), str];
    }

    return [[], '']; // 理论上一般不会出现这种情况
};

SimpleInputMethod.initDict();

export { SimpleInputMethod } //换成export default SimpleInputMethod;不能用