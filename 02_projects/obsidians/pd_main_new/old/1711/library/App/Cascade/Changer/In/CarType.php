<?php

/**
 * {Template_Description_Abstract}
 *
 * @author
 * @date 18.07.2018
 * @copyright {Template_Description_Copyrights}
 */

/**
 * Изменение типа машины
 */
class App_Cascade_Changer_In_CarType extends App_Cascade_Changer_Abstract
{
    protected function _doUpdate()
    {
//        echo "<pre>" . print_r($this->_changeObjectNew->car, true); echo "</pre>"; // FrolovDEBUG
//        exit();
		if ((int) $this->_changeObjectNew->car !== 1) {
            return;
        }

        $this->_buildCascadeHeader('Изменение типа машины');
?>
            <tr>
                <td class="aClientClaimId" style="border: 1px solid #FFFFFF;">
                    Было: <?php echo $this->_oldValue;?>
                </td>
            </tr>
            <tr>
                <td class="aClientClaimId" style="border: 1px solid #FFFFFF;">
                    Стало: <?php echo $this->_newValue;?>
                </td>
            </tr>
        </table>
<?php
        $this->_changeCarType();
    }


    /**
     * Изменение даты в заявке
     * @return void
     */
    protected function _changeCarType()
    {
        App_Db_Claims::obtain()->update(
            ['car_type' => $this->_newValue],
            ['id = ?' => $this->_changeObject->claimId]
        );
    }
}
