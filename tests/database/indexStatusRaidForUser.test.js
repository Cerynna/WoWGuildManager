const fs = require("fs");
const {
  indexStatusRaidForUser
} = require('../../database');

describe('indexStatusRaidForUser', () => {

  let raid = {};

  beforeAll(() => {
    raid = JSON.parse(fs.readFileSync(`${__dirname}/../fixtures/Raids.json`, "utf8"));
  });

  it('should return all index as false for an unknown user', () => {
    const user = '_UNKNOWN_';

    const {
      indexAccept,
      indexRefuse,
      indexBench,
      indexValid
    } = indexStatusRaidForUser(raid, user);

    expect(indexAccept).toBeUndefined()
    expect(indexRefuse).toBeUndefined();
    expect(indexBench).toBeUndefined();
    expect(indexValid).toBeUndefined();
  });

  it('should find a refused user', () => {
    const user = '_REFUSED_';

    const {
      indexAccept,
      indexRefuse,
      indexBench,
      indexValid
    } = indexStatusRaidForUser(raid, user);

    expect(indexAccept).toBeUndefined()
    expect(indexRefuse).not.toBeUndefined();
    expect(indexBench).toBeUndefined();
    expect(indexValid).toBeUndefined();
  });

  it('should find a benched user', () => {
    const user = '_BENCHED_';

    const {
      indexAccept,
      indexRefuse,
      indexBench,
      indexValid
    } = indexStatusRaidForUser(raid, user);

    expect(indexAccept).toBeUndefined()
    expect(indexRefuse).toBeUndefined();
    expect(indexBench).not.toBeUndefined();
    expect(indexValid).toBeUndefined();
  });

  it('should find a accepted user', () => {
    const user = '_ACCEPTED_';

    const {
      indexAccept,
      indexRefuse,
      indexBench,
      indexValid
    } = indexStatusRaidForUser(raid, user);

    expect(indexAccept).not.toBeUndefined()
    expect(indexRefuse).toBeUndefined();
    expect(indexBench).toBeUndefined();
    expect(indexValid).toBeUndefined();
  });

  it('should find an accpeted and validated user', () => {
    const user = '_VALIDATED_';

    const {
      indexAccept,
      indexRefuse,
      indexBench,
      indexValid
    } = indexStatusRaidForUser(raid, user);

    expect(indexAccept).not.toBeUndefined()
    expect(indexRefuse).toBeUndefined();
    expect(indexBench).toBeUndefined();
    expect(indexValid).not.toBeUndefined();
  });
});
