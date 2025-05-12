import React, { useEffect, useState } from "react";
import NavHead from "./nav-head";
import { FindPosts, createPost, updatePost, deletePost } from "./data-handler";
import EditHarga from "./edit-harga";
import ConfirmAlert from "./confirm-alert";
import { LoginHandler } from "./login-handler";

export default function InputHarga(prop) {
  const [autoId, setAutoId] = useState(new Date().getTime());
  const [dataHarga, setDataHarga] = useState([]);
  const [dataInput, setDataInput] = useState({
    idBarang: "",
    jenis: "0",
    nama: "",
    harga: "0",
  });
  const [submited, setSubmited] = useState(false);
  const [inputEvent, setInputValue] = useState(false);
  const [editDataBox, setEditDataBox] = useState({
    event: false,
    use: undefined,
    data: null,
  });

  useEffect(() => {
    DaftarHarga();
    setAutoId(new Date().getTime());
    setDataInput({
      idBarang: "",
      jenis: "0",
      nama: "",
      harga: "0",
    });
    setSubmited(false);
  }, [submited]);

  const DaftarHarga = async () => {
    let res = [];
    try {
      const daftarHarga = await FindPosts("harga");
      res = daftarHarga;
      setDataHarga(res);
    } catch (error) {}
  };

  const SaveData = async (data) => {
    try {
      const saved = await createPost("harga", data);
    } catch (error) {}
  };

  const DeleteData = async (d) => {
    try {
      const deleteData = await deletePost("harga", d);
    } catch (error) {}
  };

  const GetInput = (event) => {
    setInputValue(true);
    const { id, value } = event.target;
    setDataInput((prv) => ({ ...prv, idBarang: autoId, [id]: value }));
  };

  const SubmitData = (event) => {
    event.preventDefault();
    setSubmited(true);
    SaveData(dataInput);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <NavHead active={prop.page} />
      <main className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6">
        <form onSubmit={SubmitData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Id
              </label>
              <input
                id="idBarang"
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
                value={autoId}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                id="nama"
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={GetInput}
                value={inputEvent ? dataInput.nama : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jenis
              </label>
              <select
                id="jenis"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={GetInput}
                value={inputEvent ? dataInput.jenis : 0}
              >
                <option value="0">Barang</option>
                <option value="1">Jasa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Harga
              </label>
              <input
                id="harga"
                type="number"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={GetInput}
                value={inputEvent ? dataInput.harga : 0}
              />
            </div>
          </div>
          <button className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700">
            Tambahkan
          </button>
        </form>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-center">Id</th>
                <th className="px-4 py-2 text-center">Nama</th>
                <th className="px-4 py-2 text-center">Jenis</th>
                <th className="px-4 py-2 text-center">Harga</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700">
              {dataHarga.map((data, index) => {
                return (
                  <tr className="border-t" key={index}>
                    <td className="px-4 py-2 border text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {data.idBarang}
                    </td>
                    <td className="px-4 py-2 border">{data.nama}</td>
                    <td className="px-4 py-2 border text-center">
                      {["Barang", "Jasa"][data.jenis]}
                    </td>
                    <td className="px-4 py-2 border">{data.harga}</td>
                    <td className="px-4 py-2 border">
                      <div className="flex justify-evenly">
                        <button
                          className="bg-cyan-500 w-16 p-2 text-white"
                          onClick={(e) => {
                            setEditDataBox({
                              event: true,
                              use: "edit",
                              data,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-300 w-16 p-2"
                          onClick={(e) => {
                            setEditDataBox({
                              event: true,
                              use: "delete",
                              data,
                            });
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Tambah baris lain sesuai kebutuhan */}
            </tbody>
          </table>
        </div>
      </main>
      {editDataBox.event && editDataBox.use === "edit" && (
        <EditHarga
          useFor={editDataBox.use}
          onCancel={(e) =>
            setEditDataBox({ event: false, use: undefined, data: null })
          }
          onConfirm={(e) => {
            setEditDataBox({ event: false, use: undefined, data: null });
            setSubmited(true);
          }}
          data={editDataBox.data}
        />
      )}
      {editDataBox.event && editDataBox.use === "delete" && (
        <ConfirmAlert
          customer={editDataBox.data.nama}
          selected={false}
          call={false}
          onConfirm={(e) => {
            DeleteData(editDataBox.data.id);
            setEditDataBox({ event: false, use: undefined, data: null });
            setSubmited(true);
          }}
          onCancel={(e) => {
            setEditDataBox({ event: false, use: undefined, data: null });
          }}
        />
      )}
    </div>
  );
}
