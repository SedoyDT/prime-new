---
author: Frolov Anatolui
date: 2025-11-13
time: 16:11:40
aliases: 
- 
tags:
- unique-note
---


<?php  
/**  
 * Все права на программный код принадлежат ООО "ПИАР СИТИ" * * @author Frolov Anatolui * @date 13.11.2025 * @copyright Copyright (c) ООО "ПИАР СИТИ" project AMDSolution */  
  
namespace App\Event\SalesFunnel\Type;  
  
use App\Event\BaseSubject;  
  
class RestApiInteraction extends BaseEvent  
{  
  
  
    public function __construct(?BaseSubject $subject)  
    {  
        if (!($subject instanceof \App\Event\SalesFunnel\Subject\Lead)) {  
            throw new \InvalidArgumentException("Неправильный субъект");  
        }  
        parent::__construct($subject);  
    }  
  
    /**  
     *     * @return \App\Event\SalesFunnel\Subject\Lead | null  
     */  
    public function getSubject()  
    {  
        return parent::getSubject();  
    }  
}