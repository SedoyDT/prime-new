1. DistributionAlgorithmFacade - зачем?
	1. Возвращает значение опции "методика распределения"
2. Analitics_Model_DirectorWage_Data_Earnings
	1. сущность для хранения информации о доходах по отделу
3. Analitics_Model_DirectorWage_Data_Weight
	1. Сущность для хранения данных об отгруженном весе по отделу
4. Общее
	1. Если application/modules/analitics/models/DirectorWage/Data/Earnings.php:253 ( extends Analitics_Model_DirectorWage_Component_DataAbstract) 
		1. тут четко устанавливается значение 
		2. то код доходит до
		3. application/modules/analitics/models/DirectorWage/DataBuilder/Expense/DistributionBehaviour/DefaultBehaviour.php:47
