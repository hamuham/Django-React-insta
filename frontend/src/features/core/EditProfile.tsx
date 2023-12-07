import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './Core.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';

import { File } from '../types';

import {
  editNickname,
  selectProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProf,
} from '../auth/authSlice';


import { Button, TextField, IconButton } from '@material-ui/core';

const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 220,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProfile: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    // モーダルの制御
    const openProfile = useSelector(selectOpenProfile);
    // プロフィール情報
    const profile = useSelector(selectProfile);
    const [image, setImage] = useState<File | null>(null);

    // アップデート時にプロフィールを更新
    const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { id: profile.id, nickName: profile.nickName, img: image };

        await dispatch(fetchCredStart());
        await dispatch(fetchAsyncUpdateProf(packet));
        await dispatch(fetchCredEnd());
        await dispatch(resetOpenProfile());
    };

    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    return (
        <div>EditProfile</div>
    )
}

export default EditProfile