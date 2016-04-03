

var validationCode = {
    user : {
        usernameWrong : 1001,
        passwordWrong : 1002,
        emailWrong : 1003,
        mobileWrong : 1004,

        usernameExist : 1011,
        passwordExist : 1012,
        emailExist : 1013,
        mobileExist : 1014,

        usernameNotFound : 1101,
        passwordNotMatch : 1102,

        messageType : 1201
    },

    token : {
        tokenNotFound : 4001,
        userNotFound : 4002,
        tokenDecodeWrong : 4005,
        tokenExpired : 4007,
        tokenLengthWrong : 4008

    }
};






module.exports = validationCode;