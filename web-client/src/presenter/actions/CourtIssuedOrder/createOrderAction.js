import { state } from 'cerebral';
import orderTemplate from '../../../views/CreateOrder/orderTemplate.html';

const replaceWithID = (replacements, domString) => {
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(domString, 'text/html');

  Object.keys(replacements).forEach(id => {
    if (doc.querySelector(id)) {
      doc.querySelector(id).innerHTML = replacements[id];
    }
  });

  return doc;
};

export const createOrderAction = async ({ applicationContext, get }) => {
  let richText = get(state.form.richText) || '';
  let documentTitle = (get(state.form.documentTitle) || '').toUpperCase();
  richText = richText.replace(
    /\t/g,
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
  );
  const caseCaption = get(state.caseDetail.caseCaption) || '';
  const isOrderEvent = get(state.form.eventCode) == 'NOT'; // 'NOT' === 'notice'
  let caseCaptionNames = applicationContext.getCaseCaptionNames(caseCaption);
  let caseCaptionPostfix = '';
  if (caseCaptionNames !== caseCaption) {
    caseCaptionNames += ', ';
    caseCaptionPostfix = caseCaption.replace(caseCaptionNames, '');
  }
  let signatureForNotice = '';
  if (isOrderEvent) {
    signatureForNotice = `<p>${applicationContext.getClerkOfCourtNameForSigning()}<br />Clerk of the Court</p>`;
  }
  const docketNumberWithSuffix = get(
    state.formattedCaseDetail.docketNumberWithSuffix,
  );

  const doc = replaceWithID(
    {
      '#caseCaptionNames': caseCaptionNames,
      '#caseCaptionPostfix': caseCaptionPostfix,
      '#docketNumber': docketNumberWithSuffix,
      '#orderBody': richText,
      '#orderTitleHeader': documentTitle,
      '#signature': signatureForNotice,
    },
    orderTemplate,
  );

  let result = doc.children[0].innerHTML;

  result = result.replace(
    '/* STYLES_PLACEHOLDER */',
    await applicationContext.getPdfStyles(),
  );

  return { htmlString: result };
};
