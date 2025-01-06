import { createSlice } from "@reduxjs/toolkit";
import type { ImageInfo } from "./types";

interface ImageState {
  image: ImageInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  image: null,
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPreview: (state, action) => {
      if (state.image) {
        state.image.preview = action.payload;
      }
    },
    removeImage: (state) => {
      state.image = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setImage, setPreview, removeImage, setLoading, setError } =
  imageSlice.actions;
export default imageSlice.reducer;
