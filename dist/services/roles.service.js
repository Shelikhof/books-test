"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../utils/variables/roles");
class RolesService {
    generateRolesNum(roles) {
        let rolesNum = 1;
        roles.forEach((role) => {
            rolesNum = rolesNum | roles_1.ROLES[role];
        });
        return rolesNum;
    }
    checkRole(rolesNum, roles) {
        const rolesSum = roles.reduce((acc, role) => acc | roles_1.ROLES[role], 0);
        return (rolesNum & rolesSum) !== 0;
    }
}
exports.default = new RolesService();
