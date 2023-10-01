import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const incrementAsync = createAsyncThunk(
    'counter/fetchCount',
    async (amount: number) => {
        const response = await fetchCount(amount);
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);

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
