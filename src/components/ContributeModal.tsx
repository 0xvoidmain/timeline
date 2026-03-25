/* ContributeModal — Full-screen modal for contributing a memory/event */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { Category } from "../types";

interface ContributeModalProps {
  onClose: () => void;
}

export function ContributeModal({ onClose }: ContributeModalProps) {
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* Form state */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    api
      .listCategories()
      .then((res) => {
        setCategories(res.categories);
        if (res.categories.length > 0) setCategory(res.categories[0].slug);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!title.trim() || !description.trim() || !date || !category) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
      }

      setSubmitting(true);
      try {
        await api.createEvent({
          title: title.trim(),
          description: description.trim(),
          date: new Date(date).toISOString(),
          category,
          country: "Việt Nam",
          eventType: "event",
          visibility: "public",
          baseScore: 0,
          image: image.trim() || undefined,
          sources: sourceUrl.trim() ? [{ url: sourceUrl.trim() }] : undefined,
        });
        setSuccess(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi. Vui lòng thử lại.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [title, description, date, category, image, sourceUrl],
  );

  /* Not logged in — show login prompt */
  if (!user) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-surface-container-low rounded-2xl p-12 text-center max-w-md mx-4">
          <span className="material-symbols-outlined text-5xl text-primary mb-6 block">
            login
          </span>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Đăng nhập để đóng góp
          </h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Bạn cần đăng nhập bằng tài khoản Google để có thể đóng góp ký ức vào
            kho lưu trữ.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/api/auth/google"
              className="flex items-center justify-center gap-3 bg-surface-container-high border border-outline-variant/15 text-on-surface px-6 py-3 rounded-lg font-label text-sm hover:border-primary/30 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập bằng Google
            </a>
            <button
              onClick={onClose}
              className="text-on-surface-variant font-label text-sm hover:text-primary transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Success state */
  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-surface-container-low rounded-2xl p-12 text-center max-w-md mx-4">
          <span className="material-symbols-outlined text-5xl text-secondary mb-6 block">
            check_circle
          </span>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Cảm ơn bạn!
          </h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Ký ức của bạn đã được gửi thành công. Đội ngũ kiểm duyệt sẽ xem xét
            và phê duyệt sớm nhất.
          </p>
          <button
            onClick={onClose}
            className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-label text-sm uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-line mt-[5vh] mx-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 mt-4 z-10 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="px-8 md:px-12 py-12">
          {/* Header */}
          <div className="mb-10">
            <span className="font-label text-xs uppercase tracking-widest text-primary mb-3 block">
              Đóng góp ký ức
            </span>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
              Chia sẻ câu chuyện của bạn
            </h2>
            <p className="text-on-surface-variant text-sm">
              Đóng góp một sự kiện, ký ức hoặc câu chuyện lịch sử vào kho lưu
              trữ cộng đồng.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Lễ hội Huế 2024"
                maxLength={200}
                className="w-full bg-surface-container border border-outline-variant/15 rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                Mô tả *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kể về sự kiện này..."
                rows={4}
                maxLength={5000}
                className="w-full bg-surface-container border border-outline-variant/15 rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {/* Date + Category row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                  Ngày diễn ra *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/15 rounded-lg px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                  Danh mục *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/15 rounded-lg px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary/50 transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                URL hình ảnh
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-surface-container border border-outline-variant/15 rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Source URL */}
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                Nguồn tham khảo
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://vi.wikipedia.org/..."
                className="w-full bg-surface-container border border-outline-variant/15 rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-error-container/20 border border-error/20 rounded-lg px-4 py-3">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-on-surface-variant font-label text-sm hover:text-primary transition-colors px-4 py-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-label text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi ký ức"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
