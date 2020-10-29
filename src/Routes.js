import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Group from "./containers/Group";

const Routes = (appProps) => {
    return (
      <Switch>
        <Route 
          path="/" 
          exact 
          render={(props) => (
            <Home {...props} {...appProps} />
          )}
        />
        <Route 
          path="/login" 
          exact
          render={(props) => (
            <Login {...props} {...appProps} />
          )}
        />
        <Route 
          path="/signup"
          exact
          render={(props) => (
            <Signup {...props} {...appProps} />
          )}
        />
        <Route 
          path='/group/:id'
          exact
          render={(props) => (
            <Group {...props} {...appProps} />
          )}
        />
        <Route 
          path='/group-settings/:id' 
          exact 
          render={(props) => (
            <Home {...props} {...appProps} />
          )} 
        />
        <Route component={NotFound} />
      </Switch>
    );

}


export default Routes;