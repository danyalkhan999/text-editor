import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {
  ngOnInit() {
    // No longer needed to enable CSS-based formatting with execCommand
  }

  onFontFamily(event: Event): void {
    const target = event.target as HTMLSelectElement; // Casting to HTMLSelectElement
    if (target) {
      const fontFamily = target.value;
      this.applyStyleToSelection('fontFamily', fontFamily);
    }
  }

  onFontSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const fontSize = target.value;
    this.applyStyleToSelection('fontSize', fontSize);
  }

  private applyStyleToSelection(
    styleProperty: keyof CSSStyleDeclaration,
    styleValue: string
  ) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // nothing selected

    // Create a span to wrap the selected content with the style
    const span = document.createElement('span');

    // Type assertion to ensure TypeScript understands that we're working with a valid style property
    (span.style as any)[styleProperty] = styleValue;

    // Wrap the selected content in the span
    range.surroundContents(span);

    // Move the cursor to the end of the wrapped content after applying the style
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);
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
      this.selectAll();
    }
  }

  private selectAll() {
    const editorArea = document.querySelector('.editor-area')!;
    const range = document.createRange();
    range.selectNodeContents(editorArea);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}
