import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

const CATEGORIES = [
  "salary",
  "freelance",
  "investment",
  "food",
  "transport",
  "housing",
  "entertainment",
  "health",
  "education",
  "other",
];

export default function RecordModal({ record, onSave, onClose }) {
  const isEdit = Boolean(record);
  const [selectedType, setSelectedType] = useState(record?.type || "expense");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      amount: record?.amount || "",
      type: record?.type || "expense",
      category: record?.category || "food",
      date: record?.date
        ? format(new Date(record.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      notes: record?.notes || "",
    },
  });

  useEffect(() => {
    if (record) {
      reset({
        amount: record.amount,
        type: record.type,
        category: record.category,
        date: record.date ? format(new Date(record.date), "yyyy-MM-dd") : "",
        notes: record.notes || "",
      });
      setSelectedType(record.type);
    }
  }, [record, reset]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setValue("type", type);
  };

  const onSubmit = async (data) => {
    await onSave({ ...data, amount: Number(data.amount), type: selectedType });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-border">
          <h2 className="text-white font-semibold">
            {isEdit ? "Edit Record" : "New Record"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Amount */}
          <div>
            <label className="label">Amount (₹)</label>
            <input
              type="number"
              placeholder="0"
              className="input-field"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Must be greater than 0" },
              })}
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Type — controlled buttons, NOT radio */}
          <div>
            <label className="label">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeSelect("income")}
                className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedType === "income"
                    ? "bg-green-500/10 border-green-500/50 text-green-400"
                    : "border-bg-border text-gray-400 hover:border-bg-hover"
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect("expense")}
                className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedType === "expense"
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : "border-bg-border text-gray-400 hover:border-bg-hover"
                }`}
              >
                Expense
              </button>
            </div>
            {/* hidden input for react-hook-form */}
            <input type="hidden" {...register("type")} value={selectedType} />
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              className="input-field"
              {...register("category", { required: true })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input-field"
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="label">
              Notes{" "}
              <span className="text-gray-600 normal-case">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Add a note..."
              className="input-field resize-none"
              {...register("notes")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 justify-center"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
