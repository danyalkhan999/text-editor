import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {
  ngOnInit() {
    // enable CSS-based formatting (so fontSize uses px, not HTML size=1–7)
    document.execCommand('styleWithCSS', false, 'true');
  }

  onFontFamily(event: Event): void {
    const target = event.target as HTMLSelectElement; // Casting to HTMLSelectElement
    if (target) {
      document.execCommand('fontName', false, target.value);
    }
  }

  onFontSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const fontSize = target.value;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // nothing selected

    // Create a span with desired font size
    const span = document.createElement('span');
    span.style.fontSize = fontSize;

    // Wrap the selected content in the span
    span.appendChild(range.extractContents());
    range.deleteContents();
    range.insertNode(span);

    // Move selection to after the inserted node
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    newRange.collapse(false);
    selection.addRange(newRange);
  }

  private replaceFontTags(fontSize: string) {
    const editor = document.querySelector('.editor-area')!;
    // convert <font size="7">…</font> → <span style="font-size:XXpx">…</span>
    const fonts = editor.querySelectorAll('font[size="7"]');
    fonts.forEach((f) => {
      const span = document.createElement('span');
      span.style.fontSize = fontSize;
      span.innerHTML = f.innerHTML;
      f.replaceWith(span);
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    // allow Ctrl+A to select all
    if (e.ctrlKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      document.execCommand('selectAll', false);
    }
  }
}
