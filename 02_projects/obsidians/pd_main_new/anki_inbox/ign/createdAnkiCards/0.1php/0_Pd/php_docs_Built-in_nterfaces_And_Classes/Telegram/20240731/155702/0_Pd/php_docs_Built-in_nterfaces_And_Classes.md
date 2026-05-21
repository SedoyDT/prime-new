
# Начало карточки

<!-- basicblock-start oid="ObsKjT8TznwYz7tOzuagjdCA"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Что можно сказать про интерфейс SplSubject?::


Интерфейс SplSubject используется совместно с SplObserver для реализации шаблона проектирования Наблюдатель (Observer). 

```

 interface SplSubject {
/* Методы */
public attach(SplObserver $observer): void
public detach(SplObserver $observer): void
public notify(): void
}

```

    SplSubject::attach — Присоединить наблюдателя (объект класса SplObserver)
    SplSubject::detach — Отсоединить наблюдателя
    SplSubject::notify — Уведомить наблюдателя
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про интерфейс SplSubject?

Интерфейс SplSubject используется совместно с SplObserver для реализации шаблона проектирования Наблюдатель (Observer). 

```

 interface SplSubject {
/* Методы */
public attach(SplObserver $observer): void
public detach(SplObserver $observer): void
public notify(): void
}

```

    SplSubject::attach — Присоединить наблюдателя (объект класса SplObserver)
    SplSubject::detach — Отсоединить наблюдателя
    SplSubject::notify — Уведомить наблюдателя



