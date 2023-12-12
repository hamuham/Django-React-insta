import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';

import styles from './Core.module.css';

import { File } from '../types';

import {
  selectOpenNewPost,
  resetOpenNewPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncNewPost,
} from '../post/postSlice';

import { Button, TextField, IconButton } from '@material-ui/core';
import { MdAddAPhoto } from 'react-icons/md';

const customStyles = {
  content: {
    top: '55%',
    left: '50%',

    width: 280,
    height: 220,
    padding: '50px',

    transform: 'translate(-50%, -50%)',
  },
};

const NewPost: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const openNewPost = useSelector(selectOpenNewPost);

    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState('');

    const handlerEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput?.click();
    };

    return (
        <div>NewPost</div>
    )
}

export default NewPost