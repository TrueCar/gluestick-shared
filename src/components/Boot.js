import { Component, Children, PropTypes } from "react";
import withSideEffect from "react-side-effect";

class Boot extends Component {
  render() {
    return null;
  }
}

Boot.propTypes = {
  script: PropTypes.object
};

function reducePropsToState(propsList) {
  console.log("reducePropsToState", propsList);
  const tags = {};
  propsList.forEach(props => {
    const tagName = Object.keys(props).slice(-1).pop();
    Object.assign(tags, {[tagName]: props[tagName]});
  });
  //console.log(tags);
  return tags;
}

function handleStateChangeOnClient(elementTypes) {
  console.log("handleStateChangeOnClient", elementTypes);
  let bootElement = document.getElementById("gluestick-boot");

  if (!bootElement) {
    bootElement = document.createElement("div");
    bootElement.id = "gluestick-boot";
    document.body.appendChild(bootElement);

    Object.keys(elementTypes).forEach((element) => {
      const domElement = document.createElement(element);
      domElement.type = elementTypes[element].type;
      domElement.innerHTML = elementTypes[element].innerHTML;
      console.log("appending child:", domElement);
      bootElement.appendChild(domElement);
    });
  }

}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(Boot);
