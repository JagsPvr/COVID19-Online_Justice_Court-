import { refreshElasticsearchIndex } from '../helpers';

export default (test, trialLocation, checkReport = true) => {
  return it('Petitions clerk unblocks the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeTruthy();

    await test.runSequence('unblockCaseFromTrialSequence');

    expect(test.getState('alertSuccess').title).toEqual(
      'The block on this case has been removed',
    );
    expect(test.getState('caseDetail').blocked).toBeFalsy();
    expect(test.getState('caseDetail').blockedReason).toBeUndefined();

    if (checkReport) {
      await refreshElasticsearchIndex();

      await test.runSequence('gotoBlockedCasesReportSequence');

      await test.runSequence('getBlockedCasesByTrialLocationSequence', {
        key: 'trialLocation',
        value: trialLocation,
      });

      expect(test.getState('blockedCases')).toMatchObject([]);
    }
  });
};
