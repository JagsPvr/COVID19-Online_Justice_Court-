import { docketClerkCreatesMessageToJudge } from './journey/docketClerkCreatesMessageToJudge';
import { fakeFile, loginAs, setupTest } from './helpers';
import judgeViewsCaseDetail from './journey/judgeViewsCaseDetail';
import judgeViewsDashboardMessages from './journey/judgeViewsDashboardMessages';
import petitionerAddNewCaseToTestObj from './journey/petitionerAddNewCaseToTestObj';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerFilesDocumentForCase from './journey/petitionerFilesDocumentForCase';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';
import petitionerViewsCaseDetailAfterFilingDocument from './journey/petitionerViewsCaseDetailAfterFilingDocument';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkCreatesMessageToJudge from './journey/petitionsClerkCreatesMessageToJudge';

const test = setupTest();

describe('Judge messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test);
  petitionerFilesDocumentForCase(test, fakeFile);
  petitionerViewsCaseDetailAfterFilingDocument(test);
  petitionerViewsDashboard(test);
  petitionerAddNewCaseToTestObj(test);

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesMessageToJudge(test, "don't forget to be awesome");

  loginAs(test, 'docketclerk');
  docketClerkCreatesMessageToJudge(
    test,
    'karma karma karma karma karma chameleon',
  );

  loginAs(test, 'judgeSavan');
  judgeViewsDashboardMessages(test);
  judgeViewsCaseDetail(test);
});
