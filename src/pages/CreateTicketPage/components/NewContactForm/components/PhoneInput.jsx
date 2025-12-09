import s from "./PhoneInput.module.scss";
import { useRef, useEffect } from "react";
export default function PhoneInput({
  value = "",
  onChange,
  placeholder = "+7(900) 000-00-00",
  className,
  text
}) {
  const inputRef = useRef(null);
  const lastKeyRef = useRef(null);
  const prevSelectionRef = useRef({ start: 0, end: 0 });
  const prevValueRef = useRef(value);

  // ---------- утилиты ----------
  const extractDigits = (s) => (s || "").replace(/\D/g, "").slice(0, 11);

  const normalizeLeading = (digits) => {
    if (!digits) return digits;
    // Если ввели 8 в начале — заменить на 7
    if (digits[0] === "8") digits = "7" + digits.slice(1);
    return digits;
  };

  const formatFromDigits = (digitsIn) => {
    let digits = normalizeLeading(digitsIn || "");
    if (digits.length === 0) return "+7(";
    // если ввели только 10 цифр без ведущей 7, подставим 7 в начало (на выбор)
    if (digits.length === 10 && digits[0] !== "7") digits = "7" + digits;
    digits = digits.slice(0, 11); // макс 11
    const d = digits;
    let res = "+7(";
    if (d.length > 1) res += d.substring(1, Math.min(4, d.length));
    if (d.length >= 4) res += ") ";
    if (d.length > 4) res += d.substring(4, Math.min(7, d.length));
    if (d.length >= 7) res += "-";
    if (d.length > 7) res += d.substring(7, Math.min(9, d.length));
    if (d.length >= 9) res += "-";
    if (d.length > 9) res += d.substring(9, Math.min(11, d.length));
    return res;
  };

  // caret <-> digit index mapping
  const caretToDigitIndex = (caret, formatted) => {
    let count = 0;
    for (let i = 0; i < Math.min(caret, formatted.length); i++) {
      if (/\d/.test(formatted[i])) count++;
    }
    return count; // цифр слева от caret
  };

  const digitIndexToCaret = (digitIndex, formatted) => {
    if (digitIndex <= 0) return 0;
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        count++;
        if (count === digitIndex) return i + 1;
      }
    }
    return formatted.length;
  };

  // минимальная позиция курсора (после '(')
  const minCaretFor = (formatted) => {
    const pos = formatted.indexOf("(");
    return pos >= 0 ? pos + 1 : 3; // по умолчанию 3
  };

  // enforce caret not before minCaret
  const enforceMinCaret = (el, formatted) => {
    const minCaret = minCaretFor(formatted);
    try {
      const s = Math.min(el.selectionStart, el.selectionEnd);
      const e = Math.max(el.selectionStart, el.selectionEnd);
      if (s < minCaret) {
        const newPos = Math.max(minCaret, 0);
        el.setSelectionRange(
          newPos,
          newPos === e ? newPos : Math.max(newPos, e)
        );
      }
    } catch (err) {
      // ignore (если элемент не фокусирован)
    }
  };

  // ---------- события ----------
  const handleKeyDown = (e) => {
    lastKeyRef.current = e.key;
    const el = e.target;
    prevSelectionRef.current = {
      start: el.selectionStart,
      end: el.selectionEnd,
    };
    // Если курсор пытается оказаться перед префиксом — запретим Backspace/Delete
    const currentFormatted = prevValueRef.current || formatFromDigits("");
    const minCaret = minCaretFor(currentFormatted);
    const selStart = el.selectionStart;
    if (e.key === "Backspace" && selStart <= minCaret) {
      e.preventDefault();
      // поставить курсор в minCaret
      requestAnimationFrame(() => el.setSelectionRange(minCaret, minCaret));
      return;
    }
    if (e.key === "Delete") {
      // Если удаление на позиции перед префиксом — игнор
      const selEnd = el.selectionEnd;
      if (selEnd <= minCaret) {
        e.preventDefault();
        requestAnimationFrame(() => el.setSelectionRange(minCaret, minCaret));
        return;
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const txt = (e.clipboardData || window.clipboardData).getData("text") || "";
    const pastedDigits = extractDigits(txt);
    const el = inputRef.current;
    const prevFormatted = prevValueRef.current || "";
    const prevDigits = extractDigits(prevFormatted);
    const sel = prevSelectionRef.current || {
      start: el.selectionStart,
      end: el.selectionEnd,
    };
    const insertDigitIndex = caretToDigitIndex(sel.start, prevFormatted);
    const newDigits = (
      prevDigits.slice(0, insertDigitIndex) +
      pastedDigits +
      prevDigits.slice(insertDigitIndex)
    ).slice(0, 11);
    const newFormatted = formatFromDigits(newDigits);
    const caretAfter = digitIndexToCaret(
      insertDigitIndex + pastedDigits.length,
      newFormatted
    );
    onChange(newFormatted);
    requestAnimationFrame(() => {
      el.setSelectionRange(
        Math.max(caretAfter, minCaretFor(newFormatted)),
        Math.max(caretAfter, minCaretFor(newFormatted))
      );
      prevValueRef.current = newFormatted;
    });
  };

  const handleChange = (e) => {
    const el = e.target;
    const raw = el.value || "";
    const prevFormatted = prevValueRef.current || "";
    const prevDigits = extractDigits(prevFormatted);
    const newDigitsRaw = extractDigits(raw);
    const newDigits = normalizeLeading(newDigitsRaw).slice(0, 11);

    const prevSel = prevSelectionRef.current || {
      start: el.selectionStart,
      end: el.selectionEnd,
    };
    const prevCaret = prevSel.start;
    const prevSelCollapsed = prevSel.start === prevSel.end;
    const key = lastKeyRef.current;
    lastKeyRef.current = null;

    // case: had selection -> replace that range
    if (!prevSelCollapsed) {
      const startDigit = caretToDigitIndex(prevSel.start, prevFormatted);
      const endDigit = caretToDigitIndex(prevSel.end, prevFormatted);
      const left = prevDigits.slice(0, startDigit);
      const right = prevDigits.slice(endDigit);
      // try recover inserted middle
      let middle = "";
      if (newDigits.startsWith(left) && newDigits.endsWith(right)) {
        middle = newDigits.slice(left.length, newDigits.length - right.length);
      } else {
        const expectedLen =
          newDigits.length - (prevDigits.length - (endDigit - startDigit));
        middle = newDigits.slice(startDigit, startDigit + expectedLen);
      }
      const resultDigits = (left + middle + right).slice(0, 11);
      const newFormatted = formatFromDigits(resultDigits);
      const caretDigitIndex = left.length + middle.length;
      onChange(newFormatted);
      requestAnimationFrame(() => {
        const pos = Math.max(
          digitIndexToCaret(caretDigitIndex, newFormatted),
          minCaretFor(newFormatted)
        );
        el.setSelectionRange(pos, pos);
        prevValueRef.current = newFormatted;
      });
      return;
    }

    // Backspace
    if (key === "Backspace") {
      const caret = prevCaret;
      if (caret <= minCaretFor(prevFormatted)) {
        // ничего не делать (лечим)
        const newFormatted = formatFromDigits(prevDigits);
        onChange(newFormatted);
        prevValueRef.current = newFormatted;
        requestAnimationFrame(() =>
          el.setSelectionRange(
            minCaretFor(newFormatted),
            minCaretFor(newFormatted)
          )
        );
        return;
      }
      const delIndex = Math.max(0, caretToDigitIndex(caret, prevFormatted) - 1);
      const resultDigits = (
        prevDigits.slice(0, delIndex) + prevDigits.slice(delIndex + 1)
      ).slice(0, 11);
      const newFormatted = formatFromDigits(resultDigits);
      const newCaret = Math.max(
        digitIndexToCaret(delIndex, newFormatted),
        minCaretFor(newFormatted)
      );
      onChange(newFormatted);
      requestAnimationFrame(() => {
        el.setSelectionRange(newCaret, newCaret);
        prevValueRef.current = newFormatted;
      });
      return;
    }

    // Delete
    if (key === "Delete") {
      const caret = prevCaret;
      if (caret < minCaretFor(prevFormatted)) {
        const newFormatted = formatFromDigits(prevDigits);
        onChange(newFormatted);
        prevValueRef.current = newFormatted;
        requestAnimationFrame(() =>
          el.setSelectionRange(
            minCaretFor(newFormatted),
            minCaretFor(newFormatted)
          )
        );
        return;
      }
      const delIndex = caretToDigitIndex(caret, prevFormatted);
      if (delIndex >= prevDigits.length) {
        const newFormatted = formatFromDigits(prevDigits);
        onChange(newFormatted);
        prevValueRef.current = newFormatted;
        requestAnimationFrame(() =>
          el.setSelectionRange(
            Math.max(caret, minCaretFor(newFormatted)),
            Math.max(caret, minCaretFor(newFormatted))
          )
        );
        return;
      }
      const resultDigits = (
        prevDigits.slice(0, delIndex) + prevDigits.slice(delIndex + 1)
      ).slice(0, 11);
      const newFormatted = formatFromDigits(resultDigits);
      const newCaret = Math.max(
        digitIndexToCaret(delIndex, newFormatted),
        minCaretFor(newFormatted)
      );
      onChange(newFormatted);
      requestAnimationFrame(() => {
        el.setSelectionRange(newCaret, newCaret);
        prevValueRef.current = newFormatted;
      });
      return;
    }

    // Обычная печать (или автозаполнение)
    // Используем newDigits как итог
    const finalDigits = newDigits.slice(0, 11);
    const finalFormatted = formatFromDigits(finalDigits);

    // попытка сохранить позицию каретки в логичном месте
    // превращаем текущую позицию в индекс цифры, затем обратно в caret
    const curCaretRaw = el.selectionStart;
    const digitIndexAfterInput = caretToDigitIndex(curCaretRaw, raw);
    const caretPos = Math.max(
      digitIndexToCaret(digitIndexAfterInput, finalFormatted),
      minCaretFor(finalFormatted)
    );

    onChange(finalFormatted);
    requestAnimationFrame(() => {
      el.setSelectionRange(caretPos, caretPos);
      prevValueRef.current = finalFormatted;
    });
  };

  // mouseup/focus: сохраняем селекцию и корректируем caret если нужно
  const handleMouseUp = (e) => {
    const el = e.target;
    prevSelectionRef.current = {
      start: el.selectionStart,
      end: el.selectionEnd,
    };
    enforceMinCaret(el, prevValueRef.current || formatFromDigits(""));
  };
  const handleFocus = (e) => {
    const el = e.target;
    prevSelectionRef.current = {
      start: el.selectionStart,
      end: el.selectionEnd,
    };
    // если value пустой или minimal mask — поставить каретку в конец префикса
    const curFormatted = prevValueRef.current || formatFromDigits("");
    requestAnimationFrame(() => {
      enforceMinCaret(el, curFormatted);
    });
  };

  useEffect(() => {
    // синхронизация предыдущего значения, если value изменился извне
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
    }
  }, [value]);

  return (
    <div className={s.input_box}>
      <p className={`${s.text}`}> {text} </p>
      <input
        ref={inputRef}
        className={s.input}
        inputMode="tel"
        type="tel"
        placeholder={placeholder}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onPaste={handlePaste}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        maxLength={17}
        autoComplete="tel"
      />
    </div>
  );
}
