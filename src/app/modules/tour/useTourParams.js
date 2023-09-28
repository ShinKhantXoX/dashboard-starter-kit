export const tourParamsInit = {
    /** Paginate Query */
    page: 1,
    per_page: 10,

    /** Sorting Query */
    order: "id",
    sort: "asc",

    /** Search Query */
    search: "",
    columns: `
    id,name,city_id
    `,
};