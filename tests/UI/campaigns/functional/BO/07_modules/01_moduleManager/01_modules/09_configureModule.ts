// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import loginCommon from '@commonTests/BO/loginBO';

// Import pages
import {moduleConfigurationPage} from '@pages/BO/modules/moduleConfiguration';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import {
  boDashboardPage,
  boModuleManagerPage,
  dataModules,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_modules_moduleManager_modules_configureModule';

describe('BO - Modules - Module Manager : Configure module', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should login in BO', async function () {
    await loginCommon.loginBO(this, page);
  });

  it('should go to \'Modules > Module Manager\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToModuleManagerPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.modulesParentLink,
      boDashboardPage.moduleManagerLink,
    );
    await boModuleManagerPage.closeSfToolBar(page);

    const pageTitle = await boModuleManagerPage.getPageTitle(page);
    expect(pageTitle).to.contains(boModuleManagerPage.pageTitle);
  });

  it(`should search for module ${dataModules.contactForm.name}`, async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'searchForModule', baseContext);

    const isModuleVisible = await boModuleManagerPage.searchModule(page, dataModules.contactForm);
    expect(isModuleVisible, 'Module is not visible!').to.eq(true);
  });

  it('should go to module configuration page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'configureModule', baseContext);

    await boModuleManagerPage.goToConfigurationPage(page, dataModules.contactForm.tag);

    const pageSubtitle = await moduleConfigurationPage.getPageSubtitle(page);
    expect(pageSubtitle).to.contains(dataModules.contactForm.name);
  });
});
