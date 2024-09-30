// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import loginCommon from '@commonTests/BO/loginBO';

// Import pages
import languagesPage from '@pages/BO/international/languages';
import addLanguagePage from '@pages/BO/international/languages/add';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import {
  boDashboardPage,
  boLocalizationPage,
  FakerLanguage,
  utilsFile,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_international_localization_languages_bulkActionsLanguages';

/*
Create 2 languages
Enable them with bulk actions
Disable them with bulk actions
Delete them with bulk actions
 */
describe('BO - International - Languages : Bulk disable, enable and delete languages', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfLanguages: number = 0;

  const firstLanguageData: FakerLanguage = new FakerLanguage({name: 'languageToDelete1', isoCode: 'fi'});
  const secondLanguageData: FakerLanguage = new FakerLanguage({name: 'languageToDelete2', isoCode: 'ca'});

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);

    // Create images
    await Promise.all([
      utilsFile.generateImage(firstLanguageData.flag),
      utilsFile.generateImage(firstLanguageData.noPicture),
      utilsFile.generateImage(secondLanguageData.flag),
      utilsFile.generateImage(secondLanguageData.noPicture),
    ]);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
    await Promise.all([
      utilsFile.deleteFile(firstLanguageData.flag),
      utilsFile.deleteFile(firstLanguageData.noPicture),
      utilsFile.deleteFile(secondLanguageData.flag),
      utilsFile.deleteFile(secondLanguageData.noPicture),
    ]);
  });

  it('should login in BO', async function () {
    await loginCommon.loginBO(this, page);
  });

  it('should go to \'International > Localization\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToLocalizationPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.internationalParentLink,
      boDashboardPage.localizationLink,
    );
    await boLocalizationPage.closeSfToolBar(page);

    const pageTitle = await boLocalizationPage.getPageTitle(page);
    expect(pageTitle).to.contains(boLocalizationPage.pageTitle);
  });

  it('should go to \'Languages\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToLanguagesPage', baseContext);

    await boLocalizationPage.goToSubTabLanguages(page);

    const pageTitle = await languagesPage.getPageTitle(page);
    expect(pageTitle).to.contains(languagesPage.pageTitle);
  });

  it('should reset all filters and get number of languages in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'resetFilterFirst', baseContext);

    numberOfLanguages = await languagesPage.resetAndGetNumberOfLines(page);
    expect(numberOfLanguages).to.be.above(0);
  });

  describe('Create 2 Languages', async () => {
    [firstLanguageData, secondLanguageData].forEach((languageToCreate: FakerLanguage, index: number) => {
      it('should go to add new language page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToAddNewLanguage${index + 1}`, baseContext);

        await languagesPage.goToAddNewLanguage(page);

        const pageTitle = await addLanguagePage.getPageTitle(page);
        expect(pageTitle).to.contains(addLanguagePage.pageTitle);
      });

      it('should create new language', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `createLanguage${index + 1}`, baseContext);

        const textResult = await addLanguagePage.createEditLanguage(page, languageToCreate);
        expect(textResult).to.to.contains(languagesPage.successfulCreationMessage);

        const numberOfLanguagesAfterCreation = await languagesPage.getNumberOfElementInGrid(page);
        expect(numberOfLanguagesAfterCreation).to.be.equal(numberOfLanguages + index + 1);
      });
    });
  });

  describe('Enable, disable and delete with bulk actions', async () => {
    const tests = [
      {args: {action: 'disable', toEnable: false}},
      {args: {action: 'enable', toEnable: true}},
    ];

    it('should filter language by name \'languageToDelete\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterLanguageToChangeStatus', baseContext);

      // Filter
      await languagesPage.filterTable(page, 'input', 'name', 'languageToDelete');

      const numberOfLanguagesAfterFilter = await languagesPage.getNumberOfElementInGrid(page);
      expect(numberOfLanguagesAfterFilter).to.be.at.least(2);
    });

    tests.forEach((test) => {
      it(`should ${test.args.action} with bulk actions`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `bulk${test.args.action}`, baseContext);

        const disableTextResult = await languagesPage.bulkSetStatus(
          page,
          test.args.toEnable,
        );
        expect(disableTextResult).to.be.equal(languagesPage.successfulUpdateStatusMessage);

        // Check that element in grid are disabled
        const numberOfLanguagesInGrid = await languagesPage.getNumberOfElementInGrid(page);
        expect(numberOfLanguagesInGrid).to.be.at.most(numberOfLanguages);

        for (let i = 1; i <= numberOfLanguagesInGrid; i++) {
          const textColumn = await languagesPage.getStatus(page, i);
          expect(textColumn).to.equal(test.args.toEnable);
        }
      });
    });

    it('should delete with bulk actions', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'bulkDelete', baseContext);

      const deleteTextResult = await languagesPage.deleteWithBulkActions(page);
      expect(deleteTextResult).to.be.equal(languagesPage.successfulMultiDeleteMessage);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterDelete', baseContext);

      const numberOfLanguagesAfterDelete = await languagesPage.resetAndGetNumberOfLines(page);
      expect(numberOfLanguagesAfterDelete).to.be.equal(numberOfLanguages);
    });
  });
});
