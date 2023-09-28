import moment from "moment";

export const datetime = (value) => {
    return moment(value).format('YYYY/MM/DD');
}