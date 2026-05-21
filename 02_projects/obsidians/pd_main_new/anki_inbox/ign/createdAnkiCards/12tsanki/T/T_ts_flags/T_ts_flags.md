
#T_ts_flags
#ts_flags

#telegram 

# Если вы хотите аннотировать возвращаемый тип функции, которая возвращает обещание, вам следует использовать
<!-- basicblock-start oid="ObsSbdVS1uHU9DRaSQ0wrsmu"  deck='T_ts_flags' -->
Если вы хотите аннотировать возвращаемый тип функции, которая возвращает обещание, вам следует использовать::


Promise тип:
async function getFavoriteNumber(): Promise<number> {
  return 26;
}
<!-- basicblock-end -->




#T_ts_flags
#ts_flags

#telegram 

# чтобы пометить любое неявное значение any как ошибку.
<!-- basicblock-start oid="Obs3WxlLBIUsVZEdZ7xoIw5p"  deck='T_ts_flags' -->
чтобы пометить любое неявное значение any как ошибку.::


Обычно вы хотите избежать этого, потому что any не проверяется тип. Используйте флаг компилятора, noImplicitAny чтобы пометить любое неявное значение any как ошибку.
<!-- basicblock-end -->




#T_ts_flags
#ts_flags

#telegram 

# Что делает noImplicitAny?
<!-- basicblock-start oid="ObsGYLdoJzQYr66ACOucofCq"  deck='T_ts_flags' -->
Что делает noImplicitAny?::


Напомним, что в некоторых местах TypeScript не пытается определять типы для нас и вместо этого возвращается к наиболее мягкому типу: any. Это не самое худшее, что может случиться - в конце концов, возврат к any в любом случае является простым использованием JavaScript.

Однако использование any часто сводит на нет цель использования TypeScript в первую очередь. Чем более типизирована ваша программа, тем больше проверок и инструментов вы получите, а это значит, что вы столкнетесь с меньшим количеством ошибок при написании кода. Включение noImplicitAny флага выдаст ошибку для любых переменных, тип которых неявно определяется как any.
<!-- basicblock-end -->




#T_ts_flags
#ts_flags

#telegram 

# Что делает tsc --target es2015 hello.ts?
<!-- basicblock-start oid="ObsxdRf6uCDpbU0zTGpo0DkL"  deck='T_ts_flags' -->
Что делает tsc --target es2015 hello.ts?::


Позволяет установить уровень на который будет компилироваться ts
Версию ES
<!-- basicblock-end -->




#T_ts_flags
#ts_flags

#telegram 

# Что делает tsc --noEmitOnError hello.ts ?
<!-- basicblock-start oid="Obs70GYXbK9SoC6lkmNPpgH6"  deck='T_ts_flags' -->
Что делает tsc --noEmitOnError hello.ts ?::


Отменяет компиляюцию при возникновении ошибок
<!-- basicblock-end -->



