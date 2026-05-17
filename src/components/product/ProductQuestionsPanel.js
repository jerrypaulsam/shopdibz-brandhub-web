/**
 * @param {{
 * questions: any[],
 * questionDrafts: Record<string, string>,
 * isLoading: boolean,
 * message: string,
 * page: number,
 * hasNextPage: boolean,
 * hasPreviousPage: boolean,
 * onUpdateRoute: (page: number) => Promise<void>,
 * onUpdateQuestionDraft: (questionId: number, value: string) => void,
 * onSubmitAnswer: (questionId: number) => Promise<void>,
 * onDeleteAnswer: (answerId: number) => Promise<void>,
 * }} props
 */
export default function ProductQuestionsPanel({
  questions,
  questionDrafts,
  isLoading,
  message,
  page,
  hasNextPage,
  hasPreviousPage,
  onUpdateRoute,
  onUpdateQuestionDraft,
  onSubmitAnswer,
  onDeleteAnswer,
}) {
  const answeredCount = questions.filter((question) => Array.isArray(question?.ans) && question.ans.length).length;

  return (
    <div className="space-y-6">
      <section className="theme-panel rounded-sm border p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Product Support
            </p>
            <h1 className="mt-3 text-3xl font-black text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
              Product Questions
            </h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Visible Questions" value={String(questions.length)} />
            <Metric label="Answered" value={String(answeredCount)} />
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-brand-gold">{message}</p> : null}
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="theme-panel rounded-sm border p-8 text-sm theme-text-muted">
            Loading product questions...
          </div>
        ) : questions.length ? (
          questions.map((question) => {
            const answers = Array.isArray(question?.ans) ? question.ans : [];
            const draftValue = questionDrafts[String(question?.id)] || "";

            return (
              <article className="theme-panel rounded-sm border p-5" key={question?.id}>
                <div className="flex items-start gap-4">
                  <div className="theme-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-black text-brand-gold">
                    Q
                  </div>

                  <div className="min-w-0 flex-1 space-y-4">
                    <div>
                      <p className="text-base font-bold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
                        {question?.qus || "Question"}
                      </p>
                      <p className="theme-text-muted mt-2 text-xs">
                        {formatQuestionDate(question?.time || question?.timestamp)}
                      </p>
                    </div>

                    {answers.length ? (
                      <div className="space-y-3">
                        {answers.map((answer) => (
                          <div className="theme-surface-soft rounded-sm border p-4" key={answer?.id}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <p className="theme-text-muted text-sm leading-6">
                                {answer?.ans || ""}
                              </p>
                              <button
                                className="theme-action-danger rounded-sm border px-3 py-2 text-sm font-semibold transition-colors"
                                type="button"
                                onClick={() => onDeleteAnswer(answer.id)}
                              >
                                Delete Answer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          className="theme-field min-h-28 w-full rounded-sm border px-4 py-3 text-sm outline-none"
                          placeholder="What's your answer?"
                          value={draftValue}
                          onChange={(event) => onUpdateQuestionDraft(question.id, event.target.value)}
                        />
                        <button
                          className="theme-action-neutral rounded-sm border px-4 py-2 text-sm font-semibold transition-colors"
                          type="button"
                          onClick={() => onSubmitAnswer(question.id)}
                        >
                          Submit Answer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="theme-panel rounded-sm border border-dashed p-12 text-center">
            <p className="text-lg font-black text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
              No Product Questions Yet
            </p>
            <p className="theme-text-muted mt-2 text-sm">
              Customer questions for this product will appear here.
            </p>
          </div>
        )}
      </section>

      <section className="theme-panel flex flex-wrap items-center justify-between gap-3 rounded-sm border p-4">
        <button
          className="theme-action-neutral rounded-sm border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onUpdateRoute(Math.max(page - 1, 1))}
        >
          Previous
        </button>
        <p className="theme-text-muted text-sm font-semibold">Page {page}</p>
        <button
          className="theme-action-neutral rounded-sm border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40"
          type="button"
          disabled={!hasNextPage}
          onClick={() => onUpdateRoute(page + 1)}
        >
          Next
        </button>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="theme-surface-soft rounded-sm border p-4">
      <p className="theme-text-muted text-xs font-bold uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-2 text-lg font-black text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
        {value}
      </p>
    </div>
  );
}

function formatQuestionDate(value) {
  if (!value) {
    return "---";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "---";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
