<?php
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

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Context;

use Cookie;
use PrestaShop\PrestaShop\Core\Domain\Shop\ValueObject\ShopConstraint;

class CookieContext
{
    private ShopConstraint $shopConstraint;

    public function __construct(
        private readonly Cookie $cookie
    ) {
        if (!$this->cookie->shopContext) {
            $this->shopConstraint = ShopConstraint::allShops();
        } else {
            $splitShopContext = explode('-', $this->cookie->shopContext);
            if (count($splitShopContext) == 2) {
                $splitShopType = $splitShopContext[0];
                $splitShopValue = (int) $splitShopContext[1];
                if ($splitShopType == 'g') {
                    $this->shopConstraint = ShopConstraint::shopGroup($splitShopValue);
                } else {
                    $this->shopConstraint = ShopConstraint::shop($splitShopValue);
                }
            } else {
                $this->shopConstraint = ShopConstraint::allShops();
            }
        }
    }

    public function getShopConstraint(): ShopConstraint
    {
        return $this->shopConstraint;
    }

    public function getEmployeeId(): int
    {
        return $this->cookie->id_employee ? (int) $this->cookie->id_employee : 0;
    }
}
