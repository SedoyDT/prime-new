
#P_patterns
#patterns

#telegram 

# Покажи пример паттерна стратегия на php?
<!-- basicblock-start oid="ObsBRB50CY5EUNXyj8mGfIha"  deck='P_patterns' -->
Покажи пример паттерна стратегия на php?::


Определяем интерфейс с методом расчета, который будет реализован для каждой стратегии
```
<?php

// Сначала определим интерфейс, который будет определять метод
interface ShippingStrategy {
    public function calculateCost(int $weight, int $distanse): float;
}
```
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# Покажи пример паттерна стратегия на php?
<!-- basicblock-start oid="ObskSjgyf4QKlO2NcoInLMGM"  deck='P_patterns' -->
Покажи пример паттерна стратегия на php?::


Определяем интерфейс с методом расчета, который будет реализован для каждой стратегии
types.php
```
<?php

// Сначала определим интерфейс, который будет определять метод
interface ShippingStrategy {
    public function calculateCost(int $weight, int $distanse): float;
}

```

Определяем классы которые реализуют этот интерфейс и создают уникальную для каждого класса(каждой стратегии) реализацию метода <— в этом и суть

classes.php
```
require_once "types.php"

class RegularShipping implements ShippingStrategy {
    public function calculateCost(int $weight, int $distance) {
        return $weight * $distance; 
    }
}

class ExpressShipping implements ShippingStrategy {
   public function calculateCost(int $weight, int $distance) {
       return $weight * $distance * 1,1;
   }
}

class InternationalShippting implements ShippingStrategy {
    public function calculateCost(int $weight, int $distance) {
       return $weight * $distance * 1,2;
   }
}

```

ShippingConstCalculator 

```

class ShippingConstCalculator  
{
    private $shippingStrategy;

    public function _construct(ShippingStrategy $shippingStrategy) {
        $this->shippingStrategy = $shippingStrategy;
   }

   public function setStrategy(ShippingStrategy $shippingStrategy) {
        $this->shippingStrategy = $shippingStrategy;
   }
   
}
```

index.php

```
require_once "types.php";
require_once "ShippingConstCalculator.php";

$calculator = new ShippingConstCalculator(new RegularShipping);
$calculator->calculateCost(2,3); // 6

$calculator->setStrategy(new ExpressShipping());
$calculator->calculateCost(2,5); // 11

$calculator->setStrategy(new InternationalShipping());
$calculator->calculateCost(2,5); // 12\
```
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# Покажи пример паттерна стратегия на php?
<!-- basicblock-start oid="Obs42HxJOmgegCrXYJqdTVci"  deck='P_patterns' -->
Покажи пример паттерна стратегия на php?::


Определяем интерфейс с методом расчета, который будет реализован для каждой стратегии
types.php
```
<?php

// Сначала определим интерфейс, который будет определять метод
interface ShippingStrategy {
    public function calculateCost(int $weight, int $distanse): float;
}

```

Определяем классы которые реализуют этот интерфейс и создают уникальную для каждого класса(каждой стратегии) реализацию метода <— в этом и суть

classes.php
```
require_once "types.php"

class RegularShipping implements ShippingStrategy {
    public function calculateCost(int $weight, int $distance) {
        return $weight * $distance; 
    }
}

class ExpressShipping implements ShippingStrategy {
   public function calculateCost(int $weight, int $distance) {
       return $weight * $distance * 1,1;
   }
}

class InternationalShippting implements ShippingStrategy {
    public function calculateCost(int $weight, int $distance) {
       return $weight * $distance * 1,2;
   }
}

```

ShippingConstCalculator 

```

class ShippingConstCalculator  
{
    private $shippingStrategy;

    public function _construct(ShippingStrategy $shippingStrategy) {
        $this->shippingStrategy = $shippingStrategy;
   }

   public function setStrategy(ShippingStrategy $shippingStrategy) {
        $this->shippingStrategy = $shippingStrategy;
   }
   
}
```

index.php

```
require_once "types.php";
require_once "ShippingConstCalculator.php";

$calculator = new ShippingConstCalculator(new RegularShipping);
$calculator->calculateCost(2,3); // 6

$calculator->setStrategy(new ExpressShipping());
```
<!-- basicblock-end -->



