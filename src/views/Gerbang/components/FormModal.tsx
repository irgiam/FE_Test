import React, { useState, useEffect } from "react";
import Modal from "../../../components/Modal";

interface Gerbang {
  id?: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang?: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Gerbang>) => void;
  initialData?: Gerbang | null;
  isEdit: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit,
}) => {
  const [formData, setFormData] = useState<Partial<Gerbang>>({
    NamaGerbang: "",
    IdCabang: 0,
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        NamaGerbang: initialData.NamaGerbang,
        IdCabang: initialData.IdCabang,
      });
    } else if (!isEdit && isOpen) {
      // Reset form for create mode
      setFormData({
        NamaGerbang: "",
        IdCabang: 0,
      });
    }
  }, [initialData, isOpen, isEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "IdCabang" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Gerbang" : "Tambah Gerbang"}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Cabang
          </label>
          <input
            type="number"
            name="IdCabang"
            value={formData.IdCabang}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Gerbang
          </label>
          <input
            type="text"
            name="NamaGerbang"
            value={formData.NamaGerbang}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isEdit ? "Update" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
