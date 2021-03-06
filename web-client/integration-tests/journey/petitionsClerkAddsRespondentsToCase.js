import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export default test => {
  return it('Petitions clerk manually adds multiple respondents to case', async () => {
    expect(test.getState('caseDetail.respondents')).toEqual([]);

    await test.runSequence('openAddRespondentModalSequence');

    expect(
      test.getState('validationErrors.respondentSearchError'),
    ).toBeDefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT6789',
    });

    await test.runSequence('openAddRespondentModalSequence');

    expect(
      test.getState('validationErrors.respondentSearchError'),
    ).toBeUndefined();
    expect(test.getState('modal.respondentMatches.length')).toEqual(1);

    //default selected because there was only 1 match
    let respondentMatch = test.getState('modal.respondentMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(respondentMatch.userId);

    await test.runSequence('associateRespondentWithCaseSequence');

    expect(test.getState('caseDetail.respondents.length')).toEqual(1);
    expect(test.getState('caseDetail.respondents.0.name')).toEqual(
      respondentMatch.name,
    );

    let formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.respondents.length).toEqual(1);
    expect(formatted.respondents[0].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );

    //add a second respondent
    await test.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT0987',
    });
    await test.runSequence('openAddRespondentModalSequence');

    expect(test.getState('modal.respondentMatches.length')).toEqual(1);
    respondentMatch = test.getState('modal.respondentMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(respondentMatch.userId);

    await test.runSequence('associateRespondentWithCaseSequence');
    expect(test.getState('caseDetail.respondents.length')).toEqual(2);
    expect(test.getState('caseDetail.respondents.1.name')).toEqual(
      respondentMatch.name,
    );

    formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.respondents.length).toEqual(2);
    expect(formatted.respondents[1].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );
  });
};
