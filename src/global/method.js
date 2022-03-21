export default {
    install(Vue) {
        Vue.prototype.instance = function (type, content, ok, cancel) {
            switch (type) {
                case 'success':
                    this.$Modal.success({
                        title: '操作成功！',
                        content: content,
                    });
                    break;
                case 'warning':
                    this.$Modal.confirm({
                        title: '警告',
                        content: content,
                        onOk: () => {
                            ok();
                        },
                        onCancel: () => {
                            cancel();
                        }
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: '操作失败！',
                        content: content
                    });
                    break;
            }
        };
        /**
         * 检查内容是否为空
         * @param validate
         * @returns {boolean}
         */
        Vue.prototype.inspection = function (validate) {
            let validateA = validate.replace(/ /g, '');
            let validateB = validateA.replace(/<p>/g, '');
            let validateC = validateB.replace(/<\/p>/g, '');
            let validateD = validateC.replace(/&nbsp;/g, '');
            let validateE = validateD.replace(/<br>/g, '');
            return validateE.length !== 0;
        };
        /**
         * 将数字转换为汉字
         * 参数为数字字符串
         * @param number
         * @returns {string}
         */
        Vue.prototype.noToChinese = function (number) {
            let reg = /^\+?[1-9][0-9]*$/;
            if (!reg.test(number)) {
                return '数字格式错误';
            }
            let ele_zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
            let site = ['', '十', '百', '千'];
            let numSplit = number.split('');
            let chinese = '';
            let numSite = numSplit.length;
            if (numSite === 1) {
                chinese = ele_zh[number];
            } else if (numSite === 2 && numSplit[0] === '1') {
                if (numSplit[1] === '0') {
                    chinese = '十';
                } else {
                    chinese = '十' + ele_zh[numSplit[1]];
                }
            } else if (numSite > 2 && numSite < 5) {
                for (let i = 0; i < numSplit.length; i++) {
                    if (numSite === 1 && numSplit[i] === '0') {
                        break;
                    }
                    if (numSplit[i] === '0' && numSplit[i - 1] !== '0') {
                        let flag = false;
                        for (let j = i + 1; j < numSplit.length; j++) {
                            if (numSplit[j] !== '0') {
                                flag = true;
                                break;
                            }
                        }
                        if (flag) {
                            chinese = chinese + '零';
                        }
                    } else if (numSplit[i] === '0' && numSplit[i - 1] === '0') {
                        chinese = chinese + '';
                    } else {
                        chinese = chinese + ele_zh[numSplit[i]] + site[numSite - 1];
                    }
                    numSite--;
                }
            } else if (numSite > 4 && numSite < 9) {
                let wanSiteArr = numSplit.slice(0, numSplit.length - 4);
                let wanSite = this.noToChinese(wanSiteArr.join(''));
                let qianSiteArr = numSplit.slice(numSplit.length - 4, numSplit.length);
                let qianSite = this.noToChinese(qianSiteArr.join(''));
                chinese = wanSite + '万' + qianSite;
            } else if (numSite > 8 && numSite < 13) {
                let yiSiteArr = numSplit.slice(0, numSplit.length - 8);
                let yiSite = this.noToChinese(yiSiteArr.join(''));
                let wanSiteArr = numSplit.slice(numSplit.length - 8, numSplit.length);
                let wanSite = this.noToChinese(wanSiteArr.join(''));
                chinese = yiSite + '亿' + wanSite;
            } else {
                return '数字位溢出，无法转换';
            }
            return chinese;
        };
    }
}
