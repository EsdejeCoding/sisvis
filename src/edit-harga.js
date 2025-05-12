import React, { useState } from "react";
import { updatePost } from "./data-handler";
export default function EditHarga({ useFor, onCancel, onConfirm, data }) {
  const dataHargaSelected = { ...data };
  const [dataHarga, setDataHarga] = useState({ ...dataHargaSelected });

  const GetInput = (event) => {
    const { id, value } = event.target;
    setDataHarga((prv) => ({ ...prv, [id]: value }));
  };
  const UpdateHarga = async (d) => {
    try {
      const updateHarga = await updatePost("harga", data.id, d);
    } catch (error) {}
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
          <h3>{useFor}</h3>
          <form className="flex flex-col gap-4 w-full max-h-[75vh] m-auto mb-4">
            {["nama", "jenis", "harga"].map((elem, index) => {
              return (
                <>
                  <div key={index + "edit"}>
                    <label className="block text-sm font-medium text-gray-700">
                      {elem}
                    </label>
                    {elem === "jenis" ? (
                      <>
                        <select
                          id={elem}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={GetInput}
                          value={dataHarga[elem]}
                        >
                          <option value="0">Barang</option>
                          <option value="1">Jasa</option>
                        </select>
                      </>
                    ) : (
                      <input
                        id={elem}
                        type="text"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={GetInput}
                        value={dataHarga[elem]}
                      />
                    )}
                  </div>
                </>
              );
            })}
          </form>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
            >
              Tidak
            </button>
            <button
              onClick={() => {
                onConfirm();
                UpdateHarga(dataHarga);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Ya
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
