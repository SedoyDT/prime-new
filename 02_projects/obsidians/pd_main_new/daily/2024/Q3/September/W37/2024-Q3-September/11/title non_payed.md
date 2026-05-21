---
author: Frolov Anatolui
date: 2024-09-11
time: 11:09:26
aliases: 
- 
tags:
- unique-note
---


    private _renderItems(): string
    {
        let template = '';
        // let element = document.createElement('div');
        // element.classList.add("amd-legend__item");
        this._data.forEach((item) =>
        {

            // let textNode = document.createTextNode(`${item.title}`);
            // let div = document.createElement('div');
            // let span = document.createElement('span');
            // span.appendChild(textNode);
            // div.appendChild(span);
            // element.appendChild(div);
            //
            template += `
                <div class="amd-legend__item">
                    ${this._renderColorBlock(item)}
                    <span> - ${item.title}</span>
                </div>
            `;

            // console.log('elem') // frolov debug
            // console.log(element.outerHTML);
            //
            // console.log(template);
            return template;
        });