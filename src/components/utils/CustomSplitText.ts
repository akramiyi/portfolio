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
      
      const text = el.innerText;
      el.innerHTML = '';
      
      const words = text.split(' ');
      words.forEach((word) => {
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
        
        el.appendChild(wordSpan);
        this.words.push(wordSpan);
        
        const space = document.createTextNode(' ');
        el.appendChild(space);
      });
      
      // Polyfill lines by just dumping words into lines array as a fallback for simple staggers
      this.lines.push(el);
    });
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
