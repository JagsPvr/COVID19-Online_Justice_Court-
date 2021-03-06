const {
  deleteUserCaseNoteInteractor,
} = require('./deleteUserCaseNoteInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('deleteUserCaseNoteInteractor', () => {
  let applicationContext;

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await deleteUserCaseNoteInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('deletes a case note', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Judge Savan',
          role: User.ROLES.judge,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        deleteUserCaseNote: v => v,
      }),
      getUseCases: () => ({
        getJudgeForUserChambersInteractor: () => ({
          role: User.ROLES.judge,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      }),
    };

    let error;
    let caseNote;

    try {
      caseNote = await deleteUserCaseNoteInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseNote).toBeDefined();
  });
});
