const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

async function generateId() {
  const { nanoid } = await import("nanoid");
  return nanoid(8);
}

const app = express();
app.use(express.json()); // Middleware untuk parsing JSON

app.use(cors());

const DB_PATH = path.join(__dirname, "db.json");

// Fungsi untuk membaca database JSON
const readDatabase = () => {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
};

// Fungsi untuk menulis ke database JSON
const saveDatabase = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};

app.get("/idi", async (req, res) => {
  const aidi = await generateId();
  res.json({ idi: aidi });
});

app.get("/", (req, res) => {
  res.json(readDatabase());
});

// **GET: Ambil semua user**
app.get("*", (req, res) => {
  const path = req.path.substring(1); // Ambil path tanpa "/"
  const db = readDatabase();
  if (!db[path]) {
    return res.status(404).json([]);
  }

  let filteredData = db[path]; // Ambil data sesuai path (users/admin)
  const queryParams = req.query; // Ambil query parameter

  // Filter data berdasarkan query
  Object.keys(queryParams).forEach((key) => {
    keyInput = key.includes(".") ? key.split(".")[0] : key;
    const value = queryParams[key];
    filteredData = filteredData.filter((item) => {
      if (
        item[keyInput.replace("_like", "").replace("_not", "")] !== undefined
      ) {
        if (typeof item[keyInput] === "number") {
          return item[keyInput] === parseInt(value);
        } else if (Array.isArray(item[keyInput])) {
          if (key.includes(".")) {
            const childKey = key.split(".");
            const rst = item[childKey[0]].some((arr) => {
              return typeof arr[childKey[1]] === "boolean"
                ? String(arr[childKey[1]]) === value
                : String(arr[childKey[1]]).toLowerCase() ===
                    String(value).toLowerCase();
            });

            return rst;
          } else
            return item[keyInput].some((arr) =>
              typeof arr === "boolean"
                ? String(arr) === value
                : arr.toLowerCase().includes(value.toLowerCase())
            );
        } else if (typeof item[keyInput] === "string") {
          return item[keyInput].toLowerCase() === value.toLowerCase();
        } else if (keyInput.includes("_like")) {
          return item[keyInput.replace("_like", "")]
            .toLowerCase()
            .includes(value.toLowerCase());
        } else if (keyInput.includes("_not")) {
          const keyNot = keyInput.replace("_not", "");
          if (Array.isArray(item[keyNot])) {
            return !item[keyNot].some((arr) =>
              typeof arr === "boolean"
                ? String(arr) === value
                : arr.toLowerCase().includes(value.toLowerCase())
            );
          } else
            return !item[keyNot].toLowerCase().includes(value.toLowerCase());
        } else if (typeof item[keyInput] === "boolean") {
          return item[keyInput] === (value === "true");
        }
      }
      return false;
    });
  });

  res.json(filteredData);
});

app.post("*", async (req, res) => {
  const path = req.path.substring(1);
  const db = readDatabase();

  if (!db[path]) {
    return res.status(404).json({ success: false, error: "Not Found" });
  }
  const idData = await generateId();
  const newData = {
    id: idData,
    ...req.body,
  }; // ID auto-increment
  db[path].push(newData);
  saveDatabase(db);

  res
    .status(201)
    .json({ success: true, message: "Data added successfully", data: newData });
});

app.put("*", (req, res) => {
  const path = req.path.substring(1);
  const db = readDatabase();
  const { id, ...updateData } = req.body;

  if (!db[path]) {
    return res.status(404).json({ success: false, error: "Not Found" });
  }

  const index = db[path].findIndex((item) => item.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({
        success: false,
        error: "Data not FOUND",
        path: req.path,
        body: req.body,
      });
  }

  db[path][index] = { ...db[path][index], ...updateData };
  saveDatabase(db);

  res.json({
    success: true,
    message: "Data updated successfully",
    status: true,
    path: req.path,
    body: req.body,
    data: db[path][index],
  });
});

app.delete("*", (req, res) => {
  const path = req.path.substring(1);
  const db = readDatabase();
  const { id } = req.query;

  if (!db[path]) {
    return res
      .status(404)
      .json({
        success: false,
        error: "Not Found",
        path: req.path,
        body: req.body,
      });
  }

  const index = db[path].findIndex((item) => item.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({
        success: false,
        error: "Data not founded",
        path: req.path,
        body: req.body,
        query: req.query,
      });
  }

  const deletedData = db[path].splice(index, 1);
  saveDatabase(db);

  res.json({
    success: true,
    message: "Data deleted successfully",
    data: deletedData,
  });
});
/*const obj = JSON.parse('[{"id_pembelian":101,"customer":"Andi Wijaya","tanggal":"2025-03-20","barang_dibeli":[{"id_barang":1,"jumlah":1},{"id_barang":2,"jumlah":2}]},{"id_pembelian":102,"customer":"Siti Rahma","tanggal":"2025-03-21","barang_dibeli":[{"id_barang":3,"jumlah":1}]},{"id_pembelian":103,"customer":"Budi Santoso","tanggal":"2025-03-22","barang_dibeli":[{"id_barang":4,"jumlah":1},{"id_barang":5,"jumlah":1}]},{"id_pembelian":104,"customer":"Dewi Kartika","tanggal":"2025-03-23","barang_dibeli":[{"id_barang":6,"jumlah":2},{"id_barang":2,"jumlah":1}]},{"id_pembelian":105,"customer":"Rudi Hartono","tanggal":"2025-03-24","barang_dibeli":[{"id_barang":1,"jumlah":1},{"id_barang":3,"jumlah":2},{"id_barang":5,"jumlah":1}]},{"id_pembelian":106,"customer":"Lina Sari","tanggal":"2025-03-25","barang_dibeli":[{"id_barang":4,"jumlah":2},{"id_barang":6,"jumlah":1}]},{"id_pembelian":107,"customer":"Joko Susanto","tanggal":"2025-03-19","barang_dibeli":[{"id_barang":2,"jumlah":1},{"id_barang":5,"jumlah":3}]},{"id_pembelian":108,"customer":"Maria Lestari","tanggal":"2025-03-20","barang_dibeli":[{"id_barang":1,"jumlah":2},{"id_barang":4,"jumlah":1}]},{"id_pembelian":109,"customer":"Toni Saputra","tanggal":"2025-03-22","barang_dibeli":[{"id_barang":3,"jumlah":1},{"id_barang":6,"jumlah":2}]},{"id_pembelian":110,"customer":"Agus Pratama","tanggal":"2025-03-21","barang_dibeli":[{"id_barang":2,"jumlah":1},{"id_barang":5,"jumlah":1}]}]')
console.log(obj[0].barang_dibeli)
console.log(obj.filter((item)=>{
return item['customer'] === 'Budi Santoso'
}))*/
app.listen(3003, () => console.log("Server running on http://localhost:3003"));
