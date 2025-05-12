// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://culszone.store/api/zakat/",
  // baseURL: "http://localhost:3003/",
});

// Fungsi untuk mendapatkan data
export const getPosts = async (key) => {
  try {
    const response = await api.get("/" + key);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};
export const FindPosts = async (key, quer = false) => {
  try {
    const response = await api.get(
      "/" + key + (quer !== false ? "?" + quer : "")
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};
export const loginAkun = async (user, password) => {
  try {
    let response = await api.get(`/akun?username=${user}&password=${password}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};
// Fungsi untuk membuat data baru
export const createPost = async (key, post) => {
  try {
    const response = await api.post("/" + key, post);
    return response.data;
  } catch (error) {
    console.error("Error creating post", error);
    throw error;
  }
};

// src/api.js

export const updatePost = async (dataKey, id, updatedPost) => {
  try {
    const response = await api.put(`/${dataKey}?id=${id}`, updatedPost);
    return response.data;
  } catch (error) {
    console.error("Error updating post", error);
    throw error;
  }
};

export const deletePost = async (query, id) => {
  try {
    await api.delete(`/${query}?id=${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting post", error);
    throw error;
  }
};
