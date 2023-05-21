import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type ImageCacheState = {
  filename: string;
};

const imageCacheAdapter = createEntityAdapter<ImageCacheState>({
  selectId: (model) => model.filename,
});

const initialState = imageCacheAdapter.getInitialState();

export const imageCacheSlice = createSlice({
  name: "imageCache",
  initialState,
  reducers: {
    addCache: imageCacheAdapter.upsertOne,
  },
});

export const { addCache } = imageCacheSlice.actions;

export const { selectById: selectImageCacheById } =
  imageCacheAdapter.getSelectors((state: RootState) => state.imageCache);

export const imageCacheSliceReducer = imageCacheSlice.reducer;
