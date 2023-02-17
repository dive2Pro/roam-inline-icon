import React from "react";
import ReactDOM from "react-dom";
import { Icon, IconName, IconProps } from '@blueprintjs/core'
import { extension_helper } from "./helper";
import "./style.less";

const renderNode = (node: HTMLButtonElement) => {
  const v = node.innerText;
  const icon = v.substring(5);
  if (!icon) {
    return;
  }

  const attributes = icon.split(" ");
  const props = {} as IconProps;
  props.icon = attributes.shift() as IconName;
  attributes.forEach((v, index) => {
    if (+v) {
      props.size = +v;
    } else {
      props.color = v;
    }
  })
  ReactDOM.render(<Icon {...props} />, node.parentElement)
}

const isIconFormat = (d: Element) => {
  console.log(d.textContent, ' - tc')
  const text = d.textContent;
  return text.startsWith("icon ")
}
const process = (node: Node) => {
  Array.from((node as HTMLElement)?.querySelectorAll(".bp3-button")).filter(d => d.tagName === 'BUTTON' && isIconFormat(d))
    .forEach(d => {
      renderNode(d as HTMLButtonElement);
    })
}

const isNode = (node: HTMLElement) => node.innerHTML
export function initExtension() {
  const observer = new MutationObserver((ms) => {
    ms.forEach(m => {
      m.addedNodes.forEach(node => {
        isNode(node as HTMLElement) && process(node);
      }
      )
    })
  });
  process(document.body);
  observer.observe(document.body, { childList: true, subtree: true });
  extension_helper.on_uninstall(() => {
    observer.disconnect();
  })
}
