import BOBasePage from '@pages/BO/BObasePage';

import type {Page} from 'playwright';
import {
  type FakerSqlQuery,
} from '@prestashop-core/ui-testing';

/**
 * Add sql query page, contains functions that can be used on the page
 * @class
 * @extends BOBasePage
 */
class AddSQLQuery extends BOBasePage {
  public readonly pageTitle: string;

  public readonly editPageTitle: string;

  private readonly sqlQueryNameInput: string;

  private readonly sqlQueryTextArea: string;

  private readonly saveButton: string;

  /**
   * @constructs
   * Setting up texts and selectors to use on add sql query page
   */
  constructor() {
    super();

    this.pageTitle = `New SQL query • ${global.INSTALL.SHOP_NAME}`;
    this.editPageTitle = 'Editing SQL query';

    // Selectors
    this.sqlQueryNameInput = '#sql_request_name';
    this.sqlQueryTextArea = '#sql_request_sql';
    this.saveButton = '#sql-query-save-btn';
  }

  /*
  Methods
   */

  /**
   * Fill form for add/edit sql query
   * @param page {Page} Browser tab
   * @param sqlQueryData {FakerSqlQuery} Data to set on create/edit sql query
   * @returns {Promise<string>}
   */
  async createEditSQLQuery(page: Page, sqlQueryData: FakerSqlQuery): Promise<string> {
    await this.setValue(page, this.sqlQueryNameInput, sqlQueryData.name);
    await this.setValue(page, this.sqlQueryTextArea, sqlQueryData.sqlQuery);
    await this.clickAndWaitForURL(page, this.saveButton);
    return this.getAlertSuccessBlockParagraphContent(page);
  }
}

export default new AddSQLQuery();
