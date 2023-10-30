import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/post/`;
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comment/`;

export const postSlice = createSlice({
    name: "post",
    initialState: {
        // fetchステートを管理
        isLoadingPost: false,
        // 新規モーダルステート
        openNewPost: false,
        posts: [
        {
            id: 0,
            title: "",
            userPost: 0,
            created_on: "",
            img: "",
            liked: [0],
        },
        ],
        comments: [
        {
            id: 0,
            text: "",
            userComment: 0,
            post: 0,
        },
        ],
    },
    reducers: {
        fetchPostStart(state) {
            state.isLoadingPost = true;
        },
        fetchPostEnd(state) {
            state.isLoadingPost = false;
        },
        setOpenNewPost(state) {
            state.openNewPost = true;
        },
        resetOpenNewPost(state) {
            state.openNewPost = false;
        },
    },
});