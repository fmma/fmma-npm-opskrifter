import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { AbstractComponent } from '../../util/AbstractComponent';
import { getPages, registerPage } from '../../util/PageRegistry';
import { IngredientsOverviewPage } from '../pages/IngredientsOverviewPage/IngredientsOverviewPage';
import { OpskriftPage } from '../pages/OpskriftPage/OpskriftPage';
import { SoegOpskriftPage } from '../pages/SoegOpskriftPage/SoegOpskriftPage';
import { TagsOverviewPage } from '../pages/TagsOverviewPage/TagsOverviewPags';
import './MenuComponent.scss';

registerPage({
    component: SoegOpskriftPage,
    path: '/Soeg',
    title: 'Søg'
});

registerPage({
    component: OpskriftPage,
    path: '/Opskrift/:id',
    title: 'Opskrift'
});

registerPage({
    component: OpskriftPage,
    path: '/Opskrift/new',
    title: 'Ny opskrift'
});

registerPage({
    component: TagsOverviewPage,
    path: '/Tags',
    title: 'Tags'
})

registerPage({
    component: IngredientsOverviewPage,
    path: '/Ingredients',
    title: 'Ingredienser'
})

export class MenuComponent extends AbstractComponent<{}> {
    name = 'MenuComponent';
    loadData = undefined;

    renderComponent() {
        return (
            <BrowserRouter>
                <div className="Menu">
                    <ul>{getPages().filter(x => !x.path.includes(':')).map(x => {
                        console.log(x.path);
                        return (
                            <li key={x.path}><Link to={x.path}>{x.title}</Link></li>
                        )
                    })}</ul>
                </div>
                <Switch>{getPages().map(x => (
                    <Route key={x.path} path={x.path} component={x.component}></Route>
                ))}</Switch>
            </BrowserRouter>
        );
    }
}
