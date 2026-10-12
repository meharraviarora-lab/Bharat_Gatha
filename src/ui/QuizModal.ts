import type { QuizEngine, QuizResult } from '../quiz/QuizEngine';
import { audio } from '../core/Audio';
import { buildPanel, button, closeOverlay, el, mountOverlay } from './overlay';

/**
 * The quiz screen.
 *
 * Three rules are enforced here rather than left to content:
 *  - the explanation appears for every answer, right or wrong;
 *  - a wrong answer reveals the correct one instead of allowing another guess;
 *  - nothing is taken away for being wrong.
 *
 * Keys 1–4 answer, Enter advances, so a whole round can be played without the
 * mouse — which matters when the rest of the game is mouse-look.
 */

const OPTION_KEYS = ['1', '2', '3', '4', '5', '6'];

export class QuizModal {
  private readonly engine: QuizEngine;
  private resolve: ((result: QuizResult | null) => void) | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(engine: QuizEngine) {
    this.engine = engine;
  }

  /**
   * Show a round that has already been started on the engine.
   * Resolves with the result, or null if the learner closed it early.
   */
  present(opts: { title: string; subtitle?: string; allowClose?: boolean }): Promise<QuizResult | null> {
    return new Promise((resolve) => {
      this.resolve = resolve;

      const { panel, body, foot } = buildPanel({
        title: opts.title,
        subtitle: opts.subtitle,
        closable: opts.allowClose ?? false,
        onClose: () => this.bail(),
      });

      const content = el('div', 'quiz');
      body.appendChild(content);

      const meter = el('div', 'quiz-meter');
      const tally = el('div', 'quiz-tally');
      foot.append(tally);
      const nextBtn = button('Next', 'btn btn-primary');
      nextBtn.disabled = true;
      foot.appendChild(nextBtn);

      const renderMeter = (): void => {
        meter.replaceChildren(
          ...this.engine.marks.map((mark) => {
            const i = el('i');
            if (mark !== 'pending') i.classList.add(mark);
            return i;
          }),
        );
      };

      const render = (): void => {
        const q = this.engine.question;
        if (!q) {
          this.complete();
          return;
        }

        content.replaceChildren();
        renderMeter();
        content.appendChild(meter);

        const stem = el('p', 'quiz-stem');
        stem.textContent = q.stem;
        content.appendChild(stem);

        if (q.context) {
          const ctx = el('p', 'quiz-context');
          ctx.textContent = q.context;
          content.appendChild(ctx);
        }

        const list = el('div', 'quiz-options');
        const buttons: HTMLButtonElement[] = q.options.map((text, i) => {
          const b = el('button', 'quiz-opt') as HTMLButtonElement;
          b.type = 'button';
          const key = el('span', 'qo-key', OPTION_KEYS[i] ?? '');
          const label = el('span', 'qo-label', text);
          const mark = el('span', 'qo-mark');
          b.append(key, label, mark);
          b.addEventListener('mouseenter', () => audio.hover());
          b.addEventListener('click', () => choose(i));
          list.appendChild(b);
          return b;
        });
        content.appendChild(list);

        const choose = (index: number): void => {
          if (this.engine.revealed) return;
          audio.click();
          const outcome = this.engine.answer(index);
          if (!outcome) return;

          for (const [i, b] of buttons.entries()) {
            b.disabled = true;
            if (i === outcome.correctIndex) b.dataset.state = 'correct';
            else if (i === index && !outcome.correct) b.dataset.state = 'wrong';
            const markEl = b.querySelector<HTMLElement>('.qo-mark');
            if (markEl) {
              if (i === outcome.correctIndex) markEl.textContent = '✓';
              else if (i === index) markEl.textContent = '✕';
            }
          }

          const explain = el('div', 'quiz-explain');
          const h5 = el('h5', undefined, outcome.correct ? 'Why that is right' : 'What the answer is');
          const p = el('p', undefined, outcome.explain);
          explain.append(h5, p);
          if (q.generated) {
            const note = el('p', undefined, 'Generated from the game’s own timeline and codex data.');
            note.style.opacity = '0.6';
            note.style.fontSize = '0.78rem';
            explain.appendChild(note);
          }
          content.appendChild(explain);

          renderMeter();
          updateTally();
          nextBtn.disabled = false;
          nextBtn.textContent = this.engine.hasMore ? 'Next' : 'See results';
          nextBtn.focus();
        };

        updateTally();
        nextBtn.disabled = true;
        nextBtn.textContent = 'Next';
      };

      const updateTally = (): void => {
        const t = this.engine.tally;
        tally.replaceChildren();
        const a = el('span');
        a.innerHTML = `Question <b>${Math.min(t.answered + (this.engine.revealed ? 0 : 1), t.total)}</b> of <b>${t.total}</b>`;
        const b = el('span');
        b.innerHTML = `Correct <b>${t.correct}</b>`;
        tally.append(a, b);
      };

      nextBtn.addEventListener('click', () => {
        audio.click();
        if (this.engine.advance()) render();
        else this.complete();
      });

      this.keyHandler = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !nextBtn.disabled) {
          event.preventDefault();
          nextBtn.click();
          return;
        }
        const index = OPTION_KEYS.indexOf(event.key);
        if (index >= 0 && !this.engine.revealed) {
          const optionButtons = content.querySelectorAll<HTMLButtonElement>('.quiz-opt');
          optionButtons[index]?.click();
        }
      };
      window.addEventListener('keydown', this.keyHandler);

      mountOverlay('quiz', panel, { onEscape: opts.allowClose ? () => this.bail() : undefined });
      render();
    });
  }

  // ------------------------------------------------------------------ finish

  private complete(): void {
    const result = this.engine.finish();
    this.detach();
    if (!result) {
      closeOverlay();
      this.settle(null);
      return;
    }
    this.showResults(result);
  }

  private bail(): void {
    this.engine.abort();
    this.detach();
    closeOverlay();
    this.settle(null);
  }

  private showResults(result: QuizResult): void {
    const { panel, body, foot } = buildPanel({
      title: result.reason === 'seal' ? (result.passed ? 'Chapter sealed' : 'Not sealed yet') : 'Round complete',
      subtitle:
        result.reason === 'seal'
          ? `You needed ${result.passMark}% to seal this chapter.`
          : 'Everything you got wrong is listed below, with the answer.',
      closable: true,
      onClose: () => {
        closeOverlay();
        this.settle(result);
      },
    });

    const grid = el('div', 'result-grid');
    grid.append(
      tile(`${result.percent}%`, 'Score'),
      tile(`${result.correct}/${result.total}`, 'Correct'),
      tile(`+${result.vidyaEarned}`, 'Vidya earned'),
      tile(`${result.elapsedSeconds}s`, 'Time taken'),
    );
    body.appendChild(grid);

    if (result.skills.length > 0) {
      const heading = el('h3');
      heading.style.cssText = 'font-family: var(--font-display); font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin: 0 0 0.6rem;';
      heading.textContent = 'By learning objective';
      body.appendChild(heading);

      const table = el('table', 'report-table');
      const thead = el('thead');
      const hrow = el('tr');
      for (const h of ['Objective', 'Right', 'Asked']) {
        const th = el('th', undefined, h);
        hrow.appendChild(th);
      }
      thead.appendChild(hrow);
      const tbody = el('tbody');
      for (const s of [...result.skills].sort((a, b) => a.right / a.asked - b.right / b.asked)) {
        const tr = el('tr');
        tr.append(el('td', undefined, s.skill), el('td', 'num', String(s.right)), el('td', 'num', String(s.asked)));
        tbody.appendChild(tr);
      }
      table.append(thead, tbody);
      body.appendChild(table);
    }

    if (result.review.length > 0) {
      const heading = el('h3');
      heading.style.cssText = 'font-family: var(--font-display); font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin: 1.4rem 0 0.6rem;';
      heading.textContent = 'Worth another look';
      body.appendChild(heading);

      const list = el('div', 'review-list');
      for (const a of result.review) {
        const row = el('div', 'review-row no');
        const icon = el('div', undefined, '✕');
        const text = el('div');
        const q = el('div');
        q.textContent = a.question.stem;
        const ans = el('div');
        ans.innerHTML = `Answer: <em>${escapeHtml(a.question.options[a.question.answer] ?? '')}</em>`;
        const why = el('div');
        why.style.cssText = 'opacity: 0.75; margin-top: 0.25rem;';
        why.textContent = a.question.explain;
        text.append(q, ans, why);
        row.append(icon, text);
        list.appendChild(row);
      }
      body.appendChild(list);
    } else {
      const perfect = el('p', 'prose');
      perfect.textContent =
        result.total > 0
          ? 'Nothing to review — every answer correct. The questions you have mastered will come back rarely from now on, and new ones will take their place.'
          : 'No questions were asked.';
      body.appendChild(perfect);
    }

    const note = el('div');
    note.style.cssText = 'font-size: 0.78rem; opacity: 0.7;';
    note.textContent =
      result.reason === 'seal' && !result.passed
        ? 'You can retake this as often as you like. Nothing is lost by trying again.'
        : 'Questions you answer correctly three times in a row stop coming back.';
    foot.appendChild(note);

    const done = button('Continue', 'btn btn-primary');
    done.addEventListener('click', () => {
      audio.click();
      closeOverlay();
      this.settle(result);
    });
    foot.appendChild(done);

    mountOverlay('quiz-results', panel, {
      onEscape: () => {
        closeOverlay();
        this.settle(result);
      },
    });
    done.focus();
  }

  private detach(): void {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }

  private settle(result: QuizResult | null): void {
    const resolve = this.resolve;
    this.resolve = null;
    resolve?.(result);
  }
}

function tile(value: string, label: string): HTMLElement {
  const node = el('div', 'result-tile');
  const b = el('b', undefined, value);
  const small = el('small', undefined, label);
  node.append(b, small);
  return node;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
