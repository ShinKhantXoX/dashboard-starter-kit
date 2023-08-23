export const userPayload = {
    userCreate: {
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: ""
    },
    userUpdate: {
        name: "",
        username: "",
        email: "",
        phone: "",
        profile: "",
        status: null
    },
    userChangeSatus: (user) => {
        return {
            status: user ? user.status : null
        }
    }
}