import React from 'react';
import { Link } from 'react-router-dom';
import { AbstractComponent } from '../../../util/AbstractComponent';
import { Database } from '../../../util/DatabaseInjection';

interface OpskriftLink {
    id: string,
    name: string
}

export class SoegOpskriftPage extends AbstractComponent<{}> {
    name = 'SoegOpskriftPage';
    links: OpskriftLink[] = [];

    loadData = async () => {
        const result = await Database.getOpskrifter();
        const opskrifter = result?.map(x => ({ name: x?.title ?? '', id: x?.id ?? '' })) ?? [];
        this.links = opskrifter;
    }

    renderComponent() {
        return (<ul>
            {this.links.map(x => (<li key={x.id}><Link to={'Opskrift/' + x.id}>{x.name}</Link></li>))}
        </ul>
        );
    }
}
