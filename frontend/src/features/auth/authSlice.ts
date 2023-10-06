import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

// JWT取得
export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    // 非同期を同期に変更
    async (authen: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        // JWTを返す
        return res.data;
    }
);

// 新規アカウント作成
export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiUrl}api/register/`, auth, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    }
);

// プロフィール作成
export const fetchAsyncCreateProf = createAsyncThunk(
    "profile/post",
    async (nickName: PROPS_NICKNAME) => {
        const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

// プロフィール更新
export const fetchAsyncUpdateProf = createAsyncThunk(
    "profile/put",
    async (profile: PROPS_PROFILE) => {
        const uploadData = new FormData();
        uploadData.append("nickName", profile.nickName);
        profile.img && uploadData.append("img", profile.img, profile.img.name);
        const res = await axios.put(
        `${apiUrl}api/profile/${profile.id}/`,
        uploadData,
        {
            headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
            },
        }
        );
        return res.data;
    }
);

// プロフィール取得
export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
    const res = await axios.get(`${apiUrl}api/myprofile/`, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data[0];
});

// プロフィール一覧
export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
    const res = await axios.get(`${apiUrl}api/profile/`, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data;
});

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
    // モーダルのステートを制御
    openSignIn: true,
    openSignUp: false,
    openProfile: false,
    // APIの処理中ローディングを管理
    isLoadingAuth: false,
    // modelsのプロフィールと整合性がありReduxで制御
    myprofile: {
        id: 0,
        nickName: "",
        userProfile: 0,
        created_on: "",
        img: "",
        },
    // プロフィールリストReduxで制御
    profiles:[
        {
            id: 0,
            nickName: "",
            userProfile: 0,
            created_on: "",
            img: "",
        },
        ],
    },
    reducers: {
        // APIにフェッチをスタートした時にフラグをtrue
        fetchCredStart(state) {
            state.isLoadingAuth = true;
        },
        // APIにフェッチを終えた時にフラグをtrue
        fetchCredEnd(state) {
            state.isLoadingAuth = false;
        },
        // サインイン時のmodalを制御
        setOpenSignIn(state) {
            state.openSignIn = true;
        },
        resetOpenSignIn(state) {
            state.openSignIn = false;
        },
        // register用のmodalを管理
        setOpenSignUp(state) {
            state.openSignUp = true;
        },
        resetOpenSignUp(state) {
            state.openSignUp = false;
        },
        // プロフィール用のmodalを管理
        setOpenProfile(state) {
            state.openProfile = true;
        },
        resetOpenProfile(state) {
            state.openProfile = false;
        },
        // プロフィールのニックネーム用のmodalを管理
        editNickname(state, action) {
            state.myprofile.nickName = action.payload;
        },
    },
    extraReducers: (builder) => {
        // fetchAsyncLoginが正常終了した場合にJWTをローカルストレージに格納
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            localStorage.setItem("localJWT", action.payload.access);
        });
        // fetchAsyncCreateProfが正常終了した場合にプロフィールデータをmyprofileに格納
        builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
            state.myprofile = action.payload;
        });
        // fetchAsyncGetMyProfが正常終了した場合にプロフィールデータをmyprofileに格納
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
            state.myprofile = action.payload;
        });
        // fetchAsyncGetProfsが正常終了した場合にプロフィール全データをprofilesに格納
        builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
            state.profiles = action.payload;
        });
        // fetchAsyncUpdateProfが正常終了した場合に更新したプロフィールとIDが一致するものを置き換える
        builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
                state.myprofile = action.payload;
                state.profiles = state.profiles.map((prof) =>
                prof.id === action.payload.id ? action.payload : prof
            );
        });
    },
});

export const {
    fetchCredStart,
    fetchCredEnd,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    setOpenProfile,
    resetOpenProfile,
    editNickname,
} = authSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export default authSlice.reducer;
