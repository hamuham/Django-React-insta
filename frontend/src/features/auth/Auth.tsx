import React from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Auth.module.css";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";

import {
    selectIsLoadingAuth,
    selectOpenSignIn,
    selectOpenSignUp,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
} from "./authSlice";

const customStyles = {
    overlay: {
        backgroundColor: "#777777",
    },
    content: {
        top: "55%",
        left: "50%",

        width: 280,
        height: 350,
        padding: "50px",

        transform: "translate(-50%, -50%)",
    },
};

// TypeScriptの場合ファンクショナルコンポーネントにも型が必要
const Auth: React.FC = () => {
    Modal.setAppElement("#root");
    const openSignIn = useSelector(selectOpenSignIn);
    const openSignUp = useSelector(selectOpenSignUp);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const dispatch: AppDispatch = useDispatch();

    return (
        <>
        <Modal
            isOpen={openSignUp}
            // モーダル以外の場所をクリックした時openSignUpをリセット
            onRequestClose={async () => {
                await dispatch(resetOpenSignUp());
            }}
            style={customStyles}
        >
            <Formik
                // 初期状態のエラーを定義
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: "" }}
                onSubmit={async (values) => {
                    // ステートを管理
                    await dispatch(fetchCredStart());
                    const resultReg = await dispatch(fetchAsyncRegister(values));

                    // 新規ユーザーの作成が成功した時
                    if (fetchAsyncRegister.fulfilled.match(resultReg)) {
                        await dispatch(fetchAsyncLogin(values));
                        await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));

                        await dispatch(fetchAsyncGetProfs());
                        // await dispatch(fetchAsyncGetPosts());
                        // await dispatch(fetchAsyncGetComments());
                        await dispatch(fetchAsyncGetMyProf());
                    }
                    await dispatch(fetchCredEnd());
                    await dispatch(resetOpenSignUp());
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email("email format is wrong")
                        .required("email is must"),
                    password: Yup.string().required("password is must").min(4),
                })}
            ></Formik>
        </Modal>

        </>
    );
};

export default Auth;