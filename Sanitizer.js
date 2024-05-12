module.exports = class Sanitizer {
    constructor(params) {
        this.params = params;
        this.result = {};
    }

    validType = (value, expectedType) => typeof value === expectedType;
    getParamsForKey(key) {
        return this.params.find(p => p.field === key);
    }
    validateFields(data) {
        this.params.forEach(param => {
            if (data[param.field] === undefined) {
                this.result[param.field] = "MISSING";
            }
        });
        const missingRequiredFields = this.params.filter(p => p.required && data[p.field] === undefined).map(p => p.field);
        return missingRequiredFields.length === 0;
    }

    async sanitize(data, checkForAllFields = false) {
        this.result = {};
        const allFieldsValid = this.validateFields(data);

        let validCount = 0;
        Object.keys(data).forEach(async key => {
            const param = this.getParamsForKey(key);
            if(param && this.result[key] !== "MISSING") {
                if(this.validType(data[key], param.type)) {
                    if(param.condition) {
                        if(await param.condition(data[key])) {
                            validCount++;
                            this.result[key] = true;
                        }else {
                            this.result[key] = false;
                        }
                    }else {
                        validCount++;
                        this.result[key] = true;
                    }
                }else {
                    this.result[key] = false;
                }
            }else if(!param) {
                if(!checkForAllFields) {
                    validCount++;
                    this.result[key] = "UNEXPECTED";
                }else {
                    this.result[key] = "UNEXPECTED";
                }
            }
        });
        return validCount === Object.keys(data).length && allFieldsValid;
    }

    results() {
        return this.result;
    }
    valid(field) {
        return this.result[field] === true;
    }
}
