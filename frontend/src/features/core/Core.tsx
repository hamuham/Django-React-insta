import React from 'react'
import Auth from "../auth/Auth"

import styles from "./Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
} from "@material-ui/core";

import { MdAddAPhoto } from "react-icons/md";

import {
  editNickname,
  selectProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../auth/authSlice";

import {
  selectPosts,
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from "../post/postSlice";

import Post from "../post/Post";
import EditProfile from "./EditProfile";
import NewPost from "./NewPost";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);


const Core: React.FC = () => {
    // ディスパッチの定義、ステートを呼び出し
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const posts = useSelector(selectPosts);
    const isLoadingPost = useSelector(selectIsLoadingPost);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    return (
        <div>
            <Auth />
            <div className={styles.core_header}>
            <h1 className={styles.core_title}>SNS clone</h1>
                {profile?.nickName ? (
                    <>
                        <button
                            className={styles.core_btnModal}
                            onClick={() => {
                                dispatch(setOpenNewPost());
                                dispatch(resetOpenProfile());
                            }}
                        >
                            <MdAddAPhoto />
                        </button>
                        <div className={styles.core_logout}>
                            {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
                            <Buttonon
                                onClick={() => {
                                    localStorage.removeItem("localJWT");
                                    dispatch(editNickname(""));
                                    dispatch(resetOpenProfile());
                                    dispatch(resetOpenNewPost());
                                    dispatch(setOpenSignIn());
                                }}
                            >
                                Logout
                            </Buttonon>
                        </div>
                    </>
                ) : (
                    <div></div>
                )}
        </div>
    )
}

export default Core