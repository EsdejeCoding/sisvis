import React, { useEffect, useState } from "react";
import NavHead from "./nav-head";
import { createPost, FindPosts, updatePost, deletePost } from "./data-handler";
import ConfirmAlert from "./confirm-alert";
import AddEditForm from "./add-edit-form";
import PopupAddEdit from "./popup-add-edit";
import { LoginHandler } from "./login-handler";

export default function Home(prop) {
  //if (!LoginHandler().status) window.location.href = "/#/login";

  const dateNow = [new Date()];
  dateNow[1] = [
    String(dateNow[0].getDate()).padStart(2, "0"),
    String(dateNow[0].getMonth() + 1).padStart(2, "0"),
    String(dateNow[0].getFullYear()),
  ];
  const optStatus = [
    ["Antri", "rgb(234 88 12)"],
    ["Ditangani", "rgb(37 99 235)"],
    ["Selesai", "rgb(22 163 74)"],
  ];
  const [dataForm, setDataForm] = useState({
    pemilik: "",
    telepon: "",
    barang: "",
    keluhan: [""],
  });
  const [effectEvent, setEffectEvent] = useState(null);
  const [keluhanLength, setKeluhanLength] = useState(1);
  const [valKeluhan, setValKeluhan] = useState([]);
  const [dataAntrian, setDataAntrian] = useState([]);
  const [submitedData, setSubmitedData] = useState(false);
  const [floatingForm, setFloatingForm] = useState({
    event: false,
    useFor: undefined,
  });
  const [dataCustomer, setDataCustomer] = useState({});
  const [showAlert, setShowAlert] = useState({
    event: false,
    selected: 0,
    call: false,
  });
  const [saveUpdate, setSaveUpdate] = useState(false);

  const handleConfirm = () => {
    if (!showAlert.call) {
      UpdateStatus(dataCustomer.id, {
        ...dataCustomer,
        status: showAlert.selected,
      });
      if (showAlert.selected == 2)
        setShowAlert((prv) => ({ ...prv, call: true }));
    }
    if (showAlert.call || showAlert.selected == 1) {
      if (showAlert.call)
        window.open(
          `https://web.whatsapp.com/send/?phone=${dataCustomer.telepon}&text&type=phone_number&app_absent=0`,
          "_blank"
        );
      setShowAlert((prv) => ({ ...prv, event: false, call: false }));
    }
    if (showAlert.selected === false && showAlert.call === false) {
      DeleteData(dataCustomer.id);
      setShowAlert((prv) => ({ ...prv, event: false, call: false }));
    }
    setEffectEvent(Math.random());
  };

  const handleCancel = () => {
    setShowAlert((prv) => ({
      event: false,
      selected: 0,
      call: false,
    }));
    setEffectEvent(Math.random());
  };

  useEffect(() => {
    if (submitedData) {
      AddServis();
      setDataForm({
        pemilik: "",
        telepon: "",
        barang: "",
        keluhan: [""],
      });
      setSubmitedData(false);
      setKeluhanLength(1);
      setValKeluhan([]);
      setShowAlert({
        event: false,
        selected: 0,
        call: false,
      });
    }
    FindDataAntrian();
    setSaveUpdate(false);
  }, [effectEvent]);

  const SubmitData = (event) => {
    event.preventDefault();
    setSubmitedData(true);
    FindDataAntrian();
    setEffectEvent(Math.random());
  };

  const AddServis = async () => {
    try {
      const servisNowLength = await FindPosts(
        "servis",
        `tanggal=${dateNow[1][0]}${dateNow[1][1]}${dateNow[1][2]}`
      );
      const servis = await createPost("servis", {
        ...dataForm,
        tanggal: `${dateNow[1][0]}${dateNow[1][1]}${dateNow[1][2]}`,
        antrian: servisNowLength.length + 1,
        status: 0,
        perbaikan: [],
        total: 0,
      });
    } catch (error) {}
  };

  const FindDataAntrian = async () => {
    let result = [];
    try {
      const findData = await FindPosts("servis");
      result = findData;
      setDataAntrian(result);
      setEffectEvent(2);
    } catch (error) {}
  };

  const UpdateStatus = async (id, dt) => {
    try {
      const updateStatus = await updatePost("servis", id, dt);
    } catch (error) {}
  };

  const DeleteData = async (id) => {
    try {
      const deleteData = await deletePost("servis", id);
    } catch (error) {}
  };

  const GetInputForm = (event, indexArray = false) => {
    const { id, value } = event.target;
    if (indexArray === false)
      setDataForm((prvSt) => ({
        ...prvSt,
        [id]: value,
      }));
    else {
      valKeluhan[indexArray] = value;
      setValKeluhan(valKeluhan);
      setDataForm((prvSt) => ({
        ...prvSt,
        keluhan: valKeluhan,
      }));
    }
  };

  //if (LoginHandler().status)
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <NavHead active={prop.page} />
      <main className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6">
        <form onSubmit={SubmitData} className="flex flex-col gap-4 w-96 m-auto">
          {Object.keys(dataForm).map((el, index) => {
            if (index < 3)
              return (
                <div key={"home" + index}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {el}
                  </label>
                  <input
                    id={el}
                    type="text"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={GetInputForm}
                    value={dataForm[el]}
                  />
                </div>
              );
          })}
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              keluhan
            </label>

            <div
              className="font-bold cursor-pointer"
              onClick={(e) => {
                let lgt = keluhanLength;
                setKeluhanLength(lgt + 1);
              }}
            >
              + Tambah Keluhan
            </div>
            {(() => {
              let result = [];
              for (let i = 0; i < keluhanLength; i++) {
                result.push(
                  <input
                    type="text"
                    className="keluhan mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      GetInputForm(e, i);
                    }}
                    value={dataForm.keluhan[i]}
                  />
                );
              }
              return result;
            })()}
          </div>

          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700">
            Tambahkan
          </button>
        </form>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <div className="flex gap-[10px] mb-3">
            <span>Order : </span>
            <h3 className="font-bold text-md">
              {dateNow[1][0] + "/" + dateNow[1][1] + "/" + dateNow[1][2]}
            </h3>
          </div>
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-center">Pemilik</th>
                <th className="px-4 py-2 text-center">Telepon</th>
                <th className="px-4 py-2 text-center">Barang</th>
                <th className="px-4 py-2 text-center">Keluhan</th>
                <th className="px-4 py-2 text-center">Diperbaiki</th>
                <th className="px-4 py-2 text-center">Total Harga</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700">
              {dataAntrian.map((elem, index) => {
                return (
                  <>
                    <tr className="border-t" key={index + "tbl"}>
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{elem.pemilik}</td>
                      <td className="px-4 py-2 border">{elem.telepon}</td>
                      <td className="px-4 py-2 border">{elem.barang}</td>
                      <td className="px-4 py-2 border">
                        <ul>
                          {elem.keluhan.map((kel, idx) => {
                            return <li key={idx}>{kel}</li>;
                          })}
                        </ul>
                      </td>
                      <td className="px-4 py-2 border">
                        <ul>
                          {elem.perbaikan.length > 0
                            ? elem.perbaikan.map((prb, idx) => {
                                return (
                                  <li key={idx} className="list-disc">
                                    {prb.nama}
                                  </li>
                                );
                              })
                            : ""}
                          <li
                            className="font-bold text-blue-500 cursor-pointer"
                            onClick={() => {
                              setDataCustomer(elem);
                              setFloatingForm({
                                event: true,
                                useFor: 0,
                              });
                            }}
                          >
                            + Tambah
                          </li>
                        </ul>
                      </td>
                      <td className="px-4 py-2 border">{elem.total}</td>
                      <td className="px-4 py-2 border">
                        <select
                          className="font-bold"
                          onChange={(e) => {
                            const val = e.target.value;
                            const notel = elem.telepon;
                            setShowAlert({ event: true, selected: val });

                            if (val > 0) setDataCustomer(elem);

                            /**/
                            //e.target.style.color = optStatus[val][1];
                          }}
                          value={elem.status}
                          style={
                            showAlert.event
                              ? {
                                  color:
                                    optStatus[
                                      showAlert.selected !== false
                                        ? showAlert.selected
                                        : 0
                                    ][1],
                                }
                              : { color: optStatus[elem.status][1] }
                          }
                        >
                          <option
                            value="0"
                            className="text-orange-600 font-medium"
                          >
                            Antri
                          </option>
                          <option
                            value="1"
                            className="text-blue-600 font-medium"
                          >
                            Ditangani
                          </option>
                          <option
                            value="2"
                            className="text-green-600 font-medium"
                          >
                            Selesai
                          </option>
                        </select>
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex flex-col gap-[10px]">
                          <button
                            className="bg-green-500 w-16 p-2 text-white"
                            onClick={() => {
                              const notel = elem.telepon;
                              window.open(
                                `https://web.whatsapp.com/send/?phone=${notel}&text&type=phone_number&app_absent=0`,
                                "_blank"
                              );
                            }}
                          >
                            Hubungi
                          </button>
                          <button
                            className="bg-blue-500 w-16 p-2 text-white"
                            onClick={() => {
                              setDataCustomer(elem);
                              setFloatingForm({
                                event: true,
                                useFor: 1,
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-300 w-16 p-2"
                            onClick={(e) => {
                              setDataCustomer(elem);
                              setShowAlert({
                                event: true,
                                selected: false,
                                call: false,
                              });
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
              {/* Tambah baris lain sesuai kebutuhan */}
            </tbody>
          </table>
        </div>
      </main>
      {showAlert.event && (
        <ConfirmAlert
          customer={dataCustomer.pemilik}
          selected={showAlert.selected}
          call={showAlert.call}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {floatingForm.event && (
        <PopupAddEdit
          useFor={floatingForm.useFor}
          data={dataCustomer}
          onCancel={(e) => {
            setFloatingForm({ event: false, useFor: undefined });
            console.log(dataAntrian);
          }}
          onSaving={(e) => {
            setFloatingForm({ event: false, useFor: undefined });
            setSaveUpdate(true);
            setEffectEvent(Math.random());
          }}
        />
      )}
    </div>
  );
  //else window.location.href = "/#/login";
}
