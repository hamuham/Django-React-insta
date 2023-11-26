import React, { useState } from 'react'
import styles from './Post.module.css'

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Divider, Checkbox } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';

import AvatarGroup from '@material-ui/lab/AvatarGroup';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';

import { selectProfiles } from '../auth/authSlice';

import {
    selectComments,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncPostComment,
    fetchAsyncPatchLiked,
  } from './postSlice';

import { PROPS_POST } from "../types";

// 小さいアバター表示を定義
const useStyles = makeStyles((theme) => ({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(1),
    },
}));

const Post: React.FC<PROPS_POST> = ({
        postId,
        loginId,
        userPost,
        title,
        imageUrl,
        liked,
    }) => {
        const classes = useStyles();
        const dispatch: AppDispatch = useDispatch();
        const profiles = useSelector(selectProfiles);
        const comments = useSelector(selectComments);
        const [text, setText] = useState("");

        // idと合致したコメントを抽出
        const commentsOnPost = comments.filter((com) => {
            return com.post === postId;
        });

        // 投稿をしたプロフィールを抽出
        const prof = profiles.filter((prof) => {
            return prof.userProfile === userPost;
        });

        // コメント作成
        const postComment = async (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            const packet = { text: text, post: postId };
            await dispatch(fetchPostStart());
            await dispatch(fetchAsyncPostComment(packet));
            await dispatch(fetchPostEnd());
            setText("");
        };

        const handlerLiked = async () => {
            const packet = {
                id: postId,
                title: title,
                current: liked,
                new: loginId,
            };
            await dispatch(fetchPostStart());
            await dispatch(fetchAsyncPatchLiked(packet));
            await dispatch(fetchPostEnd());
        };

    return (
        <div>Post</div>
    )
}

export default Post