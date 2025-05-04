import React from "react";
import Modal from "../../../components/Modal";

interface Gerbang {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  gerbang: Gerbang | null;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  gerbang,
}) => {
  if (!gerbang) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Gerbang">
      <div>
        <p className="mb-4">
          Apakah Anda yakin ingin menghapus gerbang "{gerbang.NamaGerbang}"?
        </p>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
