import React from "react";
import Modal from "../../../components/Modal";

interface Gerbang {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gerbang: Gerbang | null;
}

const ViewDetailModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  gerbang,
}) => {
  if (!gerbang) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Gerbang">
      <div className="space-y-4">
        <div>
          <span className="block text-sm font-medium text-gray-700">ID:</span>
          <span className="block mt-1">{gerbang.id}</span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700">
            ID Cabang:
          </span>
          <span className="block mt-1">{gerbang.IdCabang}</span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700">
            Nama Cabang:
          </span>
          <span className="block mt-1">{gerbang.NamaCabang}</span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700">
            Nama Gerbang:
          </span>
          <span className="block mt-1">{gerbang.NamaGerbang}</span>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailModal;
