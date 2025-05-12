import React, { useState } from "react";
import { FindPosts, updatePost } from "./data-handler";

export default function AddEditForm({ useFor, data, onCancel, onSaving }) {
  const dateNow = [new Date()];
  dateNow[1] = [
    String(dateNow[0].getDate()).padStart(2, "0"),
    String(dateNow[0].getMonth() + 1).padStart(2, "0"),
    String(dateNow[0].getFullYear()),
  ];
  const [dataCustomer, setDataCustomer] = useState({ ...data });
  const [tambahLength, setTambahLength] = useState({
    keluhan: { event: false, length: 0 },
    perbaikan: { event: false, length: useFor === "Edit Data" ? 0 : 1 },
  });
  const [valKeluhan, setValKeluhan] = useState([...dataCustomer.keluhan]);
  const [valPerbaikan, setValPerbaikan] = useState([...dataCustomer.perbaikan]);
  const [searchEventIndex, setSearchEventIndex] = useState(null);
  const [optionSearch, setOptionSearch] = useState([]);

  const IndexLength = (idx, key, inputAdd = false) => {
    return useFor === "Edit Data"
      ? inputAdd
        ? idx + data[key].length
        : idx
      : idx + data[key].length;
  };

  const SearchData = async (inp) => {
    let res = [];
    try {
      if (inp.trim().length > 0) {
        const dataSearch = await FindPosts(
          "harga",
          "nama_like=" + inp.toLowerCase().trim()
        );
        res = dataSearch;
        setOptionSearch(res);
      } else setSearchEventIndex(null);
    } catch (error) {}
  };

  const GetInputForm = (event, indexArray = false, type = undefined) => {
    const { id, value } = event.target;
    const inputAdd =
      type === undefined
        ? false
        : event.target.attributes.inputadd.value === "true";

    if (indexArray !== false) {
      setTambahLength((prv) => ({
        ...prv,
        [type]: { event: false, length: tambahLength[type].length },
      }));
      if (type === "keluhan") {
        valKeluhan[IndexLength(indexArray, type, inputAdd)] = value;
        setValKeluhan(valKeluhan);
        /**/ if (!inputAdd) {
          setDataCustomer((prvSt) => ({
            ...prvSt,
            keluhan: valKeluhan,
          }));
        }
        //if(!inputAdd)
      }
      if (type === "perbaikan") {
        setSearchEventIndex(
          useFor === "Edit Data"
            ? IndexLength(indexArray, type, inputAdd)
            : indexArray
        );
        SearchData(value);
        valPerbaikan[IndexLength(indexArray, type, inputAdd)] = value;
        setValPerbaikan(valPerbaikan);
        if (useFor === "Tambah Perbaikan" || !inputAdd)
          setDataCustomer((prvSt) => ({
            ...prvSt,
            perbaikan: valPerbaikan,
          }));
      }
    } else {
      setDataCustomer((prvSt) => ({
        ...prvSt,
        [id]: value,
      }));
    }
  };

  const SaveUpdate = async () => {
    if (useFor === "Tambah Perbaikan") {
      try {
        const updateData = await updatePost("servis", data.id, {
          ...dataCustomer,
          perbaikan: valPerbaikan,
        });
      } catch (error) {}
    } else {
      try {
        const updateData = await updatePost("servis", data.id, {
          ...dataCustomer,
          keluhan: valKeluhan,
          perbaikan: valPerbaikan,
        });
      } catch (error) {}
    }
  };

  const OptionSearchBox = (i1, i2, key, from) => {
    if (from === "EDID_TMIP") {
      i1 = i1 + 1;
      i2 = 1 + i2 - data[key].length;
    }
    // else i1 = i1 - data[key].length;

    if (i1 === i2 && optionSearch.length > 0) {
      return (
        <div className="bg-white border border-2 border-t-0 border-blue-500 rounded-b-lg w-xl p-4 pt-2 absolute z-[100] cursor-pointer">
          <ul>
            {optionSearch.map((data, index) => {
              return (
                <li
                  key={index}
                  className="hover:bg-blue-100"
                  onClick={(e) => {
                    valPerbaikan[i2] = data.nama;
                    setValPerbaikan(valPerbaikan);
                    e.target.parentElement.parentElement.previousSibling.value =
                      data.nama;
                    setSearchEventIndex(null);
                  }}
                >
                  {data.nama}
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return "";
    }
  };

  const TambahInput = (key, from = "TMIP") => {
    return (
      <>
        <div className="relative">
          <div
            className="font-bold cursor-pointer"
            onClick={(e) => {
              let lgt = tambahLength[key].length;
              setTambahLength((prv) => ({
                ...prv,
                [key]: { event: true, length: lgt + 1 },
              }));
            }}
          >
            + Tambah Perbaikan
          </div>

          {(() => {
            let result = [];
            for (let i = 0; i < tambahLength[key].length; i++) {
              result.push(
                <div>
                  <input
                    inputadd={"true"}
                    type="text"
                    className={
                      key +
                      " mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }
                    onChange={(e) => {
                      GetInputForm(e, i, key);
                      //console.log()
                    }}
                  />
                  {OptionSearchBox(i, searchEventIndex, key, from)}
                </div>
              );
            }
            return result;
          })()}
        </div>
      </>
    );
  };

  const PerbaikanForm = () => {
    return (
      <form className="flex flex-col gap-4 w-full max-h-[75vh] m-auto mb-4">
        {TambahInput("perbaikan")}
      </form>
    );
  };

  const EditData = () => {
    return (
      <form className="flex flex-col gap-4 w-full max-h-[75vh] m-auto mb-4">
        {[
          "pemilik",
          "telepon",
          "barang",
          "keluhan",
          "perbaikan",
          "total",
          "status",
        ].map((val, index) => {
          return (
            <>
              <div key={index + "edit"}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {val}
                </label>
                {val === "keluhan" || val === "perbaikan" ? (
                  <>
                    {dataCustomer[val].map((dt, idx) => {
                      //if(idx < dataCustomer[val].length - tambahLength[val].length )
                      if (idx < data[val].length)
                        return (
                          <div className="relative">
                            <input
                              inputadd={"false"}
                              key={idx + val}
                              type="text"
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={(e) => {
                                GetInputForm(e, IndexLength(idx, val), val);
                              }}
                              value={dt}
                            />
                            {OptionSearchBox(
                              idx,
                              searchEventIndex,
                              val,
                              "EDID"
                            )}
                          </div>
                        );
                    })}
                    {TambahInput(val, "EDID_TMIP")}
                  </>
                ) : val === "status" ? (
                  <>
                    <select
                      id={val}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        GetInputForm(e);
                      }}
                      value={dataCustomer[val]}
                    >
                      <option value="0" className="text-orange-600 font-medium">
                        Antri
                      </option>
                      <option value="1" className="text-blue-600 font-medium">
                        Ditangani
                      </option>
                      <option value="2" className="text-green-600 font-medium">
                        Selesai
                      </option>
                    </select>
                  </>
                ) : (
                  <input
                    id={val}
                    type="text"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={GetInputForm}
                    value={dataCustomer[val]}
                  />
                )}
              </div>
              <hr />
            </>
          );
        })}
      </form>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-800 mb-3">{useFor}</h3>
        {useFor === "Tambah Perbaikan" && (
          <div
            className={
              tambahLength.perbaikan.length > 3
                ? "overflow-y-auto"
                : "overflow-y-visible"
            }
          >
            {PerbaikanForm()}
          </div>
        )}
        {useFor === "Edit Data" && (
          <div className="overflow-y-auto">{EditData()}</div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              onCancel();
              console.log(valPerbaikan);
            }}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSaving();
              SaveUpdate();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
