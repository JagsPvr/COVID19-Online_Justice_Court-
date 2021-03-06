const {
  archiveDraftDocumentInteractor,
} = require('./archiveDraftDocumentInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('archiveDraftDocumentInteractor', () => {
  let applicationContext;

  it('returns an unauthorized error on non petitionsclerk users', async () => {
    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.petitioner,
      }),
      getPersistenceGateway: () => ({
        updateCase: () => null,
      }),
      getUniqueId: () => 'unique-id-1',
    };
    let error;
    try {
      await archiveDraftDocumentInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Unauthorized');
  });

  it('expect the updated case to contain the archived document', async () => {
    const updateCaseSpy = jest.fn();
    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.petitionsClerk,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: () => MOCK_CASE,
        updateCase: updateCaseSpy,
      }),
      getUniqueId: () => 'unique-id-1',
    };
    await archiveDraftDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents.find(
        d => d.documentId === 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      ),
    ).toMatchObject({
      archived: true,
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });
});
