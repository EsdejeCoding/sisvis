import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FindPosts } from "./data-handler";

const STATUS_LABELS = {
  0: { text: "Antri", color: "text-orange-600" },
  1: { text: "Ditangani", color: "text-blue-600" },
  2: { text: "Selesai", color: "text-green-600" },
};

export default function CustomerLooker() {
  const { id, nomer } = useParams();
  const [dataCustomer, setDataCustomer] = useState([]);

  useEffect(() => {
    console.log("ID Antrian:", id);
    console.log("Nomor:", nomer);
    FindAntrian();
    console.log("data", dataCustomer);
    // Panggil data berdasarkan id & nomor di sini
    // fetchData(id, nomor);
  }, [id, nomer]);

  const FindAntrian = async () => {
    let res = [];
    try {
      const antrian = await FindPosts(
        "servis",
        `antrian=${id.split("-")[1]}&tanggal=${
          id.split("-")[0]
        }&telepon=${nomer}`
      );
      res = antrian;
      setDataCustomer(res);
    } catch (error) {}
  };

  return (
    <>
      {dataCustomer.length > 0 ? (
        <>
          <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow space-y-6">
            {dataCustomer.map((item) => {
              const status = STATUS_LABELS[item.status] || {
                text: "Tidak Diketahui",
                color: "text-gray-500",
              };
              return (
                <div key={item.id}>
                  <div className="">
                    <h1 className="text-2xl font-bold">
                      Antrian #{item.antrian}
                    </h1>
                    <h2 className={`font-semibold ${status.color} text-xl`}>
                      {status.text}
                    </h2>
                  </div>

                  <div className="mt-2 space-y-2">
                    <p>
                      <strong>Pemilik:</strong> {item.pemilik}
                    </p>
                    <p>
                      <strong>Telepon:</strong> {item.telepon}
                    </p>
                    <p>
                      <strong>Barang:</strong> {item.barang}
                    </p>
                    <p>
                      <strong>Tanggal:</strong> {item.tanggal.slice(0, 2)}-
                      {item.tanggal.slice(2, 4)}-{item.tanggal.slice(4)}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 mb-1">
                      Keluhan:
                    </h3>
                    <ul className="list-disc list-inside text-gray-800">
                      {item.keluhan.map((kel, i) => (
                        <li key={i}>{kel}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 mb-1">
                      Perbaikan:
                    </h3>
                    <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">Nama</th>
                          <th className="p-2 border">Qty</th>
                          <th className="p-2 border">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.perbaikan.map((pbk) => (
                          <tr key={pbk.id}>
                            <td className="p-2 border">{pbk.nama}</td>
                            <td className="p-2 border text-center">
                              {pbk.qty}
                            </td>
                            <td className="p-2 border text-right">
                              Rp {pbk.subtotal.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-right font-semibold">
                    Total: Rp {item.total.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div>data tidak ditemukan</div>
      )}
    </>
  );
}
