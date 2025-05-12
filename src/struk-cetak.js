import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FindPosts } from "./data-handler";

export default function StrukCetak({ effect = false }) {
  const { id } = useParams();
  const [dataCustomer, setDataCustomer] = useState([]);
  const [loadedCode, setLoadedCode] = useState(0);

  useEffect(() => {
    if (dataCustomer.length === 0) FindAntrian();
    else {
      setLoadedCode(loadedCode + 1);
      if (loadedCode === 1) window.print();
    }
    effect = false;
  }, [id, dataCustomer, effect]);

  const FindAntrian = async () => {
    let res = [];
    try {
      const antrian = await FindPosts(
        "servis",
        `antrian=${id.split("-")[1]}&tanggal=${id.split("-")[0]}`
      );
      res = antrian;
      setDataCustomer(res);
    } catch (error) {}
  };

  return (
    <>
      {dataCustomer.length > 0 ? (
        <div className="p-4 mx-auto font-mono text-sm">
          <h2 className="text-center font-bold text-lg mb-2">
            SISVIS Servis Motor
          </h2>
          <div className="border-t border-b py-2 text-center">
            <p>No. Antrian: #{dataCustomer[0].antrian}</p>
            <p>
              Tanggal:{" "}
              {(() => {
                const tgl = dataCustomer[0].tanggal;
                return `${tgl.slice(0, 2)}-${tgl.slice(2, 4)}-${tgl.slice(4)}`;
              })()}
            </p>
          </div>

          <div className="mt-2">
            <p>
              <strong>Pemilik:</strong> {dataCustomer[0].pemilik}
            </p>
            <p>
              <strong>Telepon:</strong> {dataCustomer[0].telepon}
            </p>
            <p>
              <strong>Barang:</strong> {dataCustomer[0].barang}
            </p>
            <p>
              <strong>Keluhan:</strong>
            </p>
            <ul className="list-disc list-inside ml-4">
              {dataCustomer[0].keluhan.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>

          <div className="mt-3">
            <p className="font-semibold border-b pb-1">Perbaikan</p>
            <table className="w-full mt-1">
              <thead>
                <tr className="border-b text-left">
                  <th>Nama</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Sub</th>
                </tr>
              </thead>
              <tbody>
                {dataCustomer[0].perbaikan.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    <td className="text-right">{item.qty}</td>
                    <td className="text-right">
                      Rp {item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t mt-3 pt-2 text-right font-semibold">
            Total: Rp {dataCustomer[0].total.toLocaleString()}
          </div>

          <div className="mt-4 text-center text-xs italic text-gray-600">
            Terima kasih telah menggunakan layanan kami!
          </div>
        </div>
      ) : (
        "Data Tidak Ada"
      )}
    </>
  );
}
