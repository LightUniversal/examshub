import { apiSlice } from "./apiSlice";
import { QUESTION_URL } from "../constants";

// Create an instance of the questionApiService
export const questionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => {
        addQuestions: builder.mutation({
            query:(data) => ({
                url: QUESTION_URL,
                method: "POST",
                body:{...data}
            })
        })
    }
})