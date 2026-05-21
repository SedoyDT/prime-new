
#programming_algoTasks
#algoTasks

#telegram 

# На входе массив чисел, например: arr = [1, -2, 3, 4, -9, 6].
<!-- basicblock-start oid="ObsDGDjr0nYIoDfkBBkws61J"  deck='programming_algoTasks' -->
На входе массив чисел, например: arr = [1, -2, 3, 4, -9, 6].
Задача: найти непрерывный подмассив в arr, сумма элементов в котором максимальна.
Функция getMaxSubSum(arr) должна возвращать эту сумму.
Например:

getMaxSubSum([-1, 2, 3, -9]) == 5 (сумма выделенных элементов)
getMaxSubSum([2, -1, 2, 3, -9]) == 6
getMaxSubSum([-1, 2, 3, -9, 11]) == 11
getMaxSubSum([-2, -1, 1, 2]) == 3
getMaxSubSum([100, -9, 2, -3, 5]) == 100
getMaxSubSum([1, 2, 3]) == 6 (берём все)
Если все элементы отрицательные – ничего не берём(подмассив пустой) и сумма равна «0»:

getMaxSubSum([-1, -2, -3]) = 0
Попробуйте придумать быстрое решение: O(n2), а лучше за О(n) операций.::

```JS
function getMaxSubSum(arr) {
  let maxSum = 0;
  let partialSum = 0;
  
  for (let elem of arr) {
    partialSum += elem;
    maxSum = Math.max(partialSum,maxSum);
    if (partialSum < 0) partialSum = 0;
    
  }
  return maxSum;
}
console.log(getMaxSubSum([-1, 3, 2, 3, -9]));
console.log(getMaxSubSum([-1,3, 2, 3, -9]));
console.log(getMaxSubSum([-1, 2, 3, -9]));
console.log(getMaxSubSum([2, -1, 2, 3, -9]));
console.log(getMaxSubSum([-1, 2, 3, -9, 11]));
console.log(getMaxSubSum([-2, -1, 1, 2]));
console.log(getMaxSubSum([100, -9, 2, -3, 5]));
console.log(getMaxSubSum([1, 2, 3]));
```

https://en.wikipedia.org/wiki/Maximum_subarray_problem

<!-- basicblock-end -->



