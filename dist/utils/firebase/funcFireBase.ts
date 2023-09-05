/* eslint-disable @typescript-eslint/indent */
/* eslint-disable import/no-extraneous-dependencies */
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from './upload-file.controller';

const uploadImages = async (data: any, fileName: string) => {
    const storageRef = ref(storage, `${fileName}/${data?.originalname}`);
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, data?.buffer, {
        contentType: data?.mimetype,
    });
    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { downloadURL, nameFile: `${fileName}/${data?.originalname}` };
};

const deleteFile = (fileName: any) => {
    try {
        const desertRef = ref(storage, `${fileName}`);
        return deleteObject(desertRef).then(() => {
            // File deleted successfully'
            return { mess: 'Xóa file thành công.' };
        }).catch((error: any) => {
            return error;
            // Uh-oh, an error occurred!
        });
    } catch (error: any) {
        return error;
    }
};


export { uploadImages, deleteFile };