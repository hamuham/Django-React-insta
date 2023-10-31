import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/post/`;
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comment/`;

// 投稿の一覧を取得
export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
    const res = await axios.get(apiUrlPost, {
        headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data;
});

// 投稿の新規作成
export const fetchAsyncNewPost = createAsyncThunk(
    "post/post",
    async (newPost: PROPS_NEWPOST) => {
        const uploadData = new FormData();
        uploadData.append("title", newPost.title);
        newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
        const res = await axios.post(apiUrlPost, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

// 投稿の中のいいねを更新する
export const fetchAsyncPatchLiked = createAsyncThunk(
    "post/patch",
    async (liked: PROPS_LIKED) => {
        // 現在のcurrentデータを格納
        const currentLiked = liked.current;
        const uploadData = new FormData();

        let isOverlapped = false;
        // すでにいいねされている場合に解除
        currentLiked.forEach((current) => {
            if (current === liked.new) {
                isOverlapped = true;
            } else {
                uploadData.append("liked", String(current));
            }
        });

        if (!isOverlapped) {
            uploadData.append("liked", String(liked.new));
        } else if (currentLiked.length === 1) {
            // ディスパッチでは配列を空にできないため初期化
            uploadData.append("title", liked.title);
            const res = await axios.put(`${apiUrlPost}${liked.id}/`, uploadData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.localJWT}`,
                },
            });
            return res.data;
        }
        const res = await axios.patch(`${apiUrlPost}${liked.id}/`, uploadData, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data;
    }
);

// コメント一覧取得
export const fetchAsyncGetComments = createAsyncThunk(
    "comment/get",
    async () => {
        const res = await axios.get(apiUrlComment, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

// コメント新規作成
export const fetchAsyncPostComment = createAsyncThunk(
    "comment/post",
    async (comment: PROPS_COMMENT) => {
        const res = await axios.post(apiUrlComment, comment, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

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