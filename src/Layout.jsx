import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom"
import { Routes } from './helpers/routes'
class Layout extends Component {
    render() {               
        return (
            <div>
                {
                    Routes.map((route, index) => (
                        
                        <React.Fragment key={index}>                         
                            <Switch>
                                <Route exact path={route.path} component={route.components} />
                            </Switch>
                        </React.Fragment>
                    ))
                }
            </div>
        );
    }
}

export default Layout;