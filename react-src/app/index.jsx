import $ from "jquery";
import React from 'react';
import {render} from 'react-dom';
import MasterContainer from './MasterContainer.jsx';

class App extends React.Component {
  render () {
    return (
      <div>
        <MasterContainer />
      </div>
    );
  }
}


$(document).ready(function(){
	$("body").append($("<div>", {id: "habla"}));
	render(<App/>, document.getElementById("habla"));
});





