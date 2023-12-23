import React from 'react';
import { AbstractComponent } from '../../util/AbstractComponent';
import { Database } from '../../util/DependencyInjection';
import { currentUser, currentUserFirstTime, login, logout } from '../../util/User';
import { HeaderComponent } from '../HeaderComponent/HeaderComponent';
import { MenuComponent } from '../MenuComponent/MenuComponent';
import './App.scss';

export class App extends AbstractComponent<{}> {
  name = 'App';
  user = '';

  loadData = async () => {
    await Database.initialize();
    this.user = (await currentUserFirstTime())?.displayName ?? '';
  }

  renderComponent() {
    return (
      <div className="container pt-3">
        <HeaderComponent />
        <MenuComponent />
        {this.user ? (
          <div>
            <p>Logget ind som {this.user}</p>,
          <button className="col-4" onMouseUp={
              () => {
                console.log("Log ud");
                logout();
                this.user = '';
                this.forceUpdate();
              }
            }>Log ud</button>
          </div>
        ) : (
            <button className="col-4" onMouseUp={
              async () => {
                console.log("Log ind");
                await login();
                this.user = (await currentUser())?.displayName ?? '';
                this.forceUpdate();
              }
            }>Log ind</button>
          )
        }
      </div>
    );
  }
}
