import { useState } from "react";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import { normalizeRemoteAssetUrl } from "@/src/utils/product";

/**
 * @param {{ groups: any[], isLoading: boolean, isSaving: boolean, loadingGroupId: number, message: string, onOpenGroup: (groupId: number) => Promise<void>, onSaveGroup: (group: { groupId: number, name: string, active: boolean, show: boolean, imageBase64?: string, fileName?: string }) => Promise<boolean>, onDeleteGroup: (groupId: number) => Promise<boolean>, onUploadGroupSheet: (groupId: number, file: File) => Promise<boolean> }} props
 */
export default function ProductGroupsPanel({
  groups,
  isLoading,
  isSaving,
  loadingGroupId,
  message,
  onOpenGroup,
  onSaveGroup,
  onDeleteGroup,
  onUploadGroupSheet,
}) {
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("Active");
  const [editHome, setEditHome] = useState("No");
  const [editError, setEditError] = useState("");
  const [cropFile, setCropFile] = useState(null);
  const [editImageBase64, setEditImageBase64] = useState("");
  const [editImageName, setEditImageName] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");

  function openEditor(group) {
    setEditingGroup(group);
    setEditName(group?.name || group?.title || "");
    setEditStatus(group?.active ? "Active" : "Inactive");
    setEditHome(group?.show ? "Yes" : "No");
    setEditError("");
    setEditImageBase64("");
    setEditImageName("");
    setEditImagePreview(normalizeRemoteAssetUrl(group?.cImg || group?.image || ""));
  }

  async function submitEdit(event) {
    event.preventDefault();

    if (!String(editName).trim()) {
      setEditError("Group name is required.");
      return;
    }

    const isSaved = await onSaveGroup({
      groupId: Number(editingGroup?.id || 0),
      name: String(editName).trim(),
      active: editStatus === "Active",
      show: editHome === "Yes",
      imageBase64: editImageBase64 || undefined,
      fileName: editImageName || undefined,
    });

    if (isSaved) {
      setEditingGroup(null);
      setCropFile(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="theme-surface rounded-sm border p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
          Product Workspace
        </p>
        <h1 className="mt-3 text-3xl font-black text-brand-white">Product Groups</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
          Grouped collections for seller-curated assortments.
        </p>
        {message ? <p className="mt-4 text-sm text-brand-gold">{message}</p> : null}
      </section>

      {isLoading ? (
        <div className="theme-surface rounded-sm border p-8 text-sm text-white/55">
          Loading product groups...
        </div>
      ) : groups.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const coverImage = normalizeRemoteAssetUrl(group?.cImg || group?.image || "");
            const groupId = Number(group?.id || 0);
            const isGroupLoading = loadingGroupId === groupId;

            return (
              <article
                className="theme-surface overflow-hidden rounded-sm border"
                key={group?.id}
              >
                <div className="aspect-[16/9] w-full bg-black/30">
                  {coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={group?.name || "Product group"}
                      className="h-full w-full object-cover"
                      src={coverImage}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-white/35">
                      No cover image
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${group?.active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"}`}>
                      {group?.active ? "Active" : "Hidden"}
                    </span>
                    {group?.show ? (
                      <span className="rounded-sm bg-brand-gold/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                        Home Display
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-white">
                      {group?.name || group?.title || "Untitled Group"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {group?.discount
                        ? `${group.discountType === "1" ? "Flat" : "Percent"} discount ${group.discount}`
                        : "Seller-curated grouped products."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* <p className="text-sm font-semibold text-white/50">
                      Open the group to review included products.
                    </p> */}
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        className="theme-action-accent rounded-sm border px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        disabled={isSaving}
                        onClick={() => openEditor(group)}
                      >
                        Edit
                      </button>
                      <label
                        className={`theme-action-neutral rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${
                          isSaving
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        }`}
                      >
                        <input
                          className="hidden"
                          type="file"
                          accept=".xls,.xlsx,.xlsm"
                          disabled={isSaving}
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            if (file) {
                              await onUploadGroupSheet(groupId, file);
                            }
                          }}
                        />
                        {isGroupLoading ? "Uploading..." : "Upload Sheet"}
                      </label>
                      <button
                        className="theme-action-neutral rounded-sm border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        disabled={isSaving}
                        onClick={() => onOpenGroup(groupId)}
                      >
                        Open
                      </button>
                      <button
                        className="theme-action-danger rounded-sm border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        disabled={isSaving}
                        onClick={() => onDeleteGroup(groupId)}
                      >
                        {isGroupLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="theme-surface rounded-sm border border-dashed p-12 text-center">
          <p className="text-lg font-black text-brand-white">No Product Groups Yet</p>
        </div>
      )}

      {editingGroup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <form
            className="theme-surface w-full max-w-xl rounded-sm border p-6 shadow-2xl"
            onSubmit={submitEdit}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                  Edit Details
                </p>
                <h2 className="mt-2 text-2xl font-black text-brand-white">
                  Product Group
                </h2>
              </div>
              <button
                className="rounded-sm border border-white/10 px-3 py-1.5 text-sm font-bold text-white/60 hover:border-white/30 hover:text-brand-white"
                type="button"
                onClick={() => setEditingGroup(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                  Group Name
                </span>
                <input
                  className="mt-2 w-full rounded-sm border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-brand-white outline-none transition focus:border-brand-gold"
                  maxLength={30}
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                    Status
                  </span>
                  <select
                    className="mt-2 w-full rounded-sm border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-brand-white outline-none transition focus:border-brand-gold"
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value)}
                  >
                    <option className="bg-[#121212]" value="Active">Active</option>
                    <option className="bg-[#121212]" value="Inactive">Inactive</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                    Show On Brand Page
                  </span>
                  <select
                    className="mt-2 w-full rounded-sm border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-brand-white outline-none transition focus:border-brand-gold"
                    value={editHome}
                    onChange={(event) => setEditHome(event.target.value)}
                  >
                    <option className="bg-[#121212]" value="Yes">Yes</option>
                    <option className="bg-[#121212]" value="No">No</option>
                  </select>
                </label>
              </div>

              <div className="rounded-sm border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-24 w-full overflow-hidden rounded-sm border border-white/10 bg-black/25 sm:w-40">
                    {editImagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={editName || "Product group cover"}
                        className="h-full w-full object-cover"
                        src={editImagePreview}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-semibold text-white/35">
                        No cover image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                      Cover Image
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Upload and crop a fresh banner image for this product group card.
                    </p>
                    <label className="mt-3 inline-flex cursor-pointer items-center rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold">
                      <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          event.target.value = "";
                          if (file) {
                            setCropFile(file);
                          }
                        }}
                      />
                      {editImageName ? "Change cover image" : "Upload cover image"}
                    </label>
                    {editImageName ? (
                      <p className="mt-2 text-xs text-brand-gold">{editImageName}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {editError ? <p className="text-sm font-semibold text-red-300">{editError}</p> : null}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-sm border border-white/15 px-5 py-2.5 text-sm font-bold text-brand-white hover:border-white/30"
                type="button"
                onClick={() => setEditingGroup(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {isSaving && loadingGroupId === Number(editingGroup?.id || 0) ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <AspectCropDialog
        open={Boolean(cropFile)}
        file={cropFile}
        title="Crop Product Group Cover"
        aspectRatio={1134 / 634}
        outputWidth={1134}
        outputHeight={634}
        outputMimeType="image/jpeg"
        onCancel={() => setCropFile(null)}
        onConfirm={({ dataUrl, base64, fileName }) => {
          setEditImageBase64(base64);
          setEditImageName(fileName);
          setEditImagePreview(dataUrl);
          setCropFile(null);
        }}
      />
    </div>
  );
}
