import React from "react";

import { Link } from "react-router-dom";
import './NotFound.scss';

const NotFound = () => {
  return (
    <div className="NotFound">
      <h3>Wow, you found something wierd!</h3>
      <Link to="/">No worries, you can go back to the frontpage</Link>
    </div>
  );
}


export default NotFound;