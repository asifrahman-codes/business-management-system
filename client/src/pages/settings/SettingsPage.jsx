import { useEffect, useState } from "react";

import {
  Settings,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import settingsService from "../../services/settings.service";

const initialForm = {
  shopName: "",
  shopAddress: "",
  shopPhone: "",
  shopEmail: "",
  taxRate: 0,
  currency: "PKR",
  currencySymbol: "Rs.",
};

const SettingsPage = () => {
  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await settingsService.getSettings();

      const settings =
        response.data || {};

      setForm({
        shopName:
          settings.shopName || "",
        shopAddress:
          settings.shopAddress || "",
        shopPhone:
          settings.shopPhone || "",
        shopEmail:
          settings.shopEmail || "",
        taxRate:
          settings.taxRate ?? 0,
        currency:
          settings.currency || "PKR",
        currencySymbol:
          settings.currencySymbol || "Rs.",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setMessage("");
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await settingsService.updateSettings(
          {
            ...form,
            taxRate: Number(
              form.taxRate
            ),
          }
        );

      const updatedSettings =
        response.data || {};

      setForm({
        shopName:
          updatedSettings.shopName ||
          "",
        shopAddress:
          updatedSettings.shopAddress ||
          "",
        shopPhone:
          updatedSettings.shopPhone ||
          "",
        shopEmail:
          updatedSettings.shopEmail ||
          "",
        taxRate:
          updatedSettings.taxRate ?? 0,
        currency:
          updatedSettings.currency ||
          "PKR",
        currencySymbol:
          updatedSettings.currencySymbol ||
          "Rs.",
      });

      setMessage(
        response.message ||
          "Settings updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Settings size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Settings
            </h1>

            <p className="text-sm text-gray-500">
              Manage your business information
              and system settings
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          <CheckCircle2
            size={20}
            className="shrink-0"
          />

          <p className="text-sm">
            {message}
          </p>
        </div>
      )}

      {/* Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        {/* Business Information */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Business Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Information displayed throughout
            the business management system.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Shop Name */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Shop Name
              </label>

              <input
                type="text"
                value={form.shopName}
                onChange={(e) =>
                  handleChange(
                    "shopName",
                    e.target.value
                  )
                }
                maxLength={150}
                placeholder="Enter shop name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Shop Address
              </label>

              <textarea
                value={form.shopAddress}
                onChange={(e) =>
                  handleChange(
                    "shopAddress",
                    e.target.value
                  )
                }
                maxLength={300}
                rows={3}
                placeholder="Enter shop address"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="text"
                value={form.shopPhone}
                onChange={(e) =>
                  handleChange(
                    "shopPhone",
                    e.target.value
                  )
                }
                maxLength={30}
                placeholder="e.g. 03001234567"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={form.shopEmail}
                onChange={(e) =>
                  handleChange(
                    "shopEmail",
                    e.target.value
                  )
                }
                maxLength={150}
                placeholder="shop@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Financial Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configure currency and default tax
            settings.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Tax Rate */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tax Rate (%)
              </label>

              <input
                type="number"
                value={form.taxRate}
                onChange={(e) =>
                  handleChange(
                    "taxRate",
                    e.target.value
                  )
                }
                min="0"
                max="100"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Currency
              </label>

              <input
                type="text"
                value={form.currency}
                onChange={(e) =>
                  handleChange(
                    "currency",
                    e.target.value
                  )
                }
                maxLength={10}
                placeholder="PKR"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Currency Symbol */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Currency Symbol
              </label>

              <input
                type="text"
                value={
                  form.currencySymbol
                }
                onChange={(e) =>
                  handleChange(
                    "currencySymbol",
                    e.target.value
                  )
                }
                maxLength={5}
                placeholder="Rs."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end p-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;