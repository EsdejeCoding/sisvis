import React from "react";

export default function ConfirmAlert({
  customer,
  selected,
  call,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        {!call && selected == 1 && (
          <>
            <h3 className="font-medium mb-3">Update Status Servis</h3>
            <p className="mb-4">
              Apakah anda lanjut perbaiki barang <b>{customer}</b>?
            </p>
          </>
        )}
        {!call && selected == 2 && (
          <>
            <h3 className="font-medium mb-3">Update Status Servis</h3>
            <p className="mb-4">
              Apakah anda lanjut menyelesaikan perbaikan barang{" "}
              <b>{customer}</b>?
            </p>
          </>
        )}
        {call && (
          <>
            <h3 className="font-medium mb-3">Hubungi Customer</h3>
            <p className="mb-4">
              Barang selesai diperbaiki! Apakah anda ingin menghubungi{" "}
              <b>{customer}</b>?
            </p>
          </>
        )}
        {selected === false && call === false && (
          <>
            <h3 className="font-medium mb-3">Hapus Customer</h3>
            <p className="mb-4">
              Apakah anda ingin menghapus <b>{customer}</b>?
            </p>
          </>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
          >
            Tidak
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
}
