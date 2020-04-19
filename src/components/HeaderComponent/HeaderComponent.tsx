import React from 'react';
import { AbstractComponent } from '../../util/AbstractComponent';
import './HeaderComponent.scss';

export class HeaderComponent extends AbstractComponent<{}> {
    name = 'HeaderComponent';
    loadData = undefined;

    renderComponent() {
        return [
            <span role="img" aria-label="Cook">👩‍🍳</span>,
            'Opskrifter',
            <span role="img" aria-label="Cook">👨‍🍳</span>
        ];
    }
}
