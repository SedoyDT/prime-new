---
created: 2024-02-17T17:17:16 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/api/2.0/yii-web-application
author: 
tags:
 - web
 - firefox
---
[[books/2024-02-17]]
[[20240217-1719]]
# Application, yii\web\Application | API Documentation for Yii 2.0 | Yii PHP Framework

> ## Excerpt
> Hide inherited methods

---
[Hide inherited methods](https://www.yiiframework.com/doc/api/2.0/yii-web-application#)

**Defined in:** [yii\\base\\Component::\_\_call()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#__call()-detail)

**Calls the named method which is not a class method.**

This method will check if any attached behavior has the named method and will execute it if available.

Do not call this method directly as it is a PHP magic method that will be implicitly called when an unknown method is being invoked.

<table><tbody><tr><td colspan="3"><span>public</span> <span>mixed</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#__call()-detail">__call</a></strong> ( <span>$name</span>, <span>$params</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The method name</p></td></tr><tr><td><span>$params</span></td><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>Method parameters</p></td></tr><tr><th>return</th><td>mixed</td><td><p>The method return value</p></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-unknownmethodexception">yii\base\UnknownMethodException</a></td><td><p>when calling unknown method</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::\_\_clone()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#__clone()-detail)

**This method is called after the object is created by cloning an existing one.**

It removes all behaviors because they are attached to the old object.

Source code

<table><tbody><tr><td colspan="3"><span>public</span> <span>mixed</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#__get()-detail">__get</a></strong> ( <span>$name</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>Component or property name</p></td></tr><tr><th>return</th><td>mixed</td><td><p>The named property value</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::\_\_set()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#__set()-detail)

**Sets the value of a component property.**

This method will check in the following order and act accordingly:

-   a property defined by a setter: set the property value
-   an event in the format of "on xyz": attach the handler to the event "xyz"
-   a behavior in the format of "as xyz": attach the behavior named as "xyz"
-   a property of a behavior: set the behavior property value

Do not call this method directly as it is a PHP magic method that will be implicitly called when executing `$component->property = $value;`.

See also [\_\_get()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#__get()-detail).

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#__set()-detail">__set</a></strong> ( <span>$name</span>, <span>$value</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The property name or the event name</p></td></tr><tr><td><span>$value</span></td><td>mixed</td><td><p>The property value</p></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-unknownpropertyexception">yii\base\UnknownPropertyException</a></td><td><p>if the property is not defined</p></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-invalidcallexception">yii\base\InvalidCallException</a></td><td><p>if the property is read-only.</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Module::afterAction()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#afterAction()-detail)

**This method is invoked right after an action within this module is executed.**

The method will trigger the [EVENT\_AFTER\_ACTION](https://www.yiiframework.com/doc/api/2.0/yii-base-module#EVENT_AFTER_ACTION-detail) event. The return value of the method will be used as the action return value.

If you override this method, your code should look like the following:

```php
public function afterAction($action, $result) { $result = parent::afterAction($action, $result); // your custom code here return $result; }
```

<table><tbody><tr><td colspan="3"><span>public</span> <span>mixed</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#afterAction()-detail">afterAction</a></strong> ( <span>$action</span>, <span>$result</span> )</td></tr><tr><td><span>$action</span></td><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-action">yii\base\Action</a></td><td><p>The action just executed.</p></td></tr><tr><td><span>$result</span></td><td>mixed</td><td><p>The action return result.</p></td></tr><tr><th>return</th><td>mixed</td><td><p>The processed action result.</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Module::beforeAction()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#beforeAction()-detail)

**This method is invoked right before an action within this module is executed.**

The method will trigger the [EVENT\_BEFORE\_ACTION](https://www.yiiframework.com/doc/api/2.0/yii-base-module#EVENT_BEFORE_ACTION-detail) event. The return value of the method will determine whether the action should continue to run.

In case the action should not run, the request should be handled inside of the `beforeAction` code by either providing the necessary output or redirecting the request. Otherwise the response will be empty.

If you override this method, your code should look like the following:

```php
public function beforeAction($action) { if (!parent::beforeAction($action)) { return false; } // your custom code here return true; // or false to not run the action }
```

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#beforeAction()-detail">beforeAction</a></strong> ( <span>$action</span> )</td></tr><tr><td><span>$action</span></td><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-action">yii\base\Action</a></td><td><p>The action to be executed.</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the action should continue to be executed.</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::behaviors()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#behaviors()-detail)

**Returns a list of behaviors that this component should behave as.**

Child classes may override this method to specify the behaviors they want to behave as.

The return value of this method should be an array of behavior objects or configurations indexed by behavior names. A behavior configuration can be either a string specifying the behavior class or an array of the following structure:

```php
'behaviorName' => [ 'class' => 'BehaviorClass', 'property1' => 'value1', 'property2' => 'value2', ]
```

Note that a behavior class must extend from [yii\\base\\Behavior](https://www.yiiframework.com/doc/api/2.0/yii-base-behavior). Behaviors can be attached using a name or anonymously. When a name is used as the array key, using this name, the behavior can later be retrieved using [getBehavior()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#getBehavior()-detail) or be detached using [detachBehavior()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#detachBehavior()-detail). Anonymous behaviors can not be retrieved or detached.

Behaviors declared in this method will be attached to the component automatically (on demand).

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.array">array</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#behaviors()-detail">behaviors</a></strong> ( )</td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>The behavior configurations.</p></td></tr></tbody></table>

Source code

**Initializes extensions and executes bootstrap components.**

This method is called by [init()](https://www.yiiframework.com/doc/api/2.0/yii-base-application#init()-detail) after the application has been fully configured. If you override this method, make sure you also call the parent implementation.

Source code

**Defined in:** [yii\\base\\Component::canGetProperty()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#canGetProperty()-detail)

**Returns a value indicating whether a property can be read.**

A property can be read if:

-   the class has a getter method associated with the specified name (in this case, property name is case-insensitive);
-   the class has a member variable with the specified name (when `$checkVars` is true);
-   an attached behavior has a readable property of the given name (when `$checkBehaviors` is true).

See also [canSetProperty()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#canSetProperty()-detail).

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#canGetProperty()-detail">canGetProperty</a></strong> ( <span>$name</span>, <span>$checkVars&nbsp;</span><span>=&nbsp;</span><span>true</span>, <span>$checkBehaviors&nbsp;</span><span>=&nbsp;</span><span>true</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The property name</p></td></tr><tr><td><span>$checkVars</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to treat member variables as properties</p></td></tr><tr><td><span>$checkBehaviors</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to treat behaviors' properties as properties of this component</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the property can be read</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::canSetProperty()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#canSetProperty()-detail)

**Returns a value indicating whether a property can be set.**

A property can be written if:

-   the class has a setter method associated with the specified name (in this case, property name is case-insensitive);
-   the class has a member variable with the specified name (when `$checkVars` is true);
-   an attached behavior has a writable property of the given name (when `$checkBehaviors` is true).

See also [canGetProperty()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#canGetProperty()-detail).

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#canSetProperty()-detail">canSetProperty</a></strong> ( <span>$name</span>, <span>$checkVars&nbsp;</span><span>=&nbsp;</span><span>true</span>, <span>$checkBehaviors&nbsp;</span><span>=&nbsp;</span><span>true</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The property name</p></td></tr><tr><td><span>$checkVars</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to treat member variables as properties</p></td></tr><tr><td><span>$checkBehaviors</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to treat behaviors' properties as properties of this component</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the property can be written</p></td></tr></tbody></table>

Source code

**Deprecated since 2.0.14. On PHP >=5.5, use `::class` instead.**

<table><tbody><tr><td colspan="3"><span>public static</span> <span><a href="https://www.php.net/language.types.string">string</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-baseobject#className()-detail">className</a></strong> ( )</td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The fully qualified name of this class.</p></td></tr></tbody></table>

Source code

**Returns the configuration of core application components.**

Source code

**Defined in:** [yii\\base\\Module::createController()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#createController()-detail)

**Creates a controller instance based on the given route.**

The route should be relative to this module. The method implements the following algorithm to resolve the given route:

1.  If the route is empty, use [$defaultRoute](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$defaultRoute-detail);
2.  If the first segment of the route is found in [$controllerMap](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$controllerMap-detail), create a controller based on the corresponding configuration found in [$controllerMap](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$controllerMap-detail);
3.  If the first segment of the route is a valid module ID as declared in [$modules](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$modules-detail), call the module's `createController()` with the rest part of the route;
4.  The given route is in the format of `abc/def/xyz`. Try either `abc\DefController` or `abc\def\XyzController` class within the [controller namespace](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$controllerNamespace-detail).

If any of the above steps resolves into a controller, it is returned together with the rest part of the route which will be treated as the action ID. Otherwise, `false` will be returned.

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.array">array</a>|<a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#createController()-detail">createController</a></strong> ( <span>$route</span> )</td></tr><tr><td><span>$route</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The route consisting of module, controller and action IDs.</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.array">array</a>|<a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>If the controller is created successfully, it will be returned together with the requested action ID. Otherwise <code>false</code> will be returned.</p></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-invalidconfigexception">yii\base\InvalidConfigException</a></td><td><p>if the controller class and its file do not match.</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Application::end()](https://www.yiiframework.com/doc/api/2.0/yii-base-application#end()-detail)

**Terminates the application.**

This method replaces the `exit()` function by ensuring the application life cycle is completed before terminating the application.

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-application#end()-detail">end</a></strong> ( <span>$status&nbsp;</span><span>=&nbsp;</span><span>0</span>, <span>$response&nbsp;</span><span>=&nbsp;</span><span>null</span> )</td></tr><tr><td><span>$status</span></td><td><a href="https://www.php.net/language.types.integer">integer</a></td><td><p>The exit status (value 0 means normal exit while other values mean abnormal exit).</p></td></tr><tr><td><span>$response</span></td><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-response">yii\base\Response</a>|<a href="https://www.php.net/language.types.null">null</a></td><td><p>The response to be sent. If not set, the default application <a href="https://www.yiiframework.com/doc/api/2.0/yii-base-application#$response-detail">$response</a> component will be used.</p></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-exitexception">yii\base\ExitException</a></td><td><p>if the application is in testing mode</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Module::get()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#get()-detail)

**Returns the component instance with the specified ID.**

Since version 2.0.13, if a component isn't defined in the module, it will be looked up in the parent module. The parent module may be the application.

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.object">object</a>|<a href="https://www.php.net/language.types.null">null</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#get()-detail">get</a></strong> ( <span>$id</span>, <span>$throwException&nbsp;</span><span>=&nbsp;</span><span>true</span> )</td></tr><tr><td><span>$id</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>Component ID (e.g. <code>db</code>).</p></td></tr><tr><td><span>$throwException</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to throw an exception if <code>$id</code> is not registered with the locator before.</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.object">object</a>|<a href="https://www.php.net/language.types.null">null</a></td><td><p>The component of the specified ID. If <code>$throwException</code> is false and <code>$id</code> is not registered before, null will be returned.</p></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-invalidconfigexception">yii\base\InvalidConfigException</a></td><td><p>if <code>$id</code> refers to a nonexistent component ID</p></td></tr></tbody></table>

Source code

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.array">array</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#getComponents()-detail">getComponents</a></strong> ( <span>$returnDefinitions&nbsp;</span><span>=&nbsp;</span><span>true</span> )</td></tr><tr><td><span>$returnDefinitions</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to return component definitions instead of the loaded component instances.</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>The list of the component definitions or the loaded component instances (ID =&gt; definition or instance).</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Module::getInstance()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#getInstance()-detail)

**Returns the currently requested instance of this module class.**

If the module class is not currently requested, `null` will be returned. This method is provided so that you access the module instance from anywhere within the module.

<table><tbody><tr><td colspan="3"><span>public static</span> <span>static|<a href="https://www.php.net/language.types.null">null</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#getInstance()-detail">getInstance</a></strong> ( )</td></tr><tr><th>return</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module">yii\base\Module</a>|<a href="https://www.php.net/language.types.null">null</a></td><td><p>The currently requested instance of this module class, or <code>null</code> if the module class is not requested.</p></td></tr></tbody></table>

Source code

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.array">array</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#getModules()-detail">getModules</a></strong> ( <span>$loadedOnly&nbsp;</span><span>=&nbsp;</span><span>false</span> )</td></tr><tr><td><span>$loadedOnly</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to return the loaded sub-modules only. If this is set <code>false</code>, then all sub-modules registered in this module will be returned, whether they are loaded or not. Loaded modules will be returned as objects, while unloaded modules as configuration arrays.</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>The modules (indexed by their IDs).</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Module::has()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#has()-detail)

**Returns a value indicating whether the locator has the specified component definition or has instantiated the component.**

Since version 2.0.13, if a component isn't defined in the module, it will be looked up in the parent module. The parent module may be the application.

This method may return different results depending on the value of `$checkInstance`.

-   If `$checkInstance` is false (default), the method will return a value indicating whether the locator has the specified component definition.
-   If `$checkInstance` is true, the method will return a value indicating whether the locator has instantiated the specified component.

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#has()-detail">has</a></strong> ( <span>$id</span>, <span>$checkInstance&nbsp;</span><span>=&nbsp;</span><span>false</span> )</td></tr><tr><td><span>$id</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>Component ID (e.g. <code>db</code>).</p></td></tr><tr><td><span>$checkInstance</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the method should check if the component is shared and instantiated.</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the locator has the specified component definition or has instantiated the component.</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::hasMethod()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#hasMethod()-detail)

**Returns a value indicating whether a method is defined.**

A method is defined if:

-   the class has a method with the specified name
-   an attached behavior has a method with the given name (when `$checkBehaviors` is true).

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#hasMethod()-detail">hasMethod</a></strong> ( <span>$name</span>, <span>$checkBehaviors&nbsp;</span><span>=&nbsp;</span><span>true</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The property name</p></td></tr><tr><td><span>$checkBehaviors</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to treat behaviors' methods as methods of this component</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the method is defined</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Module::hasModule()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#hasModule()-detail)

**Checks whether the child module of the specified ID exists.**

This method supports checking the existence of both child and grand child modules.

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#hasModule()-detail">hasModule</a></strong> ( <span>$id</span> )</td></tr><tr><td><span>$id</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>Module ID. For grand child modules, use ID path relative to this module (e.g. <code>admin/content</code>).</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the named module exists. Both loaded and unloaded modules are considered.</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::hasProperty()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#hasProperty()-detail)

**Returns a value indicating whether a property is defined for this component.**

A property is defined if:

-   the class has a getter or setter method associated with the specified name (in this case, property name is case-insensitive);
-   the class has a member variable with the specified name (when `$checkVars` is true);
-   an attached behavior has a property of the given name (when `$checkBehaviors` is true).

See also:

-   [canGetProperty()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#canGetProperty()-detail)
-   [canSetProperty()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#canSetProperty()-detail)

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#hasProperty()-detail">hasProperty</a></strong> ( <span>$name</span>, <span>$checkVars&nbsp;</span><span>=&nbsp;</span><span>true</span>, <span>$checkBehaviors&nbsp;</span><span>=&nbsp;</span><span>true</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The property name</p></td></tr><tr><td><span>$checkVars</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to treat member variables as properties</p></td></tr><tr><td><span>$checkBehaviors</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to treat behaviors' properties as properties of this component</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether the property is defined</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Application::init()](https://www.yiiframework.com/doc/api/2.0/yii-base-application#init()-detail)

**Initializes the module.**

This method is called after the module is created and initialized with property values given in configuration. The default implementation will initialize [$controllerNamespace](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$controllerNamespace-detail) if it is not set.

If you override this method, please make sure you call the parent implementation.

Source code

**Defined in:** [yii\\base\\Component::off()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#off()-detail)

**Detaches an existing event handler from this component.**

This method is the opposite of [on()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#on()-detail).

Note: in case wildcard pattern is passed for event name, only the handlers registered with this wildcard will be removed, while handlers registered with plain names matching this wildcard will remain.

See also [on()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#on()-detail).

<table><tbody><tr><td colspan="3"><span>public</span> <span><a href="https://www.php.net/language.types.boolean">boolean</a></span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#off()-detail">off</a></strong> ( <span>$name</span>, <span>$handler&nbsp;</span><span>=&nbsp;</span><span>null</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>Event name</p></td></tr><tr><td><span>$handler</span></td><td><a href="https://www.php.net/language.types.callable">callable</a>|<a href="https://www.php.net/language.types.null">null</a></td><td><p>The event handler to be removed. If it is null, all handlers attached to the named event will be removed.</p></td></tr><tr><th>return</th><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>If a handler is found and detached</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::on()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#on()-detail)

**Attaches an event handler to an event.**

The event handler must be a valid PHP callback. The following are some examples:

```
<span><span>function</span> <span>($event)</span> </span>{ ... }         <span>// anonymous function</span>
[$object, <span>'handleClick'</span>]          <span>// $object-&gt;handleClick()</span>
[<span>'Page'</span>, <span>'handleClick'</span>]           <span>// Page::handleClick()</span>
<span>'handleClick'</span>                     <span>// global function handleClick()</span>
```

The event handler must be defined with the following signature,

```
<span><span>function</span> <span>($event)</span>
</span>
```

where `$event` is an [yii\\base\\Event](https://www.yiiframework.com/doc/api/2.0/yii-base-event) object which includes parameters associated with the event.

Since 2.0.14 you can specify event name as a wildcard pattern:

```php
$component->on('event.group.*', function ($event) { Yii::trace($event->name . ' is triggered.'); });
```

See also [off()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#off()-detail).

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-component#on()-detail">on</a></strong> ( <span>$name</span>, <span>$handler</span>, <span>$data&nbsp;</span><span>=&nbsp;</span><span>null</span>, <span>$append&nbsp;</span><span>=&nbsp;</span><span>true</span> )</td></tr><tr><td><span>$name</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The event name</p></td></tr><tr><td><span>$handler</span></td><td><a href="https://www.php.net/language.types.callable">callable</a></td><td><p>The event handler</p></td></tr><tr><td><span>$data</span></td><td>mixed</td><td><p>The data to be passed to the event handler when the event is triggered. When the event handler is invoked, this data can be accessed via <a href="https://www.yiiframework.com/doc/api/2.0/yii-base-event#$data-detail">yii\base\Event::$data</a>.</p></td></tr><tr><td><span>$append</span></td><td><a href="https://www.php.net/language.types.boolean">boolean</a></td><td><p>Whether to append new event handler to the end of the existing handler list. If false, the new handler will be inserted at the beginning of the existing handler list.</p></td></tr></tbody></table>

Source code

<table><tbody><tr><td colspan="3"><span>public</span> <span>mixed</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#runAction()-detail">runAction</a></strong> ( <span>$route</span>, <span>$params&nbsp;</span><span>=&nbsp;[]</span> )</td></tr><tr><td><span>$route</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>The route that specifies the action.</p></td></tr><tr><td><span>$params</span></td><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>The parameters to be passed to the action</p></td></tr><tr><th>return</th><td>mixed</td><td><p>The result of the action.</p></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-invalidrouteexception">yii\base\InvalidRouteException</a></td><td><p>if the requested route cannot be resolved into an action successfully.</p></td></tr></tbody></table>

Source code

**Defined in:** [yii\\di\\ServiceLocator::set()](https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#set()-detail)

**Registers a component definition with this locator.**

For example,

```php
// a class name $locator->set('cache', 'yii\caching\FileCache'); // a configuration array $locator->set('db', [ 'class' => 'yii\db\Connection', 'dsn' => 'mysql:host=127.0.0.1;dbname=demo', 'username' => 'root', 'password' => '', 'charset' => 'utf8', ]); // an anonymous function $locator->set('cache', function ($params) { return new \yii\caching\FileCache; }); // an instance $locator->set('cache', new \yii\caching\FileCache);
```

If a component definition with the same ID already exists, it will be overwritten.

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#set()-detail">set</a></strong> ( <span>$id</span>, <span>$definition</span> )</td></tr><tr><td><span>$id</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>Component ID (e.g. <code>db</code>).</p></td></tr><tr><td><span>$definition</span></td><td>mixed</td><td><p>The component definition to be registered with this locator. It can be one of the following:</p><ul><li>a class name</li><li>a configuration array: the array contains name-value pairs that will be used to initialize the property values of the newly created object when <a href="https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#get()-detail">get()</a> is called. The <code>class</code> element is required and stands for the the class of the object to be created.</li><li>a PHP callable: either an anonymous function or an array representing a class method (e.g. <code>['Foo', 'bar']</code>). The callable will be called by <a href="https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#get()-detail">get()</a> to return an object associated with the specified component ID.</li><li>an object: When <a href="https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#get()-detail">get()</a> is called, this object will be returned.</li></ul></td></tr><tr><th>throws</th><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-invalidconfigexception">yii\base\InvalidConfigException</a></td><td><p>if the definition is an invalid configuration array</p></td></tr></tbody></table>

Source code

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#setAliases()-detail">setAliases</a></strong> ( <span>$aliases</span> )</td></tr><tr><td><span>$aliases</span></td><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>List of path aliases to be defined. The array keys are alias names (must start with <code>@</code>) and the array values are the corresponding paths or aliases. For example,</p><pre></pre></td></tr></tbody></table>

Source code

**Defined in:** [yii\\di\\ServiceLocator::setComponents()](https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#setComponents()-detail)

**Registers a set of component definitions in this locator.**

This is the bulk version of [set()](https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#set()-detail). The parameter should be an array whose keys are component IDs and values the corresponding component definitions.

For more details on how to specify component IDs and definitions, please refer to [set()](https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#set()-detail).

If a component definition with the same ID already exists, it will be overwritten.

The following is an example for registering two component definitions:

```php
[ 'db' => [ 'class' => 'yii\db\Connection', 'dsn' => 'sqlite:path/to/file.db', ], 'cache' => [ 'class' => 'yii\caching\DbCache', 'db' => 'db', ], ]
```

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#setComponents()-detail">setComponents</a></strong> ( <span>$components</span> )</td></tr><tr><td><span>$components</span></td><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>Component definitions or instances</p></td></tr></tbody></table>

Source code

<table><tbody><tr><td colspan="3"><span>public static</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#setInstance()-detail">setInstance</a></strong> ( <span>$instance</span> )</td></tr><tr><td><span>$instance</span></td><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module">yii\base\Module</a>|<a href="https://www.php.net/language.types.null">null</a></td><td><p>The currently requested instance of this module class. If it is <code>null</code>, the instance of the calling class will be removed, if any.</p></td></tr></tbody></table>

Source code

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#setModule()-detail">setModule</a></strong> ( <span>$id</span>, <span>$module</span> )</td></tr><tr><td><span>$id</span></td><td><a href="https://www.php.net/language.types.string">string</a></td><td><p>Module ID.</p></td></tr><tr><td><span>$module</span></td><td><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module">yii\base\Module</a>|<a href="https://www.php.net/language.types.array">array</a>|<a href="https://www.php.net/language.types.null">null</a></td><td><p>The sub-module to be added to this module. This can be one of the following:</p><ul><li>a <a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module">yii\base\Module</a> object</li><li>a configuration array: when <a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#getModule()-detail">getModule()</a> is called initially, the array will be used to instantiate the sub-module</li><li><code>null</code>: the named sub-module will be removed from this module</li></ul></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Module::setModules()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#setModules()-detail)

**Registers sub-modules in the current module.**

Each sub-module should be specified as a name-value pair, where name refers to the ID of the module and value the module or a configuration array that can be used to create the module. In the latter case, [Yii::createObject()](https://www.yiiframework.com/doc/api/2.0/yii-baseyii#createObject()-detail) will be used to create the module.

If a new sub-module has the same ID as an existing one, the existing one will be overwritten silently.

The following is an example for registering two sub-modules:

```php
[ 'comment' => [ 'class' => 'app\modules\comment\CommentModule', 'db' => 'db', ], 'booking' => ['class' => 'app\modules\booking\BookingModule'], ]
```

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#setModules()-detail">setModules</a></strong> ( <span>$modules</span> )</td></tr><tr><td><span>$modules</span></td><td><a href="https://www.php.net/language.types.array">array</a></td><td><p>Modules (id =&gt; module configuration or instances).</p></td></tr></tbody></table>

Source code

<table><tbody><tr><td colspan="3"><span>public</span> <span>void</span> <strong><a href="https://www.yiiframework.com/doc/api/2.0/yii-base-module#setVersion()-detail">setVersion</a></strong> ( <span>$version</span> )</td></tr><tr><td><span>$version</span></td><td><a href="https://www.php.net/language.types.string">string</a>|<a href="https://www.php.net/language.types.callable">callable</a>|<a href="https://www.php.net/language.types.null">null</a></td><td><p>The version of this module. Version can be specified as a PHP callback, which can accept module instance as an argument and should return the actual version. For example:</p><pre></pre></td></tr></tbody></table>

Source code

**Defined in:** [yii\\base\\Component::trigger()](https://www.yiiframework.com/doc/api/2.0/yii-base-component#trigger()-detail)

**Triggers an event.**

This method represents the happening of an event. It invokes all attached handlers for the event including class-level handlers.

Source code
