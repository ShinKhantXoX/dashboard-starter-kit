export const useItemPayload = {
    itemCategoryCreate: {
        name: "",
        tag: "",
        remark: ""
    },
    itemCreate: {
        name: "",
        item_category_id: "",
        model: "",
        code: "",
        label: "",
        description: "",
        other_name: "",
        make_in: "",
        packing: 0,
        prebox: 0,
    },
    itemUpdate: {
        name: "",
        item_cover_photo: "",
        item_photos: "",
        item_category_id: "",
        model: "",
        code: "",
        label: "",
        description: "",
        other_name: "",
        make_in: "",
        packing: "",
        prebox: "",
        status: ""
    },
    itemChangeSatus: (user) => {
        return {
            status: user ? user.status : null
        }
    }
}