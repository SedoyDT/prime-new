<?php


/**
 *Observer Pattern
 *SplSubject class (Observable)
 *Класс субъекта для хранения наблюдателей
 */


class App_Cascade_Updater implements SplSubject
{
    
    private $_storage;
    
    
    public function __construct()
    {
        $this->_storage = new SplObjectStorage();
    }
    
    
    /**
     *Attach observer
     */
    public function attach(SplObserver $observer)
    {
        $this->_storage->attach($observer);
    }
    
    
    /**
     *Detach observer
     */
    public function detach(SplObserver $observer)
    {
        $this->_storage->detach($observer);
    }
    
    
    /**
     *Notify all observers
     */
    public function notify()
    {
        foreach($this->_storage as $object) {
            $object->update($this);
        }
    }

}