export const converDataUser = (data: any) => {
    const dataView = {
        userRoles: data?.userRoles,
        _id: data?._id,
        code: data?.code,
        userNickname: data?.userNickname,
        userType: data?.userType,
        userGender: data?.userGender,
        userAdrressDesc: data?.userAdrressDesc,
        userProvinceCity: data?.userProvinceCity,
        userDistrict: data?.userDistrict,
        userCommune: data?.userCommune,
        userAge: data?.userAge,
        userEmail: data?.userEmail,
        userPhone: data?.userPhone,
        userName: data?.userName,
        userStatus: data?.userStatus,
        userImage: data?.userImage,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,

    }
    return dataView;
}