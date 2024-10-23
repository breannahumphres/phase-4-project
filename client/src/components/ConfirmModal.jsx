import React from 'react';
import Modal from 'react-modal';

const ConfirmModal = ({ isOpen, onRequestClose, onConfirm, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-gray-800 p-6 rounded-lg shadow-md text-white max-w-lg mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold text-green-400 mb-4">{title}</h2>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onRequestClose}
        >
          Cancel
        </button>
        <button
          className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
