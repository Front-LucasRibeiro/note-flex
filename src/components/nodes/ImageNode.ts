import {
  DecoratorNode
} from "lexical";

export class ImageNode extends DecoratorNode {
  __src: string;

  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__key);
  }

  constructor(src, key) {
    super(key);
    this.__src = src;
  }

  createDOM() {
    const img = document.createElement("img");
    img.src = this.__src;
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    img.style.margin = "12px 0";
    return img;
  }

  updateDOM() {
    return false;
  }
}

export function $createImageNode(src) {
  return new ImageNode(src);
}
