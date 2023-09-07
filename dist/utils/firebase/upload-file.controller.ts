/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/indent */
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import multer from 'multer';
import config from '../../config/firebase.config';

//Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
export const upload = multer({ storage: multer.memoryStorage() });

export const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
    const time = today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
    const dateTime = date + '' + time;
    return dateTime;
};