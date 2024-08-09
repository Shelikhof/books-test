import rolesService from "../../services/roles.service";

describe("roles service", () => {
  let func: typeof rolesService;
  beforeAll(() => {
    func = rolesService;
  });

  describe("generateRolesNum", () => {
    it("generate only 'user' role", () => {
      expect(func.generateRolesNum(["user"])).toEqual(1);
    });

    it("generate only 'user' and 'admin' role", () => {
      expect(func.generateRolesNum(["user", "admin"])).toEqual(3);
    });

    it("generate only 'user' and 'admin' role", () => {
      expect(func.generateRolesNum(["admin"])).toEqual(3);
    });
  });

  describe("checkRole", () => {
    it("1 and check user", () => {
      expect(func.checkRole(1, ["user"])).toEqual(true);
    });

    it("3 and check admin", () => {
      expect(func.checkRole(3, ["admin"])).toEqual(true);
    });

    it("3 and check user", () => {
      expect(func.checkRole(3, ["user"])).toEqual(true);
    });

    it("1 and check admin", () => {
      expect(func.checkRole(1, ["admin"])).toEqual(false);
    });

    it("3 and check user, admin", () => {
      expect(func.checkRole(3, ["user", "admin"])).toEqual(true);
    });
  });
});
