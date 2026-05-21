/*
 * Файл для выдачи фото на предпросмотр с сервера или кэша
 */
const SectionPhotoPreviewManager = (function() {

    console.log('heeeeerereeee') // frolov debug

    const cacheData = {};
    const url = '/claim/ajax/detailed-photo-list-group';

    return {

        // Получение данных с сервера или кэша
        getDetailedPhotoListGroup: async function(claimId, itemId)
        {
            if (!cacheData[claimId]) {
                let response = await this.getDetailedPhotoListGroupFromServer(claimId);
                cacheData[claimId] = {};
                response.records.forEach(item => {
                    cacheData[item.product.claimId][item.product.itemId] = item.photo.link;
                });
            }
            return cacheData[claimId].hasOwnProperty(itemId) ? cacheData[claimId][itemId] : null;
        },

        // Получение данных с сервера
        getDetailedPhotoListGroupFromServer: async function(claimId) {
            const requestUrl = `${url}?` + new URLSearchParams({claimId});
            const response = await fetch(requestUrl, { method: "GET" });

            if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

            const data = await response.json();

            return data;
        },

        // Вставка разметки с возможностью предпросмотра
        renderEyeIcon: async function (container, claimId, itemId) {
            let data = await this.getDetailedPhotoListGroup(claimId, itemId);
            if (data) {
                let photoParams = cacheData[claimId][itemId];

                // Проверяем, что параметры для фотографий существуют
                if (!photoParams) {
                    console.warn(`Не удалось загрузить параметры для фотографий по claimId: ${claimId}, itemId: ${itemId}`);
                    return;
                }

                container.innerHTML += `
                    <div class="detailed-photo-placeholder"
                         data-attr-claim-id=${claimId}
                         data-attr-item-id=${itemId}
                         style="display: block">
                    </div>
                `;

                let photoData = [
                    {
                        "itemId": itemId,
                        "claimId": claimId,
                        "params": photoParams
                    }
                ];

                if (typeof window['oDetailedPhotoManager'] != 'undefined') {
                    window['oDetailedPhotoManager'].loadGroup(photoData);
                }

            }
        },



    };
})();