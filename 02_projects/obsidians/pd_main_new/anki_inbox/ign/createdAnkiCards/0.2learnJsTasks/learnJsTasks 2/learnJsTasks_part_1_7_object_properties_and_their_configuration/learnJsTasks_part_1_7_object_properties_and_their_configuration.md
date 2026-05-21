
#learnJsTasks_part_1_7_object_properties_and_their_configuration
#part_1_7_object_properties_and_their_configuration

#telegram 

# Что нужно сделать для нового свойства если оно добавляется таким образом Object.defineProperty(user, "name", {?
<!-- basicblock-start oid="ObsKmKDkOF0YHjTFUvitcVnd"  deck='learnJsTasks_part_1_7_object_properties_and_their_configuration' -->
Что нужно сделать для нового свойства если оно добавляется таким образом Object.defineProperty(user, "name", {?::


```TS
let user = { };

Object.defineProperty(user, "name", {
  value: "John",
  // для нового свойства необходимо явно указывать все флаги, для которых значение true
  enumerable: true,
  configurable: true
});

alert(user.name); // John
user.name = "Pete"; // Ошибка
<!-- basicblock-end -->




#learnJsTasks_part_1_7_object_properties_and_their_configuration
#part_1_7_object_properties_and_their_configuration

#telegram 

# Как выглядит что запрещает устанавливать свойство объекту?
<!-- basicblock-start oid="Obsl5yCfS0uxQbTnosQx0Vnf"  deck='learnJsTasks_part_1_7_object_properties_and_their_configuration' -->
Как выглядит что запрещает устанавливать свойство объекту?::


let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false
});

user.name = "Pete"; // Ошибка: Невозможно изменить доступное только для
console.log(user.name);
<!-- basicblock-end -->




#learnJsTasks_part_1_7_object_properties_and_their_configuration
#part_1_7_object_properties_and_their_configuration

#telegram 

# Что можно использовать, чтобы изменить метод Object.definePropery?
<!-- basicblock-start oid="Obshqv2ad82AWt2wyvyvnvKo"  deck='learnJsTasks_part_1_7_object_properties_and_their_configuration' -->
Что можно использовать, чтобы изменить метод Object.definePropery?::


Object.defineProperty(obj, propertyName, descriptor)
<!-- basicblock-end -->




#learnJsTasks_part_1_7_object_properties_and_their_configuration
#part_1_7_object_properties_and_their_configuration

#telegram 

# Какой метод объекта позволяет получить полную информацию о свойсте?
<!-- basicblock-start oid="Obsk8rBZ4PVYKmBqjXehwE5I"  deck='learnJsTasks_part_1_7_object_properties_and_their_configuration' -->
Какой метод объекта позволяет получить полную информацию о свойсте?::

Object.getOwnPropertyDescriptor
```javascript
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```
`obj`

Объект, из которого мы получаем информацию.

`propertyName`

Имя свойства.

<!-- basicblock-end -->




#learnJsTasks_part_1_7_object_properties_and_their_configuration
#part_1_7_object_properties_and_their_configuration

#telegram 

# Что есть у свойств объекта помимо помимо значения value?
<!-- basicblock-start oid="ObsiUjWH8i3CuMZdK1cEZ0rG"  deck='learnJsTasks_part_1_7_object_properties_and_their_configuration' -->
Что есть у свойств объекта помимо помимо значения value?::


Свойства объекта имеют три специальных атрибута (так называемые флаги)
writable - если true, свойство можно изменить, иначе оно только для чтения
enumerable - если true, совйство перечесляется  в циклах, в противном случае циклы его игнорируют
configurable - если true, свойство можно удалить, а эти атрибуты можно изменить, иначе этого делать нельзя
<!-- basicblock-end -->



