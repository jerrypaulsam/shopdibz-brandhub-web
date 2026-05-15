import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductDetail, updateProductCategory } from "@/src/api/products";
import { useToast } from "@/src/components/app/ToastProvider";
import {
  getItemSubCategories,
  getProductCategories,
  getSubCategories,
} from "@/src/data/product-catalog";

/**
 * @returns {{
 * form: any,
 * setFormField: (field: string, value: string) => void,
 * isLoading: boolean,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * fieldErrors: Record<string, string>,
 * categories: any[],
 * subCategories: any[],
 * itemSubCategories: any[],
 * slug: string,
 * title: string,
 * submit: () => Promise<void>,
 * }} [options]
 */
export function useProductCategoryUpdateForm(options = {}) {
  const router = useRouter();
  const { showToast } = useToast();
  const enabled = options.enabled ?? true;
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : String(router.query.slug || "");

  const [form, setForm] = useState({
    categorySlug: "",
    subCategorySlug: "",
    itemSubCategorySlug: "",
  });
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

  const categories = useMemo(() => getProductCategories(), []);
  const subCategories = useMemo(
    () => getSubCategories(form.categorySlug),
    [form.categorySlug],
  );
  const itemSubCategories = useMemo(
    () => getItemSubCategories(form.categorySlug, form.subCategorySlug),
    [form.categorySlug, form.subCategorySlug],
  );

  useEffect(() => {
    async function load() {
      if (!enabled || !slug) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const data = await fetchProductDetail(slug);
        const selectedCategory =
          categories.find((category) => category.id === data.category) || null;
        const selectedSubCategory =
          selectedCategory?.sub?.find((subCategory) => subCategory.id === data.sub_cat) || null;
        const selectedItemSubCategory =
          selectedSubCategory?.itemSub?.find((item) => item.id === data.item_sub_cat) || null;

        setTitle(String(data.title || ""));
        setForm({
          categorySlug: selectedCategory?.slug || "",
          subCategorySlug: selectedSubCategory?.slug || "",
          itemSubCategorySlug: selectedItemSubCategory?.slug || "",
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Category form could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [categories, enabled, slug]);

  function setFormField(field, value) {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setForm((current) => {
      if (field === "categorySlug") {
        return {
          ...current,
          categorySlug: value,
          subCategorySlug: "",
          itemSubCategorySlug: "",
        };
      }

      if (field === "subCategorySlug") {
        return {
          ...current,
          subCategorySlug: value,
          itemSubCategorySlug: "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  async function submit() {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const errors = validateCategoryUpdateForm(form, itemSubCategories.length > 0);
      if (Object.keys(errors).length) {
        const nextMessage = Object.values(errors)[0];
        setFieldErrors(errors);
        setError(nextMessage);
        showToast({ message: nextMessage, type: "error" });
        return;
      }

      setFieldErrors({});

      const selectedCategory = categories.find((category) => category.slug === form.categorySlug);
      const selectedSubCategory = subCategories.find(
        (subCategory) => subCategory.slug === form.subCategorySlug,
      );
      const selectedItem = itemSubCategories.find(
        (itemSubCategory) => itemSubCategory.slug === form.itemSubCategorySlug,
      );

      await updateProductCategory({
        slug,
        categoryId: selectedCategory?.id || 0,
        subCategoryId: selectedSubCategory?.id || 0,
        itemSubCategoryId: selectedItem?.id || null,
      });

      setSuccess("Category updated successfully.");
      showToast({ message: "Category updated successfully.", type: "success" });
    } catch (submitError) {
      const nextMessage =
        submitError instanceof Error
          ? submitError.message
          : "Category could not be updated.";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    setFormField,
    isLoading,
    isSubmitting,
    error,
    success,
    fieldErrors,
    categories,
    subCategories,
    itemSubCategories,
    slug,
    title,
    submit,
  };
}

function validateCategoryUpdateForm(form, hasItemSubCategories) {
  const errors = {};

  if (!form.categorySlug) errors.categorySlug = "field required *";
  if (!form.subCategorySlug) errors.subCategorySlug = "field required *";
  if (hasItemSubCategories && !form.itemSubCategorySlug) {
    errors.itemSubCategorySlug = "field required *";
  }

  return errors;
}
