import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/axiosBaseQuery";
import { ENDPOINTS } from "../api/endpoints";

export const authApiSlice = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        signUp: builder.mutation<any, any>({
            query: (body) => ({
                url: ENDPOINTS.AUTH.SIGN_UP,
                method: 'POST',
                data: body
            })
        }),
        signIn: builder.mutation<any, any>({
            query: (body) => ({
                url: ENDPOINTS.AUTH.SIGN_IN,
                method: 'POST',
                data: body
            })
        })
    })
})

export const {
    useSignUpMutation,
    useSignInMutation
} = authApiSlice