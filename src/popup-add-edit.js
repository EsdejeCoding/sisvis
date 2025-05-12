import React, { useState } from "react";
import { FindPosts, updatePost } from "./data-handler";

export default function PopupAddEdit({ useFor, data, onCancel, onSaving }) {
  const Data = { ...data };
  const interFaceType = ["Tambah Perbaikan", "Edit Data"][useFor];
  const [dataCustomer, setDataCustomer] = useState({ ...Data });
  const [tambahLength, setTambahLength] = useState(0);
  const [valKeluhan, setValKeluhan] = useState([...dataCustomer.keluhan]);
  const [valPerbaikan, setValPerbaikan] = useState([]);
  const [editPerbaikan, setEditPerbaikan] = useState([
    ...dataCustomer.perbaikan,
  ]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [listTambah, setListTambah] = useState({ keluhan: [], perbaikan: [] });
  const [searchEventIndex, setSearchEventIndex] = useState({
    event: false,
    index: null,
  });
  const [listEvent, setListEvent] = useState([]);
  const [optionSearch, setOptionSearch] = useState([]);
  const [selectedSearch, setSelectedSeacrh] = useState(null);

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
      } else setSearchEventIndex({ event: false, index: null });
    } catch (error) {}
  };

  const SaveUpdate = async () => {
    if (useFor === 0) {
      try {
        const updateData = await updatePost("servis", data.id, {
          ...dataCustomer,
          total: (() => {
            let total = 0;
            valPerbaikan.map((sbt) => {
              total += sbt.subtotal;
            });
            return total;
          })(),
        });
      } catch (error) {}
    } else {
      try {
        const updateData = await updatePost("servis", data.id, {
          ...dataCustomer,
          perbaikan: [...editPerbaikan, ...valPerbaikan],
          total: (() => {
            let total = 0;
            [...editPerbaikan, ...valPerbaikan].map((sbt) => {
              total += sbt.subtotal;
            });
            return total;
          })(),
        });
      } catch (error) {}
    }
  };

  const OptionSearchBox = (i1, i2, key, from) => {
    if (listEvent[i1] && optionSearch.length > 0) {
      console.log("evlis " + i1, listEvent[i1]);
      return (
        <div className="bg-white border border-2 border-t-0 border-blue-500 rounded-b-lg w-xl p-4 pt-2 absolute z-[100] cursor-pointer">
          <ul>
            {optionSearch.map((dataSearch, index) => {
              return (
                <li
                  key={index}
                  className="hover:bg-blue-100"
                  onClick={(e) => {
                    if (from === "TAMBAH") {
                      valPerbaikan[tambahLength] = {
                        id: dataSearch.id,
                        nama: dataSearch.nama,
                      };
                      setValPerbaikan(valPerbaikan);
                    }
                    if (from === "EDIT") {
                      editPerbaikan[i1] = {
                        ...editPerbaikan[i1],
                        id: dataSearch.id,
                        nama: dataSearch.nama,
                      };
                      setEditPerbaikan(editPerbaikan);
                      setDataCustomer((prv) => ({
                        ...prv,
                        perbaikan: editPerbaikan,
                      }));
                      console.log("ruwet", editPerbaikan);
                    }
                    listEvent[i1] = false;
                    setListEvent(listEvent);
                    setSelectedSeacrh(index);
                    //e.target.parentElement.parentElement.previousSibling.children[0].value =
                    // data.nama;
                    setSearchEventIndex({ event: false, index: null });
                  }}
                >
                  {dataSearch.nama}
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

  const GetInputForm = (
    event,
    indexArray = false,
    type = undefined,
    forState = undefined
  ) => {
    const { id, value } = event.target;

    if (indexArray !== false) {
      if (type === "keluhan") {
        const updatedKeluhan = [...dataCustomer.keluhan];
        updatedKeluhan[indexArray] = value;
        setDataCustomer((prv) => ({
          ...prv,
          keluhan: updatedKeluhan,
        }));
      }
      if (type === "perbaikan" || type === "qty") {
        if (type === "perbaikan") {
          if (forState === "TAMBAH") {
            valPerbaikan[tambahLength] = {
              ...valPerbaikan[tambahLength],
              nama: value,
            };
            setValPerbaikan(valPerbaikan);
            listEvent[indexArray - tambahLength] = true;

            setListEvent(listEvent);
          }
          if (forState === "EDIT") {
            //const updatedPerbaikan = [...dataCustomer.perbaikan]; // membuat salinan array
            // updatedPerbaikan[indexArray] = {
            //   ...updatedPerbaikan[indexArray],
            //  nama: value,
            //  }; // memperbarui nama tanpa mutasi
            editPerbaikan[indexArray] = {
              ...editPerbaikan[indexArray],
              nama: value,
            };
            setEditPerbaikan(editPerbaikan);
            setDataCustomer((prev) => ({
              ...prev,
              perbaikan: editPerbaikan, // memperbarui dengan salinan array
            }));

            listEvent[indexArray - tambahLength] = true;
            setListEvent(listEvent);
          }
          SearchData(value);
          setSearchEventIndex({ event: true, index: indexArray });
        }
        if (type === "qty") {
          if (forState === "TAMBAH") {
            valPerbaikan[tambahLength] = {
              ...valPerbaikan[tambahLength],
              qty: value,
              subtotal:
                value *
                (() => {
                  try {
                    return optionSearch[selectedSearch].harga;
                  } catch (error) {}
                  return 0;
                })(),
            };
            setValPerbaikan(valPerbaikan);
          }
          if (forState === "EDIT") {
            const apdet = [...dataCustomer.perbaikan];
            apdet[indexArray]["qty"] = value;
            apdet[indexArray] = {
              ...apdet[indexArray],
              subtotal:
                value *
                (() => {
                  try {
                    return optionSearch[selectedSearch].harga;
                  } catch (error) {}
                  return 0;
                })(),
            };
            setEditPerbaikan(apdet);
            setDataCustomer((prvSt) => ({
              ...prvSt,
              perbaikan: editPerbaikan,
            }));
          }
        }
      }
    } else {
      //dataCustomer.perbaikan[indexArray].nama = "gams";
      console.log("mbuhhhhh", dataCustomer.perbaikan);
      setDataCustomer((prvSt) => ({
        ...prvSt,
        //perbaikan: [...dataCustomer.perbaikan],
        [id]: value,
      }));
    }
  };

  const TambahInput = (key, indexCol = 0) => {
    console.log("tinp " + listEvent, tambahLength + indexCol);
    return (
      <div className="relative">
        <div className="search-wrap w-full flex justify-between gap-2">
          <input
            inputadd={"true"}
            type="text"
            className={
              key +
              " w-9/12 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
            onBlur={(e) => {
              listEvent[tambahLength + indexCol] = false;
              setListEvent(listEvent);
            }}
            onChange={(e) => {
              GetInputForm(e, tambahLength + indexCol, key, "TAMBAH");
              //console.log("gendeng", indexCol);
              //console.log()
            }}
            value={(() => {
              try {
                return valPerbaikan[tambahLength].nama;
              } catch (error) {}
              return "";
            })()}
          />
          <input
            inputadd={"true"}
            type="number"
            className={
              "w-3/12 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
            onChange={(e) => {
              GetInputForm(e, tambahLength + indexCol, "qty", "TAMBAH");
            }}
            value={(() => {
              try {
                return valPerbaikan[tambahLength].qty;
              } catch (error) {}
              return "";
            })()}
          />
        </div>

        {listEvent[indexCol] && (
          <>
            {OptionSearchBox(
              indexCol,
              0 + data.perbaikan.length,
              key,
              "TAMBAH"
            )}
          </>
        )}
        <div
          className="font-bold cursor-pointer"
          onClick={(e) => {
            console.log("TAMPER", valPerbaikan);
            let lgt = tambahLength;
            setTambahLength(lgt + 1);
            setDataCustomer((prv) => ({
              ...prv,
              perbaikan: [...data.perbaikan, ...valPerbaikan],
            }));
            setListTambah((prv) => ({
              ...prv,
              perbaikan: [...valPerbaikan],
            }));
            setSearchEventIndex({ event: false, index: null });
            setSelectedSeacrh(null);
          }}
        >
          + Tambah Perbaikan
        </div>
        <ul className="pl-4">
          {listTambah.perbaikan.map((elem, index) => {
            return (
              <>
                <li key={index} className="list-disc">
                  {elem.nama} x {elem.qty} = {elem.subtotal}
                </li>
              </>
            );
          })}
        </ul>
      </div>
    );
  };

  const EditData = () => {
    return (
      <div className="flex flex-col gap-4 w-full max-h-[75vh] m-auto mb-4">
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
                            {val === "keluhan" ? (
                              <>
                                <input
                                  inputadd={"false"}
                                  key={idx + val}
                                  type="text"
                                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) => {
                                    GetInputForm(e, idx, val, "EDIT");
                                  }}
                                  value={dt}
                                />
                              </>
                            ) : (
                              <>
                                <div
                                  className="search-wrap w-full flex justify-between gap-2"
                                  key={idx + val}
                                >
                                  <input
                                    inputadd={"true"}
                                    type="text"
                                    className={
                                      val +
                                      " w-9/12 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    }
                                    onBlur={(e) => {
                                      listEvent[idx] = false;
                                      setListEvent(listEvent);
                                    }}
                                    onChange={(e) => {
                                      GetInputForm(e, idx, val, "EDIT");
                                      //console.log()
                                    }}
                                    value={dt.nama}
                                  />
                                  <input
                                    inputadd={"true"}
                                    type="number"
                                    className={
                                      "w-3/12 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    }
                                    onChange={(e) => {
                                      GetInputForm(e, idx, "qty", "EDIT");
                                      //console.log()
                                    }}
                                    value={dt.qty}
                                  />
                                </div>

                                {OptionSearchBox(
                                  idx,
                                  searchEventIndex.index,
                                  val,
                                  "EDIT"
                                )}
                              </>
                            )}
                          </div>
                        );
                    })}

                    {val === "perbaikan" ? (
                      <>
                        <br />
                        <hr />
                        {TambahInput(val, data.perbaikan.length)}
                      </>
                    ) : (
                      ""
                    )}
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
      </div>
    );
  };

  const PerbaikanForm = () => {
    return (
      <div className="flex flex-col gap-4 w-full max-h-[75vh] m-auto mb-4">
        {TambahInput("perbaikan")}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          {interFaceType}
        </h3>
        {useFor === 0 && (
          <div
            className={
              tambahLength > 3 ? "overflow-y-auto" : "overflow-y-visible"
            }
          >
            {PerbaikanForm()}
          </div>
        )}
        {useFor === 1 && <div className="overflow-y-auto">{EditData()}</div>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              onCancel();
              setDataCustomer((prv) => ({
                ...prv,
                perbaikan: [...editPerbaikan, ...valPerbaikan],
              }));
              console.log("dakon", dataCustomer);
            }}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSaving();
              SaveUpdate();
              console.log(valPerbaikan);
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
