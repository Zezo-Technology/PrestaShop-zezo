/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

import DeleteCategoryRowActionExtension
  from '@components/grid/extension/action/row/category/delete-category-row-action-extension';
import ShowcaseCard from '@components/showcase-card/showcase-card';
import ShowcaseCardCloseExtension from '@components/showcase-card/extension/showcase-card-close-extension';

const {$} = window;

$(() => {
  const emptyCategoriesGrid = new window.prestashop.component.Grid('empty_category');

  emptyCategoriesGrid.addExtension(new window.prestashop.component.GridExtensions.FiltersResetExtension());
  emptyCategoriesGrid.addExtension(new window.prestashop.component.GridExtensions.SortingExtension());
  emptyCategoriesGrid.addExtension(new window.prestashop.component.GridExtensions.ReloadListExtension());
  emptyCategoriesGrid.addExtension(new window.prestashop.component.GridExtensions.SubmitRowActionExtension());
  emptyCategoriesGrid.addExtension(new window.prestashop.component.GridExtensions.LinkRowActionExtension());
  emptyCategoriesGrid.addExtension(new window.prestashop.component.GridExtensions.AsyncToggleColumnExtension());
  emptyCategoriesGrid.addExtension(new DeleteCategoryRowActionExtension());
  emptyCategoriesGrid.addExtension(new window.prestashop.component.GridExtensions.FiltersSubmitButtonEnablerExtension());

  [
    'no_qty_product_with_combination',
    'no_qty_product_without_combination',
    'disabled_product',
    'product_without_image',
    'product_without_description',
    'product_without_price',
  ].forEach((gridName) => {
    const grid = new window.prestashop.component.Grid(gridName);

    grid.addExtension(new window.prestashop.component.GridExtensions.SortingExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.ExportToSqlManagerExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.ReloadListExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.FiltersResetExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.AsyncToggleColumnExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.SubmitRowActionExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.BulkActionCheckboxExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.SubmitBulkActionExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.LinkRowActionExtension());
    grid.addExtension(new window.prestashop.component.GridExtensions.FiltersSubmitButtonEnablerExtension());
  });

  const showcaseCard = new ShowcaseCard('monitoringShowcaseCard');
  showcaseCard.addExtension(new ShowcaseCardCloseExtension());
});
