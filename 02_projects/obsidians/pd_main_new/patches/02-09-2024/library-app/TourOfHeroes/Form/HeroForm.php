<?php
namespace App\TourOfHeroes\Form;

use App_Form;
use Zend_Filter_StringTrim;
use Zend_Form_Element_Text;
use Zend_Validate_StringLength;

class HeroForm extends App_Form
{
    public function init()
    {
        parent::init();

        $this->addElement(
            new Zend_Form_Element_Text(
                'name',
                [
                    'required' => true,
                    'filters'  => [
                        new Zend_Filter_StringTrim(),
                    ],
                    'validators' => [
                        new Zend_Validate_StringLength(['min' => 3, 'max' => 255]),
                    ],
                ]
            )
        );

    }

}