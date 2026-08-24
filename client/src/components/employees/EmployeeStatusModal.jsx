import {
  X,
  Power,
  AlertTriangle,
} from "lucide-react";

const EmployeeStatusModal = ({
  show,
  employee,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!show || !employee) {
    return null;
  }

  const newStatus =
    employee.status === "ACTIVE"
      ? "INACTIVE"
      : "ACTIVE";

  const activating =
    newStatus === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                activating
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <Power size={20} />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Change Status
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="px-6 py-6">

          <div className="mb-5 flex justify-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle size={27} />
            </div>

          </div>

          <p className="text-center text-sm leading-6 text-gray-600">

            Are you sure you want to change{" "}

            <strong className="font-semibold text-gray-900">
              {employee.name}
            </strong>{" "}

            from{" "}

            <strong className="text-gray-900">
              {employee.status}
            </strong>{" "}

            to{" "}

            <strong
              className={
                activating
                  ? "text-green-600"
                  : "text-amber-600"
              }
            >
              {newStatus}
            </strong>
            ?

          </p>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              onConfirm(newStatus)
            }
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-60 ${
              activating
                ? "bg-green-600 hover:bg-green-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >

            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating...
              </>
            ) : (
              <>
                <Power size={16} />
                Confirm
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
};

export default EmployeeStatusModal;