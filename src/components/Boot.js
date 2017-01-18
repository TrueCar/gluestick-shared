import { Component, Children, PropTypes } from "react";
import withSideEffect from "react-side-effect";

class Boot extends Component {
  render() {
    return null;
  }
  static bodyScripts = [];
}

function reducePropsToState(propsList) {
  const bodyScripts = Boot.bodyScripts;
  propsList.forEach(props => {
    let {children} = props;
    if (! children.hasOwnProperty('length')){
      children = [children];
    }
    children.forEach(child => {
      if (child.type == "script" && bodyScripts.indexOf(child.props.children ) === -1){
        bodyScripts.push(child.props.children);
      }
    });
  });
  return bodyScripts;
}

function handleStateChangeOnClient(bodyScripts) {
  console.log("handleStateChangeOnClient", bodyScripts);
  let bootElement = document.getElementById("gluestick-boot");

  if (!bootElement) {
    bootElement = document.createElement("div");
    bootElement.id = "gluestick-boot";
    document.body.appendChild(bootElement);
    bodyScripts.forEach((script) => {
      const el = document.createElement('script');
      el.appendChild(document.createTextNode(script));
      bootElement.appendChild(el);
    })
  }
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(Boot);
