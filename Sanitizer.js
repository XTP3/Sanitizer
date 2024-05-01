class Sanitizer {
    constructor(params) {
        this.params = params;
    }

    validType = (value, expectedType) => typeof value === expectedType;
    getParamsForKey(key) {
        return this.params.find(p => p.field === key);
    }
    validateFields(data) {
        const missingFields = this.params.filter(p => data[p.field] === undefined).map(p => p.field);
        if (missingFields.length > 0) {
            return false;
        }
        return true;
    }

    sanitize(data, checkForAllFields = false) {
        let valid = 0;
        Object.keys(data).forEach(key => {
            const param = this.getParamsForKey(key);
            if(param) {
                if(this.validType(data[key], param.type)) {
                    if(param.condition) {
                        if(param.condition(data[key])) valid++;
                    }else {
                        valid++;
                    }
                }
            }
        });
        return valid === Object.keys(data).length && (checkForAllFields ? this.validateFields(data) : true);
    }
}

module.exports = Sanitizer;