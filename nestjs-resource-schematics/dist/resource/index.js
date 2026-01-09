"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resource = resource;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function resource(options) {
    return (tree, _context) => {
        if (!options.name) {
            throw new Error('Option "name" is required (e.g. --name user)');
        }
        // 日志，方便调试
        _context.logger.info(`Generating resource: ${options.name}`);
        // 模板路径，相对于 index.ts
        const templatePath = (0, schematics_1.url)('./files');
        // 目标生成路径
        const targetPath = options.path ? options.path : '';
        // 应用模板
        const source = (0, schematics_1.apply)(templatePath, [
            (0, schematics_1.applyTemplates)({
                ...options,
                ...core_1.strings
            }),
            (0, schematics_1.move)(targetPath)
        ]);
        // merge 模板到树
        return (0, schematics_1.mergeWith)(source)(tree, _context);
    };
}
exports.default = resource;
