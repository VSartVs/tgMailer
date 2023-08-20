"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamelCaseNamingStrategy = void 0;
const helpers_1 = require("@poppinss/utils/build/helpers");
class CamelCaseNamingStrategy {
    tableName(model) {
        return helpers_1.string.pluralize(helpers_1.string.snakeCase(model.name));
    }
    columnName(_, attributeName) {
        return helpers_1.string.snakeCase(attributeName);
    }
    serializedName(_, attributeName) {
        return helpers_1.string.camelCase(attributeName);
    }
    relationLocalKey(relation, model, relatedModel) {
        if (relation === 'belongsTo') {
            return relatedModel.primaryKey;
        }
        return model.primaryKey;
    }
    relationForeignKey(relation, model, relatedModel) {
        if (relation === 'belongsTo') {
            return helpers_1.string.camelCase(`${relatedModel.name}_${relatedModel.primaryKey}`);
        }
        return helpers_1.string.camelCase(`${model.name}_${model.primaryKey}`);
    }
    relationPivotTable(_, model, relatedModel) {
        return helpers_1.string.snakeCase([relatedModel.name, model.name].sort().join('_'));
    }
    relationPivotForeignKey(_, model) {
        return helpers_1.string.snakeCase(`${model.name}_${model.primaryKey}`);
    }
    paginationMetaKeys() {
        return {
            total: 'total',
            perPage: 'per_page',
            currentPage: 'current_page',
            lastPage: 'last_page',
            firstPage: 'first_page',
            firstPageUrl: 'first_page_url',
            lastPageUrl: 'last_page_url',
            nextPageUrl: 'next_page_url',
            previousPageUrl: 'previous_page_url',
        };
    }
}
exports.CamelCaseNamingStrategy = CamelCaseNamingStrategy;
//# sourceMappingURL=CamelCaseNamingStrategy.js.map