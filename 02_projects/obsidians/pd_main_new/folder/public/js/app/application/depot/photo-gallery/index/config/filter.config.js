define(["require", "exports", "../../../../../core/service/depot-config.service"], function (require, exports, depot_config_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.filterConfig = void 0;
    const depotConfig = new depot_config_service_1.default();
    exports.filterConfig = {
        striped: true,
        attributes: {},
        fields: [
            {
                name: 'id',
                sort: true,
                caption: `Склад`,
                template: `
<!--filename-->
                <img title="ID товара: 2777" class="getSlider detailed-photo-placeholder" src="{{row.filename}}" data-itemid="2777" data-claimid="204463" data-id="1" width="106" height="150">

            `
            },
            {
                name: 'id',
                sort: true,
                caption: `Наше производство/ покупное`
            },
            {
                name: 'filename',
                sort: true,
                caption: `Наименование`
            },
            {
                name: 'id',
                sort: true,
                caption: `Назначение`
            },
            {
                name: 'id',
                sort: true,
                caption: `Размер`
            },
            {
                name: 'id',
                sort: true,
                caption: `Диаметр`
            },
            {
                name: 'id',
                sort: true,
                caption: `Модель`
            },
            {
                name: 'id',
                sort: true,
                caption: `Обозначение`
            },
            {
                name: 'id',
                sort: true,
                caption: `Текущая бц`
            },
            {
                name: 'id',
                sort: true,
                caption: `Примечание`
            },
        ],
    };
});
