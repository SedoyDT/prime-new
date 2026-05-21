import AjaxService from "./ajax.service";
import ConfigService from "./config.service";
import {TFilterFieldParamsOrdered} from "../data-table";

/**
 * набор полей по-умолчанию
 */
export const DEFAULT_FIELDS: Assoc<TFilterFieldParamsOrdered<any>> = {
    id: {
        position: 0,
        caption: 'ID',
        width: 40,
        sort: true,
        align: 'center',
        alias: v => v == null ? '' : v
    },
    title: {
        position: 1,
        caption: 'Склад',
        sort: true,
        align: 'center',
        width: 100,
        alias: v => parseInt(v) == 1 ? 'да' : 'нет'
    },
    is_free: {
        position: 1,
        caption: 'Свободная запись',
        sort: true,
        align: 'center',
        width: 100,
        alias: v => parseInt(v) == 1 ? 'да' : 'нет'
    },
    type_id: {
        position: 2,
        caption: 'Тип',
        sort: true,
        align: 'center',
        width: 80,
        alias: (v, cnt, rowData) => rowData.type_title
    },
    project_id: {
        position: 10,
        caption: 'Проект',
        align: 'center',
        width: 100,
        sort: true,
        alias: (v, cnt, rowData) => rowData.project_title
    },
    project_create_user_id: {
        position: 20,
        caption: 'Создал',
        align: 'center',
        width: 120,
        sort: true,
        alias: (v, cnt, rowData) => rowData.project_create_user
    },
    claim_in: {
        position: 30,
        caption: 'Заявка приход',
        align: 'center',
        width: 70,
        sort: true,
        alias: (v, cnt, rowData) => `<a href="${rowData.claim_in_url}" target="_blank">${v}</a>`
    },
    claim_out: {
        position: 40,
        caption: 'Заявка списание',
        align: 'center',
        width: 70,
        sort: true,
        alias: (v, cnt, rowData) => `<a href="${rowData.claim_out_url}" target="_blank">${v}</a>`
    },
    claim_in_date: {
        position: 50,
        caption: 'Дата исполнения заявки на приход',
        align: 'center',
        width: 100,
        sort: true,
        alias: (value, container, rowData) => rowData.project_claim_in_date_formatted
    },
    price: {
        position: 60,
        caption: 'Цена',
        align: 'center',
        width: 100,
        sort: true
    },
    project_item_id: {
        position: 70,
        caption: 'Id товара',
        align: 'center',
        width: 90,
        sort: true
    },
    project_inventory_number_id: {
        position: 80,
        caption: 'Инвентарный номер',
        align: 'center',
        width: 160,
        sort: true,
        alias: (v, cnt, rowData) => `<b>${rowData.project_inventory_number == null ? '' : rowData.project_inventory_number}</b>`
    },
    placing: {
        position: 85,
        caption: 'Название секции',
        align: 'center',
        width: 160,
        sort: false,
    },
    assign_date: {
        position: 90,
        caption: 'Дата назначения',
        align: 'center',
        width: 130,
        sort: true,
        alias: (v, cnt, rowData) => rowData.assign_date_formatted
    },
    assigned_project_id: {
        position: 95,
        caption: 'Числится(Проект)',
        align: 'center',
        width: 130,
        sort: true,
        alias: (v, cnt, rowData) => rowData.assigned_project_title
    },
    assigned_orgstructure_id: {
        position: 100,
        caption: 'Числится(Отдел)',
        align: 'center',
        width: 130,
        sort: true,
        alias: (v, cnt, rowData) => rowData.assigned_orgstructure_title
    },
    assigned_user_id: {
        position: 110,
        caption: 'Числится(ФИО)',
        align: 'center',
        width: 120,
        sort: true,
        alias: (v, cnt, rowData) => rowData.assigned_user
    },
    field1_value: {
        position: 120,
        caption: 'Наименование',
        align: 'center',
        width: 120,
        sort: true
    },
    field2_value: {
        position: 130,
        caption: 'Поле2',
        align: 'center',
        width: 70,
        sort: true
    },
    field3_value: {
        position: 140,
        caption: 'Поле3',
        align: 'center',
        width: 90,
        sort: true,
        alias: (value, container, rowData) => `<b>${value}</b>`
    },
    field4_value: {
        position: 150,
        caption: 'Поле4',
        align: 'center',
        width: 70,
        sort: true
    },
    field5_value: {
        position: 160,
        caption: 'Поле5',
        align: 'center',
        width: 90,
        sort: true,
        alias: (value, container, rowData) => `<b>${value}</b>`
    },
    field6_value: {
        position: 170,
        caption: 'Поле6',
        align: 'center',
        width: 70,
        sort: true
    },
    field7_value: {
        position: 180,
        caption: 'Поле7',
        align: 'center',
        width: 70,
        sort: true
    },
    field8_value: {
        position: 190,
        caption: 'Поле8',
        align: 'center',
        width: 70,
        sort: true
    },
    field9_value: {
        position: 200,
        caption: 'Поле9',
        align: 'center',
        width: 70,
        sort: true
    },
    description: {
        position: 210,
        caption: 'Примечание',
        align: 'center',
        width: 140,
        sort: true
    },
    group_id: {
        position: 220,
        caption: 'Группа',
        align: 'center',
        width: 100,
        sort: true,
        alias: (v, cnt, rowData) => rowData.group_name
    },
    project_claim_in_manager_id: {
        position: 230,
        caption: 'Приходной менеджер',
        align: 'center',
        width: 100,
        sort: true,
        alias: (v, cnt, rowData) => rowData.project_claim_in_manager
    },
    previous_assigned_project_id: {
        position: 240,
        caption: 'Предыдущий проект',
        align: 'center',
        width: 100,
        sort: true,
        alias: (v, cnt, rowData) => rowData.previous_assigned_project_title
    },
    previous_assigned_user_id: {
        position: 250,
        caption: 'Предыдущий владелец',
        align: 'center',
        width: 100,
        sort: true,
        alias: (v, cnt, rowData) => rowData.previous_assigned_user
    },
    amount: {
        caption: 'Кол-во',
        width: 100,
        sort: true,
        position: 300
    },
    in_repair: {
        caption: 'В ремонте',
        width: 80,
        sort: true,
        position: 400,
        alias: (v, cnt, rowData) => rowData.in_repair_formatted
    }
};

/**
 * сервис создания полей для грида
 */
export default class CreateFieldsService
{
    constructor(
        public ConfigService: ConfigService,
        public AjaxService: AjaxService
    ) {}

    /**
     * формирование объекта с полями
     */
    fields() : Assoc<TFilterFieldParamsOrdered<any>>
    {
        const __self = this;
        let fields = DEFAULT_FIELDS;

        if (this.ConfigService.acl.comment > 0) {
            fields.comment_hash = {
                position: 280,
                caption: 'комментарий',
                width: 180,
                sort: true,
                alias: (v, cnt, rowData) => {
                    if (rowData.is_free == 1) {
                        return '';
                    }

                    if (__self.ConfigService.acl.comment == 2) {
                        return $(`
                            <div class="b-inventory__comment">
                                <textarea data-id="${rowData.id}" class="b-inventory__comment__textarea" autocomplete="off">${rowData.comment}</textarea>
                            </div>
                        `).find('textarea').on('change', function () {
                            const element = $(this);
                            $(this).parent().addClass('element-preload');
                            __self.AjaxService.setComment($(this).data('id'), $(this).val())
                                .catch((reason) => {
                                    alert(reason);
                                })
                                .finally(() => {
                                    element.parent().removeClass('element-preload');
                                });
                        });
                    } else if (__self.ConfigService.acl.comment == 1) {
                        return rowData.comment;
                    }
                }
            };
        }

        if (!this.ConfigService.isActive) {
            fields.auto_deactivation_comment = {
                caption: 'Комментарий авто списания',
                width: 200,
                sort: false,
                position: 400,
            };

            fields.deactivation_comment = {
                caption: 'Комментарий списания',
                width: 200,
                sort: false,
                position: 400,
            };

            fields.deactivation_user_name = {
                caption: 'Автор списания',
                width: 200,
                sort: false,
                position: 400,
            };

            fields.deactivation_date = {
                caption: 'Дата списания',
                width: 200,
                sort: true,
                position: 91, // после даты назначения
                alias: (v, cnt, rowData) => rowData.deactivation_date_formatted
            };
        }

        if (this.ConfigService.acl.edit_placing > 0) {
            fields.placing.alias = function (v, cnt, rowData, rowIndex) {
                return $(`<textarea data-id="${rowData.id}" autocomplete="off" class="placing__textarea"> ${v}</textarea>`)
                    .on('change', function () {
                        const element = $(this);
                        element.parent().addClass('element-preload');
                        if (rowData.is_free > 0) {
                            __self.AjaxService.editPlacingDetailed(element.data('id'), element.val())
                                .catch((reason) => {
                                    alert(reason);
                                })
                                .finally(() => {
                                    element.parent().removeClass('element-preload');
                                });
                        } else {
                            __self.AjaxService.editPlacing(element.data('id'), element.val())
                                .catch((reason) => {
                                    alert(reason);
                                })
                                .finally(() => {
                                    element.parent().removeClass('element-preload');
                                });
                        }
                });
            };
        }

        return fields;
    }
}
