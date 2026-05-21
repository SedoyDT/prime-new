Analitics_ManagersBlocks_Filter_Index.prototype.showTransferForm = function (rowId) {  
    (new Analitics_ManagersBlocks_Transfer_Form({  
        ddmRowId: rowId,  
        managersBlocksFilter: this.controller  
    })).updateState().show();  
};

