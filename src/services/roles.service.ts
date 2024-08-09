import { ROLES, rolesKeys } from "../utils/variables/roles";

class RolesService {
  generateRolesNum(roles: rolesKeys[]): number {
    let rolesNum = 1;

    roles.forEach((role) => {
      rolesNum = rolesNum | ROLES[role];
    });

    return rolesNum;
  }

  checkRole(rolesNum: number, roles: rolesKeys[]): boolean {
    const rolesSum = roles.reduce((acc, role) => acc | ROLES[role], 0);
    return (rolesNum & rolesSum) !== 0;
  }
}

export default new RolesService();
