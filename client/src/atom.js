import {atom} from 'recoil'

export const isLogged= atom({
    key: 'isLogged',
    default:false,
});

export const User= atom({
    key: 'User',
    default:'',
});

export const isLoading= atom({
    key: 'isLoading',
    default:true,
});
