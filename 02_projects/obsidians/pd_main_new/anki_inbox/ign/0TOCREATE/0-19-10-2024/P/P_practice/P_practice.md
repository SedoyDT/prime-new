
#P_practice
#practice

#telegram 

# Что делает этот код?
<!-- basicblock-start  deck='P_practice' -->
Что делает этот код?::


```
if (preg_match('/\.(?:png|jpg|jpeg|gif|js)$/', $_SERVER["REQUEST_URI"])) {
    return false;    // сервер возвращает файлы напрямую.
} else if (preg_match("/\/flowers\/(?P<sort>(asc|desc))/", $_SERVER["REQUEST_URI"],$params)) {
    sortAndDisplay($flowers, $params['sort']);
} else if (preg_match("/\/animals\/(?P<sort>(asc|desc))/", $_SERVER["REQUEST_URI"],$params)) {
    sortAndDisplay($animals, $params["sort"]);
} else if (preg_match("/\/(?P<type>(animals|flowers))\/(?P<id>(\d+))/", $_SERVER["REQUEST_URI"], $params)) {
    if ($params["type"] == "flowers") {
        getById($flowers, $params['id']);
    } else if ($params["type"] == "animals") {
        getById($animals, $params['id']);
    }
} else if (preg_match("/\/(flowers)\/(?P<name>([А-ЯЁа-яё]+))/u", urldecode($_SERVER["REQUEST_URI"]),$params)) {
    searchFlowerByName($flowers, $params['name']);
} else {
    echo layout();
}
```
<!-- basicblock-end -->



