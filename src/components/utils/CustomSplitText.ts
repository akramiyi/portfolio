export class SplitText {
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  lines: HTMLElement[] = []; // Lines not perfectly supported in this polyfill
  private elements: {el: HTMLElement, html: string}[] = [];

  constructor(target: string | string[] | HTMLElement | NodeListOf<HTMLElement> | Element[], options?: any) {
    let targets: HTMLElement[] = [];
    if (typeof target === 'string') {
      targets = Array.from(document.querySelectorAll(target));
    } else if (target instanceof HTMLElement) {
      targets = [target];
    } else if (target instanceof NodeList || Array.isArray(target)) {
      targets = Array.from(target as any);
    }

    const type = (options?.type || 'chars,words,lines');

    targets.forEach((el) => {
      this.elements.push({ el, html: el.innerHTML });
      this.processNode(el, type, options);
    });
  }

  private processNode(node: HTMLElement, type: string, options: any) {
    const childNodes = Array.from(node.childNodes);
    node.innerHTML = '';

    childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || '';
        const words = text.split(/(\s+)/); // Preserve whitespace segments

        words.forEach((word) => {
          if (word.trim() === '') {
            node.appendChild(document.createTextNode(word));
            return;
          }

          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.className = options?.wordsClass || 'split-word';

          if (type.includes('chars')) {
            const chars = word.split('');
            chars.forEach((char) => {
              const charSpan = document.createElement('span');
              charSpan.style.display = 'inline-block';
              charSpan.innerText = char;
              charSpan.className = options?.charsClass || 'split-char';
              wordSpan.appendChild(charSpan);
              this.chars.push(charSpan);
            });
          } else {
             wordSpan.innerText = word;
          }

          node.appendChild(wordSpan);
          this.words.push(wordSpan);
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Clone the element node (like <br>, <span>, etc)
        const elChild = child as HTMLElement;
        const wrapper = document.createElement(elChild.tagName) as HTMLElement;
        
        // Copy attributes over
        Array.from(elChild.attributes).forEach(attr => wrapper.setAttribute(attr.name, attr.value));
        
        // Recursively dissect its children
        this.processNode(elChild, type, options);
        
        // Append all the newly wrapped children inside our new wrapper
        while (elChild.firstChild) {
          wrapper.appendChild(elChild.firstChild);
        }
        
        node.appendChild(wrapper);
      }
    });

    // Fallback for lines staging
    this.lines.push(node);
  }

  revert() {
    this.elements.forEach(({ el, html }) => {
      el.innerHTML = html;
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
  }
}
