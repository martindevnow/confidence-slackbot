import { getContractorName, getContractorScore, isContractor } from "./helpers";

describe("slack-helpers", () => {
  describe("isContractor", () => {
    it("works", () => {
      const commandArg = "contractor-marc 8";
      const actual = isContractor(commandArg);
      expect(actual).toBe(true);
    });
    it("prevents bad formatted message", () => {
      const commandArg = "contracddtor-marc 8";
      const actual = isContractor(commandArg);
      expect(actual).toBe(false);
    });
  });

  describe("getContractorName", () => {
    it("works", () => {
      const commandArg = "contractor-marc 8";

      const actual = getContractorName(commandArg);
      expect(actual).toBe("marc");
    });
    it("prevents badly formatted messages", () => {
      const commandArg = "contracddtor-marc 8";

      const actual = getContractorName(commandArg);
      expect(actual).toBeUndefined();
    });
  });

  describe("getContractorScore", () => {
    it("works", () => {
      const commandArg = "contractor-marc 8";

      const actual = getContractorScore(commandArg);
      expect(actual).toBe("8");
    });
    it("prevents badly formatted messages", () => {
      const commandArg = "contracddtor-marc 8";

      const actual = getContractorScore(commandArg);
      expect(actual).toBeUndefined();
    });
  });
});
