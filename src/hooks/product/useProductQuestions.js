import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  createProductAnswer,
  deleteProductAnswer,
  fetchProductQuestions,
} from "@/src/api/products";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import { normalizePaginatedCollection } from "@/src/utils/product";

function firstValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return typeof value === "string" ? value : "";
}

/**
 * @returns {{
 * slug: string,
 * page: number,
 * questions: any[],
 * questionDrafts: Record<string, string>,
 * isLoading: boolean,
 * message: string,
 * hasNextPage: boolean,
 * hasPreviousPage: boolean,
 * updateRoute: (page: number) => Promise<void>,
 * updateQuestionDraft: (questionId: number, value: string) => void,
 * submitAnswer: (questionId: number) => Promise<void>,
 * deleteAnswer: (answerId: number) => Promise<void>,
 * }}
 */
export function useProductQuestions() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const slug = useMemo(() => firstValue(router.query.slug), [router.query.slug]);
  const page = useMemo(
    () => Number(firstValue(router.query.page) || 1),
    [router.query.page],
  );

  const [questions, setQuestions] = useState([]);
  const [questionDrafts, setQuestionDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadQuestions = useCallback(async () => {
    if (!slug) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchProductQuestions({ slug, page });
      const collection = normalizePaginatedCollection(data);
      setQuestions(collection.results);
      setHasNextPage(Boolean(collection.next) || page * 15 < Number(collection.count || 0));
      setHasPreviousPage(Boolean(collection.previous) || page > 1);
    } catch (error) {
      setQuestions([]);
      setMessage(error instanceof Error ? error.message : "Product questions could not be loaded");
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, slug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadQuestions();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadQuestions]);

  async function updateRoute(nextPage) {
    await router.replace(
      {
        pathname: `/products/${slug}/questions`,
        query: {
          page: String(nextPage),
        },
      },
      undefined,
      { shallow: true },
    );
  }

  function updateQuestionDraft(questionId, value) {
    setQuestionDrafts((current) => ({
      ...current,
      [String(questionId)]: value,
    }));
  }

  async function submitAnswer(questionId) {
    const answer = String(questionDrafts[String(questionId)] || "").trim();

    if (!answer) {
      setMessage("Enter an answer before submitting.");
      return;
    }

    try {
      setMessage("");
      await createProductAnswer({ questionId, answer });
      setQuestionDrafts((current) => ({
        ...current,
        [String(questionId)]: "",
      }));
      await loadQuestions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Answer could not be posted.");
    }
  }

  async function deleteAnswer(answerId) {
    const accepted = await confirm({
      title: "Delete Answer",
      message: "This seller answer will be removed from the product question thread.",
      confirmLabel: "Delete Answer",
    });

    if (!accepted) {
      return;
    }

    try {
      setMessage("");
      await deleteProductAnswer({ answerId });
      await loadQuestions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Answer could not be deleted.");
    }
  }

  return {
    slug,
    page,
    questions,
    questionDrafts,
    isLoading,
    message,
    hasNextPage,
    hasPreviousPage,
    updateRoute,
    updateQuestionDraft,
    submitAnswer,
    deleteAnswer,
  };
}
