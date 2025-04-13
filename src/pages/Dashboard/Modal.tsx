type AddVendorModalContentProps = {
  onClose: () => void;
  onVendorAdded: (newVendor: { vendor: string; address1: string }) => void;
};

import { useState } from "react";

const AddVendorModalContent = ({
  onClose,
  onVendorAdded,
}: AddVendorModalContentProps) => {
  const [vendorName, setVendorName] = useState("");
  const [address1, setAddress1] = useState("");

  const handleSubmit = () => {
    if (!vendorName.trim() || !address1.trim()) return;

    const newVendor = {
      vendor: vendorName.trim(),
      address1: address1.trim(),
    };

    onVendorAdded(newVendor);
    onClose();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Add New Vendor
      </h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vendor Name
          </label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Vendor Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Vendor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVendorModalContent;
